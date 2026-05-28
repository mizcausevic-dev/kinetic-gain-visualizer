import { Card, Field, Pill } from './common';

type DocumentReference = {
  type: string;
  url: string;
  fetched_at?: string;
  content_hash?: string;
  version?: string;
};

type RubricCriterion = {
  id: string;
  description?: string;
  weight?: number;
  result: 'pass' | 'pass-with-condition' | 'partial' | 'fail' | 'n/a';
  notes?: string;
};

type Condition = {
  id: string;
  description: string;
  enforcement?: 'contractual' | 'technical' | 'audit' | 'self-attestation' | 'regulatory' | 'other';
  violation_response?: string;
  verification_uri?: string;
};

type HistoryEvent = {
  event: string;
  at: string;
  actor?: string;
  note?: string;
};

type Signature = {
  signer: string;
  signed_at: string;
  method?: 'digital' | 'wet-ink' | 'electronic-attestation' | 'cryptographic' | 'other';
  key_uri?: string;
  signature_value?: string;
};

/** v0.2 — Skyyflow-shaped field-level vault contract. */
type DataVaultTarget = {
  vendor: 'skyyflow' | 'piiano' | 'nightfall' | 'private-ai' | 'very-good-security' | 'evervault' | 'custom' | 'other';
  vault_id?: string;
  vault_url?: string;
  fields_authorized: string[];
  reveal_roles?: string[];
  reveal_audit_uri?: string;
  expires_at?: string;
  notes?: string;
};

type DecisionCard = {
  decision_card_version: string;
  decision_id: string;
  issued_at: string;
  buyer: {
    name: string;
    type: string;
    category?: string;
    jurisdiction?: string;
    url?: string;
    contact?: string;
    id?: string;
  };
  decision_maker?: {
    role: string;
    name?: string;
    department?: string;
    authority?: string;
  };
  decision: {
    status:
      | 'approved'
      | 'approved-with-conditions'
      | 'rejected'
      | 'rejected-with-remediation'
      | 'pending'
      | 'withdrawn'
      | 'expired';
    effective_from?: string;
    effective_until?: string;
    scope?: string;
  };
  subject: {
    vendor_name: string;
    product_name?: string;
    vendor_id?: string;
    documents_reviewed?: DocumentReference[];
  };
  criteria?: {
    policy_uris?: string[];
    rubric?: RubricCriterion[];
  };
  conditions?: Condition[];
  rationale: string;
  history?: HistoryEvent[];
  appeals?: {
    deadline?: string;
    process_uri?: string;
    contact?: string;
  };
  publication?: {
    publication_uri?: string;
    is_public?: boolean;
    visibility_notes?: string;
  };
  signatures?: Signature[];
  withdrawal?: {
    at: string;
    reason: string;
    replaces?: string;
  };
  /** v0.2 — declares which fields may be tokenized through a vault and which roles may detokenize. */
  data_vault_targets?: DataVaultTarget[];
};

function statusTone(s: string): 'slate' | 'amber' | 'red' | 'green' | 'rose' {
  switch (s) {
    case 'approved':
      return 'green';
    case 'approved-with-conditions':
      return 'amber';
    case 'rejected':
      return 'red';
    case 'rejected-with-remediation':
      return 'rose';
    case 'pending':
      return 'slate';
    case 'withdrawn':
      return 'red';
    case 'expired':
    default:
      return 'slate';
  }
}

function statusLabel(s: string): string {
  return s
    .split('-')
    .map((w) => (w.length > 0 ? w[0]!.toUpperCase() + w.slice(1) : w))
    .join(' ');
}

function rubricTone(r: string): 'green' | 'amber' | 'red' | 'slate' {
  switch (r) {
    case 'pass':
      return 'green';
    case 'pass-with-condition':
    case 'partial':
      return 'amber';
    case 'fail':
      return 'red';
    case 'n/a':
    default:
      return 'slate';
  }
}

function enforcementTone(e?: string): 'slate' | 'amber' | 'red' | 'blue' {
  if (!e) return 'slate';
  if (e === 'regulatory' || e === 'contractual') return 'red';
  if (e === 'technical' || e === 'audit') return 'amber';
  if (e === 'self-attestation') return 'blue';
  return 'slate';
}

function shortHash(h?: string): string {
  if (!h) return '—';
  const colonIdx = h.indexOf(':');
  const alg = colonIdx >= 0 ? h.slice(0, colonIdx) : '';
  const hex = colonIdx >= 0 ? h.slice(colonIdx + 1) : h;
  if (hex.length <= 14) return h;
  return `${alg ? alg + ':' : ''}${hex.slice(0, 8)}…${hex.slice(-4)}`;
}

export function DecisionCardRenderer({ doc }: { doc: DecisionCard }) {
  const dec = doc.decision;
  const isWithdrawn = dec.status === 'withdrawn';
  const hasConditions = (doc.conditions?.length ?? 0) > 0;
  const conditionsRequired =
    dec.status === 'approved-with-conditions' || dec.status === 'rejected-with-remediation';

  const rubricSummary = doc.criteria?.rubric
    ? {
        total: doc.criteria.rubric.length,
        pass: doc.criteria.rubric.filter((r) => r.result === 'pass').length,
        partial: doc.criteria.rubric.filter((r) => r.result === 'partial' || r.result === 'pass-with-condition').length,
        fail: doc.criteria.rubric.filter((r) => r.result === 'fail').length,
        na: doc.criteria.rubric.filter((r) => r.result === 'n/a').length,
      }
    : null;

  return (
    <div className="space-y-4">
      {/* Withdrawal banner if applicable */}
      {isWithdrawn && doc.withdrawal && (
        <Card tone="warning">
          <div className="text-sm">
            <span className="font-bold text-amber-200">DECISION WITHDRAWN</span>
            <span className="text-amber-300"> on {doc.withdrawal.at} — {doc.withdrawal.reason}</span>
            {doc.withdrawal.replaces && (
              <span className="text-amber-300"> · replaced by <code className="code">{doc.withdrawal.replaces}</code></span>
            )}
          </div>
        </Card>
      )}

      {/* Hero / decision summary */}
      <Card title={doc.decision_id} subtitle={`AI Procurement Decision Card · v${doc.decision_card_version}`}>
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <Pill tone={statusTone(dec.status)}>{statusLabel(dec.status)}</Pill>
          {dec.scope && <Pill tone="slate">{dec.scope}</Pill>}
        </div>
        <Field label="Buyer" value={<span><span className="font-semibold">{doc.buyer.name}</span> <span className="text-slate-500">· {doc.buyer.type}{doc.buyer.jurisdiction ? ' · ' + doc.buyer.jurisdiction : ''}</span></span>} />
        <Field label="Vendor / Product" value={<span><span className="font-semibold">{doc.subject.vendor_name}</span>{doc.subject.product_name && <span className="text-slate-300"> · {doc.subject.product_name}</span>}</span>} />
        <Field label="Issued" value={<span className="code">{doc.issued_at}</span>} />
        {dec.effective_from && <Field label="Effective from" value={<span className="code">{dec.effective_from}</span>} />}
        {dec.effective_until && <Field label="Effective until" value={<span className="code">{dec.effective_until}</span>} />}
      </Card>

      {/* Decision maker + buyer detail */}
      <Card title="Buyer + decision maker" subtitle="Who made this call, under what authority">
        {doc.buyer.category && <Field label="Buyer category" value={doc.buyer.category} />}
        {doc.buyer.url && (
          <Field
            label="Buyer URL"
            value={<a className="text-blue-400 hover:underline code break-all" href={doc.buyer.url} target="_blank" rel="noreferrer">{doc.buyer.url}</a>}
          />
        )}
        {doc.buyer.contact && <Field label="Contact" value={<span className="code">{doc.buyer.contact}</span>} />}
        {doc.decision_maker && (
          <>
            <Field label="Decision-maker role" value={<span className="font-semibold">{doc.decision_maker.role}</span>} />
            {doc.decision_maker.name && <Field label="Name" value={doc.decision_maker.name} />}
            {doc.decision_maker.department && <Field label="Department" value={doc.decision_maker.department} />}
            {doc.decision_maker.authority && <Field label="Authority" value={<span className="italic text-slate-300">{doc.decision_maker.authority}</span>} />}
          </>
        )}
      </Card>

      {/* Subject + documents reviewed */}
      <Card title="Subject of review" subtitle="Vendor documents reviewed for this decision">
        <Field label="Vendor" value={<span className="font-semibold">{doc.subject.vendor_name}</span>} />
        {doc.subject.product_name && <Field label="Product" value={doc.subject.product_name} />}
        {doc.subject.vendor_id && (
          <Field
            label="Vendor ID"
            value={<a className="text-blue-400 hover:underline code break-all" href={doc.subject.vendor_id} target="_blank" rel="noreferrer">{doc.subject.vendor_id}</a>}
          />
        )}
        {doc.subject.documents_reviewed && doc.subject.documents_reviewed.length > 0 && (
          <div className="mt-4">
            <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">
              Documents reviewed ({doc.subject.documents_reviewed.length})
            </div>
            <div className="overflow-x-auto rounded-lg border border-slate-800">
              <table className="w-full text-sm">
                <thead className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="text-left px-3 py-2">Spec</th>
                    <th className="text-left px-3 py-2">URL</th>
                    <th className="text-left px-3 py-2">Version</th>
                    <th className="text-left px-3 py-2">Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {doc.subject.documents_reviewed.map((d, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2"><Pill tone="blue">{d.type}</Pill></td>
                      <td className="px-3 py-2"><a className="text-blue-400 hover:underline code break-all" href={d.url} target="_blank" rel="noreferrer">{d.url}</a></td>
                      <td className="px-3 py-2 code text-slate-300">{d.version ?? '—'}</td>
                      <td className="px-3 py-2 code text-slate-500" title={d.content_hash}>{shortHash(d.content_hash)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>

      {/* Criteria + rubric */}
      {doc.criteria && (
        <Card title="Evaluation criteria" subtitle="Policies cited + per-criterion rubric outcomes">
          {doc.criteria.policy_uris && doc.criteria.policy_uris.length > 0 && (
            <div className="mb-4">
              <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">
                Policy URIs ({doc.criteria.policy_uris.length})
              </div>
              <ul className="space-y-1">
                {doc.criteria.policy_uris.map((u) => (
                  <li key={u}>
                    <a className="text-blue-400 hover:underline code text-sm break-all" href={u} target="_blank" rel="noreferrer">{u}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {doc.criteria.rubric && doc.criteria.rubric.length > 0 && rubricSummary && (
            <>
              {/* Summary strip */}
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <Pill tone="green">{rubricSummary.pass} pass</Pill>
                <Pill tone="amber">{rubricSummary.partial} partial</Pill>
                <Pill tone="red">{rubricSummary.fail} fail</Pill>
                {rubricSummary.na > 0 && <Pill tone="slate">{rubricSummary.na} N/A</Pill>}
                <span className="text-xs text-slate-500">· of {rubricSummary.total} criteria</span>
              </div>
              {/* Per-criterion list */}
              <ul className="space-y-2">
                {doc.criteria.rubric.map((r) => (
                  <li key={r.id} className="border border-slate-800 rounded-lg p-3 bg-slate-950">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <code className="code text-sm font-semibold text-slate-200">{r.id}</code>
                      <Pill tone={rubricTone(r.result)}>{r.result}</Pill>
                      {typeof r.weight === 'number' && <span className="text-xs text-slate-500">weight {r.weight}</span>}
                    </div>
                    {r.description && <p className="text-sm text-slate-300 mb-1">{r.description}</p>}
                    {r.notes && <p className="text-xs italic text-slate-400">{r.notes}</p>}
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>
      )}

      {/* Conditions */}
      {hasConditions && doc.conditions && (
        <Card
          title={`Conditions (${doc.conditions.length})`}
          subtitle={conditionsRequired ? 'Required for this decision status — contractual / technical / audit obligations' : 'Attached obligations'}
          tone={conditionsRequired ? 'warning' : 'default'}
        >
          <ul className="space-y-3">
            {doc.conditions.map((c) => (
              <li key={c.id} className="border-l-4 border-amber-400 pl-3 py-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <code className="code text-sm font-semibold">{c.id}</code>
                  {c.enforcement && <Pill tone={enforcementTone(c.enforcement)}>{c.enforcement}</Pill>}
                </div>
                <p className="text-sm text-slate-200 mb-1">{c.description}</p>
                {c.violation_response && (
                  <p className="text-xs text-slate-400 mb-1">
                    <span className="font-semibold uppercase tracking-wider text-slate-500">Violation response:</span> {c.violation_response}
                  </p>
                )}
                {c.verification_uri && (
                  <p className="text-xs">
                    <span className="text-slate-500">Verify at: </span>
                    <a className="text-blue-400 hover:underline code break-all" href={c.verification_uri} target="_blank" rel="noreferrer">{c.verification_uri}</a>
                  </p>
                )}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Rationale */}
      <Card title="Rationale" subtitle="Narrative explanation of the decision">
        <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">{doc.rationale}</p>
      </Card>

      {/* History timeline */}
      {doc.history && doc.history.length > 0 && (
        <Card title="History" subtitle="Audit trail of state transitions during this review">
          <ol className="space-y-2">
            {doc.history.map((h, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <code className="code text-xs text-slate-500 whitespace-nowrap pt-1">{h.at}</code>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Pill tone="slate">{h.event.replace(/_/g, ' ')}</Pill>
                    {h.actor && <span className="text-xs text-slate-500">by {h.actor}</span>}
                  </div>
                  {h.note && <p className="text-xs italic text-slate-400 mt-1">{h.note}</p>}
                </div>
              </li>
            ))}
          </ol>
        </Card>
      )}

      {/* Appeals + Publication */}
      {(doc.appeals || doc.publication) && (
        <Card title="Process + publication">
          {doc.appeals && (
            <>
              {doc.appeals.deadline && <Field label="Appeal deadline" value={<span className="code">{doc.appeals.deadline}</span>} />}
              {doc.appeals.process_uri && (
                <Field
                  label="Appeals process"
                  value={<a className="text-blue-400 hover:underline code break-all" href={doc.appeals.process_uri} target="_blank" rel="noreferrer">{doc.appeals.process_uri}</a>}
                />
              )}
              {doc.appeals.contact && <Field label="Appeals contact" value={<span className="code">{doc.appeals.contact}</span>} />}
            </>
          )}
          {doc.publication && (
            <>
              <Field
                label="Public"
                value={<Pill tone={doc.publication.is_public ? 'green' : 'slate'}>{doc.publication.is_public ? 'yes' : 'no'}</Pill>}
              />
              {doc.publication.publication_uri && (
                <Field
                  label="Publication URI"
                  value={<a className="text-blue-400 hover:underline code break-all" href={doc.publication.publication_uri} target="_blank" rel="noreferrer">{doc.publication.publication_uri}</a>}
                />
              )}
              {doc.publication.visibility_notes && <Field label="Visibility notes" value={<span className="italic text-slate-300">{doc.publication.visibility_notes}</span>} />}
            </>
          )}
        </Card>
      )}

      {/* v0.2: Data vault targets — Skyyflow-shaped field-level vault contract */}
      {doc.data_vault_targets && doc.data_vault_targets.length > 0 && (
        <Card
          title={`Vault contract — data_vault_targets (${doc.data_vault_targets.length})`}
          tone="authority"
        >
          <p className="text-xs text-slate-300 mb-3">
            <strong>v0.2 addition.</strong> Declares which fields may be tokenized through a
            field-level vault and which roles may detokenize. Same contract powers{' '}
            <a
              className="text-emerald-300 hover:underline"
              href="https://github.com/mizcausevic-dev/rag-sentinel"
              target="_blank"
              rel="noreferrer"
            >
              rag-sentinel
            </a>{' '}
            (server-side),{' '}
            <a
              className="text-emerald-300 hover:underline"
              href="https://github.com/mizcausevic-dev/deal-desk-workspace"
              target="_blank"
              rel="noreferrer"
            >
              deal-desk-workspace
            </a>{' '}
            (client-side reveal),{' '}
            <a
              className="text-emerald-300 hover:underline"
              href="https://github.com/mizcausevic-dev/kg-skyyflow-klaviyo-bridge"
              target="_blank"
              rel="noreferrer"
            >
              kg-skyyflow-klaviyo-bridge
            </a>{' '}
            (pipeline-side), and the{' '}
            <a
              className="text-emerald-300 hover:underline"
              href="https://github.com/mizcausevic-dev/skyyflow-klaviyo-bridge-console"
              target="_blank"
              rel="noreferrer"
            >
              bridge console
            </a>{' '}
            (visual).
          </p>
          <div className="space-y-3">
            {doc.data_vault_targets.map((t, i) => (
              <div
                key={`${t.vendor}-${i}`}
                className="rounded-xl border border-slate-700/60 bg-slate-900/60 p-3 space-y-2"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <Pill tone="green">vendor: {t.vendor}</Pill>
                  {t.vault_id && (
                    <span className="code text-xs text-slate-300">
                      vault_id: <strong>{t.vault_id}</strong>
                    </span>
                  )}
                </div>
                <div className="space-y-1.5">
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                    Fields authorized ({t.fields_authorized.length})
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {t.fields_authorized.map((f) => (
                      <span
                        key={f}
                        className="px-2 py-0.5 rounded bg-emerald-900/40 border border-emerald-700/40 text-emerald-200 code text-xs"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
                {t.reveal_roles && t.reveal_roles.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                      Reveal roles ({t.reveal_roles.length})
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {t.reveal_roles.map((r) => (
                        <span
                          key={r}
                          className="px-2 py-0.5 rounded bg-blue-900/40 border border-blue-700/40 text-blue-200 code text-xs"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {t.vault_url && (
                  <div className="text-xs">
                    <span className="text-slate-400">vault_url:</span>{' '}
                    <a
                      className="text-blue-300 hover:underline code break-all"
                      href={t.vault_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t.vault_url}
                    </a>
                  </div>
                )}
                {t.reveal_audit_uri && (
                  <div className="text-xs">
                    <span className="text-slate-400">reveal_audit_uri:</span>{' '}
                    <a
                      className="text-blue-300 hover:underline code break-all"
                      href={t.reveal_audit_uri}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t.reveal_audit_uri}
                    </a>
                  </div>
                )}
                {t.expires_at && (
                  <div className="text-xs text-slate-300">
                    <span className="text-slate-400">expires_at:</span>{' '}
                    <span className="code">{t.expires_at}</span>
                  </div>
                )}
                {t.notes && <p className="text-xs italic text-slate-300">{t.notes}</p>}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Signatures */}
      {doc.signatures && doc.signatures.length > 0 && (
        <Card title={`Signatures (${doc.signatures.length})`} tone="authority">
          <ul className="space-y-2">
            {doc.signatures.map((s, i) => (
              <li key={i} className="text-sm text-slate-200">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold">{s.signer}</span>
                  {s.method && <Pill tone="slate">{s.method}</Pill>}
                </div>
                <div className="text-xs text-slate-400 code">{s.signed_at}</div>
                {s.key_uri && (
                  <a className="text-xs text-blue-300 hover:underline code break-all" href={s.key_uri} target="_blank" rel="noreferrer">{s.key_uri}</a>
                )}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
