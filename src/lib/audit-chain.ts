/**
 * Browser-side mirror of the audit-stream-py hash-chained governance log
 * verification logic. Same canonical-JSON convention + ed25519/SHA-256
 * primitives the MCP audit_* tools (audit_event_compose, audit_chain_verify,
 * audit_event_inspect) preview.
 *
 * Canonical hash convention:
 *   sha256(JSON.stringify(body)) where body keys are sorted ascending and no
 *   whitespace is emitted. Matches procurement-decision-api,
 *   aeo-validator-service, aeo-graph-explorer-rs, and hash-attestation-rs.
 *
 * Chain rules:
 *   - event_id starts at 1 and increments by 1.
 *   - prev_hash[1] = '0' * 64.
 *   - prev_hash[i] = hash[i-1] for i > 1.
 *   - hash[i] = canonical_hash({event_id, kind, source, payload, prev_hash, timestamp}).
 */

export interface GovernanceEvent {
  event_id: number;
  timestamp: string;
  kind: string;
  source: string;
  payload: Record<string, unknown>;
  prev_hash: string;
  hash: string;
}

const ZERO_HASH = '0'.repeat(64);

/** Canonicalize a JSON value: sort object keys recursively, no whitespace. */
export function canonicalJSON(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return '[' + value.map(canonicalJSON).join(',') + ']';
  const keys = Object.keys(value as Record<string, unknown>).sort();
  return (
    '{' +
    keys
      .map(
        (k) => JSON.stringify(k) + ':' + canonicalJSON((value as Record<string, unknown>)[k])
      )
      .join(',') +
    '}'
  );
}

function bufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let out = '';
  for (let i = 0; i < bytes.length; i += 1) {
    out += bytes[i].toString(16).padStart(2, '0');
  }
  return out;
}

/** SHA-256 of the canonical JSON of an arbitrary value, returned as hex. */
export async function canonicalHash(value: unknown): Promise<string> {
  const data = new TextEncoder().encode(canonicalJSON(value));
  const digest = await crypto.subtle.digest('SHA-256', data);
  return bufferToHex(digest);
}

/** Body the chain hash is computed over (excludes the hash field itself). */
function eventBody(e: GovernanceEvent): Omit<GovernanceEvent, 'hash'> {
  return {
    event_id: e.event_id,
    timestamp: e.timestamp,
    kind: e.kind,
    source: e.source,
    payload: e.payload,
    prev_hash: e.prev_hash,
  };
}

export type StepStatus =
  | 'ok'
  | 'self-hash-mismatch'
  | 'prev-hash-mismatch'
  | 'event-id-non-monotonic';

export interface ChainStep {
  event_id: number;
  kind: string;
  reportedHash: string;
  recomputedHash: string;
  expectedPrevHash: string;
  reportedPrevHash: string;
  status: StepStatus;
}

export interface ChainVerifyResult {
  valid: boolean;
  checked: number;
  firstBreakAt: number | null;
  reason: string | null;
  steps: ChainStep[];
}

/** Walk a chain end-to-end. Mirrors audit-stream-py's GET /verify shape. */
export async function verifyChain(events: GovernanceEvent[]): Promise<ChainVerifyResult> {
  const steps: ChainStep[] = [];
  let prevHash = ZERO_HASH;
  let firstBreak: number | null = null;
  let reason: string | null = null;

  for (let i = 0; i < events.length; i += 1) {
    const e = events[i];
    const expectedId = i + 1;
    const recomputed = await canonicalHash(eventBody(e));

    let status: StepStatus = 'ok';
    if (e.event_id !== expectedId) {
      status = 'event-id-non-monotonic';
    } else if (e.prev_hash !== prevHash) {
      status = 'prev-hash-mismatch';
    } else if (recomputed !== e.hash) {
      status = 'self-hash-mismatch';
    }

    steps.push({
      event_id: e.event_id,
      kind: e.kind,
      reportedHash: e.hash,
      recomputedHash: recomputed,
      expectedPrevHash: prevHash,
      reportedPrevHash: e.prev_hash,
      status,
    });

    if (status !== 'ok' && firstBreak === null) {
      firstBreak = expectedId;
      reason = humanReason(status, expectedId, e);
    }
    // For chain-walk purposes, continue with the reported hash so we can
    // surface cascading breaks honestly (downstream events have the wrong
    // prev_hash too — that's a separate diagnostic).
    prevHash = e.hash;
  }

  return {
    valid: firstBreak === null,
    checked: events.length,
    firstBreakAt: firstBreak,
    reason,
    steps,
  };
}

function humanReason(s: StepStatus, id: number, e: GovernanceEvent): string {
  if (s === 'self-hash-mismatch') {
    return `Event #${id} (${e.kind}) reports a hash that doesn't match the canonical hash of its own body — payload has been tampered with.`;
  }
  if (s === 'prev-hash-mismatch') {
    return `Event #${id} (${e.kind}) declares prev_hash that doesn't match the previous event's hash — chain has been cut.`;
  }
  if (s === 'event-id-non-monotonic') {
    return `Event #${id} (${e.kind}) has event_id ${e.event_id} but expected ${id} — chain is non-monotonic.`;
  }
  return 'unknown';
}

/**
 * Build a fresh, self-consistent sample chain — six events showing a realistic
 * governance arc around the Suite's procurement story.
 */
export async function buildSampleChain(): Promise<GovernanceEvent[]> {
  const baseT = Date.parse('2026-05-28T14:00:00.000Z');
  const seeds: Array<Omit<GovernanceEvent, 'event_id' | 'prev_hash' | 'hash' | 'timestamp'> & {
    offsetMs: number;
  }> = [
    {
      kind: 'decision_card_drafted',
      source: 'procurement-decision-api',
      payload: {
        decision_id: 'SPRINGFIELD-DEC-2026-001',
        buyer: 'Springfield Unified School District',
        vendor: 'AcmeTutor Inc.',
        rubric_pass_rate: 0.83,
      },
      offsetMs: 0,
    },
    {
      kind: 'decision_card_approved',
      source: 'procurement-decision-api',
      payload: {
        decision_id: 'SPRINGFIELD-DEC-2026-001',
        status: 'approved-with-conditions',
        conditions: ['no-training-restriction', 'bias-audit-refresh', 'no-assessment-use'],
        signer: 'Dr. Jane Doe',
      },
      offsetMs: 60_000,
    },
    {
      kind: 'policy_bundle_minted',
      source: 'policy-as-code-engine',
      payload: {
        bundle_id: 'pb_kg_2026_q2_018',
        derived_from: 'SPRINGFIELD-DEC-2026-001',
        policies: 3,
        default_effect: 'deny',
      },
      offsetMs: 120_000,
    },
    {
      kind: 'request_denied',
      source: 'ibm-watsonx-governance-bridge',
      payload: {
        request_id: 'wx-req-883291',
        principal: 'springfield-teacher-1004',
        action: 'export_student_records',
        deny_reason: 'no-assessment-use condition not satisfied',
        correlation_id: 'cid_05e9f4a1',
      },
      offsetMs: 180_000,
    },
    {
      kind: 'attestation_failed',
      source: 'hash-attestation-rs',
      payload: {
        attestation_id: 'att_19a8c7d2',
        signer: 'AcmeTutor Inc.',
        method: 'ed25519',
        failure: 'signature_value did not verify against signed_hash',
      },
      offsetMs: 240_000,
    },
    {
      kind: 'watch_drifted',
      source: 'aeo-validator-service',
      payload: {
        watch_id: 'w_acmetutor_tutorcard',
        target: 'https://acmetutor.example/.well-known/tutor-card.json',
        delta: { coppa_compliance: ['pass', 'partial'] },
      },
      offsetMs: 300_000,
    },
  ];

  let prev = ZERO_HASH;
  const out: GovernanceEvent[] = [];
  for (let i = 0; i < seeds.length; i += 1) {
    const s = seeds[i];
    const event_id = i + 1;
    const timestamp = new Date(baseT + s.offsetMs).toISOString();
    const body = {
      event_id,
      timestamp,
      kind: s.kind,
      source: s.source,
      payload: s.payload,
      prev_hash: prev,
    };
    const hash = await canonicalHash(body);
    out.push({ ...body, hash });
    prev = hash;
  }
  return out;
}

/** Tamper: mutate one event's payload deterministically so verify breaks at that index. */
export function tamperedChain(
  events: GovernanceEvent[],
  index: number
): GovernanceEvent[] {
  return events.map((e, i) => {
    if (i !== index) return e;
    return {
      ...e,
      payload: { ...e.payload, _tampered_by_demo: true },
    };
  });
}
