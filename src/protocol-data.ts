/**
 * Canonical data for all eleven Kinetic Gain Protocol Suite specs and the 71
 * tools exposed by mcp-kinetic-gain v0.8.0 (includes the DefenseTech 6-pack).
 * Mirrored from
 * https://github.com/mizcausevic-dev/mcp-kinetic-gain/blob/main/src/tools.ts
 * — re-sync when that file changes.
 *
 * The eleven specs: five core (AEO, Prompt Provenance, Agent Cards, AI Evidence
 * Format, MCP Tool Cards), the EdTech trio (Tutor / Student / Classroom AUP),
 * the HealthTech extension (Clinical AI Disclosure), the cross-cutting
 * AI Incident Card (vendor-side), and the buyer-side AI Procurement Decision
 * Card (spec #11). Decision Card v0.2 added the Skyyflow-shaped
 * `data_vault_targets[]` contract powering rag-sentinel, deal-desk-workspace,
 * kg-skyyflow-klaviyo-bridge, and the bridge console. v0.3 adds the
 * `retention_envelope[]` field: per-field TTL + redaction action + signed
 * deletion-proof endpoint, pairing with vault targets to give the buyer
 * end-to-end control over both reveal and lifetime.
 *
 * Tool catalog: 47 protocol-bound tools across the 11 specs + 16 cross-cutting
 * v0.6.0/v0.7.0 ops (hash attestation, audit-stream events, suite-doc detect /
 * drift). Cross-cutting tools carry protocol='cross-cutting' since they don't
 * belong to one spec — the Tools view filter handles that as a 12th bucket.
 */
import type { SpecKey } from './detect';

export interface ProtocolSummary {
  key: Exclude<SpecKey, 'unknown'>;
  displayName: string;
  fullName: string;
  shortBlurb: string;
  versionField: string;
  /** /.well-known/... path, or null if the spec has no fixed location. */
  wellKnownPath: string | null;
  toolCount: number;
  specRepo: string;
  accent: ProtocolAccent;
}

export type ProtocolAccent = 'blue' | 'emerald' | 'violet' | 'amber' | 'rose' | 'teal' | 'indigo' | 'fuchsia' | 'cyan' | 'red' | 'purple';

export const PROTOCOLS: ProtocolSummary[] = [
  {
    key: 'aeo',
    displayName: 'AEO Protocol',
    fullName: 'Answer Engine Optimization Protocol',
    shortBlurb:
      'Entity declaration at a well-known URL. Authoritative claims, citation preferences, audit hooks.',
    versionField: 'aeo_version',
    wellKnownPath: '/.well-known/aeo.json',
    toolCount: 4,
    specRepo: 'https://github.com/mizcausevic-dev/aeo-protocol-spec',
    accent: 'blue',
  },
  {
    key: 'prompt-provenance',
    displayName: 'Prompt Provenance',
    fullName: 'Prompt Provenance v0.1',
    shortBlurb:
      'Versioned, lineaged, reviewable LLM prompt records. SHA-256 content hash, derivation type, eval results, approval state.',
    versionField: 'provenance_version',
    wellKnownPath: null,
    toolCount: 3,
    specRepo: 'https://github.com/mizcausevic-dev/prompt-provenance-spec',
    accent: 'emerald',
  },
  {
    key: 'agent-card',
    displayName: 'Agent Cards',
    fullName: 'Agent Capability Disclosure',
    shortBlurb:
      'Like HuggingFace model cards, but for agents. Capability surface, refusal taxonomy, deployment posture.',
    versionField: 'agent_card_version',
    wellKnownPath: '/.well-known/agents/<agent_id>.json',
    toolCount: 4,
    specRepo: 'https://github.com/mizcausevic-dev/agent-cards-spec',
    accent: 'violet',
  },
  {
    key: 'ai-evidence',
    displayName: 'AI Evidence Format',
    fullName: 'AI Evidence Format v0.1',
    shortBlurb:
      'Structured citations that travel with LLM-generated claims. Source span, retrieval confidence, content hash, synthesis role.',
    versionField: 'evidence_version',
    wellKnownPath: null,
    toolCount: 3,
    specRepo: 'https://github.com/mizcausevic-dev/ai-evidence-format-spec',
    accent: 'amber',
  },
  {
    key: 'mcp-tool-card',
    displayName: 'MCP Tool Cards',
    fullName: 'MCP Tool Card v0.1',
    shortBlurb:
      'Per-tool disclosure for Model Context Protocol servers. Schema, safety profile, tested-LLM matrix, performance, audit.',
    versionField: 'tool_card_version',
    wellKnownPath: '/.well-known/mcp-tools/<tool_name>.json',
    toolCount: 4,
    specRepo: 'https://github.com/mizcausevic-dev/mcp-tool-card-spec',
    accent: 'rose',
  },
  {
    key: 'tutor-card',
    displayName: 'AI Tutor Cards',
    fullName: 'AI Tutor Card v0.1 (EdTech extension)',
    shortBlurb:
      'AI tutor disclosure for K-12, higher-ed, and corporate training. Audience, subject scope, pedagogy, FERPA/COPPA/GDPR data privacy, safety posture.',
    versionField: 'tutor_card_version',
    wellKnownPath: '/.well-known/tutors/<tutor_id>.json',
    toolCount: 6,
    specRepo: 'https://github.com/mizcausevic-dev/ai-tutor-card-spec',
    accent: 'teal',
  },
  {
    key: 'student-ai-disclosure',
    displayName: 'Student AI Disclosure',
    fullName: 'Student AI Disclosure v0.1 (EdTech extension)',
    shortBlurb:
      'Student-side disclosure attached to submitted work. AI usage facts, role taxonomy, prompt evidence (full / hashed / omitted), artifact hash binding, policy posture, teacher acknowledgment.',
    versionField: 'disclosure_version',
    wellKnownPath: null,
    toolCount: 5,
    specRepo: 'https://github.com/mizcausevic-dev/student-ai-disclosure-spec',
    accent: 'indigo',
  },
  {
    key: 'classroom-aup',
    displayName: 'Classroom AI AUP',
    fullName: 'Classroom AI Acceptable Use Policy v0.1 (EdTech trio · district-side)',
    shortBlurb:
      'District / school / course / assignment AI policy: permitted use, prohibited use, disclosure requirements, supervision, vendor requirements (FERPA / COPPA / GDPR), enforcement. Headline tool joins AUP + Disclosure into a single allow/deny.',
    versionField: 'aup_version',
    wellKnownPath: '/.well-known/ai-aup.json',
    toolCount: 5,
    specRepo: 'https://github.com/mizcausevic-dev/classroom-ai-aup-spec',
    accent: 'fuchsia',
  },
  {
    key: 'clinical-ai',
    displayName: 'Clinical AI Disclosure',
    fullName: 'Clinical AI Disclosure v0.1 (HealthTech extension)',
    shortBlurb:
      'Healthcare-vertical disclosure for clinical AI systems. FDA / SaMD posture, HIPAA + BAA, bias audits, EHR (FHIR / SMART / CDS Hooks). Schema-enforced autonomy ⇔ medical-device coupling.',
    versionField: 'clinical_ai_card_version',
    wellKnownPath: '/.well-known/clinical-ai/<system_id>.json',
    toolCount: 4,
    specRepo: 'https://github.com/mizcausevic-dev/clinical-ai-disclosure-spec',
    accent: 'cyan',
  },
  {
    key: 'ai-incident-card',
    displayName: 'AI Incident Card',
    fullName: 'AI Incident Card v0.1 (cross-cutting · vendor-side)',
    shortBlurb:
      'Vendor-published post-incident disclosure — the "CVE for AI agents". Cross-references every other affected document. Headline tool: incident_index_fetch summarizes a vendor\'s full incident history in one call.',
    versionField: 'incident_card_version',
    wellKnownPath: '/.well-known/ai-incidents/<id>.json',
    toolCount: 7,
    specRepo: 'https://github.com/mizcausevic-dev/ai-incident-card-spec',
    accent: 'red',
  },
  {
    key: 'decision-card',
    displayName: 'AI Procurement Decision Card',
    fullName: 'AI Procurement Decision Card v0.3 (cross-cutting · buyer-side)',
    shortBlurb:
      'The buyer-side artifact. Records the outcome of a procurement review of one or more vendor declarations: documents reviewed (by URL + content hash), rubric, conditions, rationale, signatures. v0.2 adds data_vault_targets[] — Skyyflow-shaped field-level vault contract. v0.3 adds retention_envelope[] — per-field TTL + redaction action + signed deletion-proof endpoint. Natural carrier for NIST AI RMF-aligned procurement decisions.',
    versionField: 'decision_card_version',
    wellKnownPath: '/.well-known/decisions/<decision_id>.json',
    toolCount: 7,
    specRepo: 'https://github.com/mizcausevic-dev/ai-procurement-decision-spec',
    accent: 'purple',
  },
];

export interface ToolInput {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export type ToolProtocol = Exclude<SpecKey, 'unknown'> | 'cross-cutting';

export interface ToolSpec {
  name: string;
  protocol: ToolProtocol;
  description: string;
  inputs: ToolInput[];
}

export const TOOLS: ToolSpec[] = [
  // AEO Protocol — 4 tools
  {
    name: 'aeo_fetch',
    protocol: 'aeo',
    description:
      'Fetch the full AEO Protocol declaration at an origin\'s /.well-known/aeo.json. Returns the raw conforming JSON.',
    inputs: [
      {
        name: 'origin',
        type: 'string (URL)',
        required: true,
        description: 'Origin URL, e.g. https://mizcausevic-dev.github.io',
      },
    ],
  },
  {
    name: 'aeo_inspect',
    protocol: 'aeo',
    description:
      'Structured summary of an AEO declaration: entity, source/verification counts, claim IDs, audit mode. Cheaper than aeo_fetch.',
    inputs: [{ name: 'origin', type: 'string (URL)', required: true, description: 'Origin URL.' }],
  },
  {
    name: 'aeo_get_claim',
    protocol: 'aeo',
    description:
      'Extract a single AEO claim by ID. Returns the claim object or a not-found error listing available IDs.',
    inputs: [
      { name: 'origin', type: 'string (URL)', required: true, description: 'Origin URL.' },
      { name: 'claim_id', type: 'string', required: true, description: 'Claim ID, e.g. "current-role".' },
    ],
  },
  {
    name: 'aeo_well_known_url',
    protocol: 'aeo',
    description: 'Compute the canonical /.well-known/aeo.json URL for an origin, without fetching.',
    inputs: [{ name: 'origin', type: 'string (URL)', required: true, description: 'Origin URL.' }],
  },

  // Prompt Provenance — 3 tools
  {
    name: 'prompt_provenance_validate',
    protocol: 'prompt-provenance',
    description:
      'Validate a Prompt Provenance JSON document against the v0.1 schema. Returns { valid, prompt_id, version } or { valid: false, reason }.',
    inputs: [
      { name: 'document_json', type: 'string (JSON)', required: true, description: 'Prompt Provenance JSON.' },
    ],
  },
  {
    name: 'prompt_provenance_inspect',
    protocol: 'prompt-provenance',
    description:
      'Summary of a Prompt Provenance document: prompt identity, lineage, approval state, evaluation suites.',
    inputs: [
      { name: 'document_json', type: 'string (JSON)', required: true, description: 'Prompt Provenance JSON.' },
    ],
  },
  {
    name: 'prompt_provenance_eval_result',
    protocol: 'prompt-provenance',
    description: 'Extract a single evaluation suite\'s result by name. Returns not-found with available suites if absent.',
    inputs: [
      { name: 'document_json', type: 'string (JSON)', required: true, description: 'Prompt Provenance JSON.' },
      { name: 'suite_name', type: 'string', required: true, description: 'Name of the evaluation suite.' },
    ],
  },

  // Agent Cards — 4 tools
  {
    name: 'agent_card_well_known_url',
    protocol: 'agent-card',
    description: 'Compute the canonical Agent Card well-known URL: /.well-known/agents/<agent_id>.json.',
    inputs: [
      { name: 'origin', type: 'string (URL)', required: true, description: 'Origin URL.' },
      { name: 'agent_id', type: 'string', required: true, description: 'Agent identifier.' },
    ],
  },
  {
    name: 'agent_card_inspect',
    protocol: 'agent-card',
    description:
      'Structured summary of an Agent Card. Pass either url (server fetches it) or document_json (inline JSON).',
    inputs: [
      { name: 'url', type: 'string (URL)', required: false, description: 'Card URL.' },
      { name: 'document_json', type: 'string (JSON)', required: false, description: 'Card as inline JSON.' },
    ],
  },
  {
    name: 'agent_card_tool_disclosure',
    protocol: 'agent-card',
    description:
      'List the tools an agent declares, with side-effect class and (where present) MCP Tool Card URI for each.',
    inputs: [
      { name: 'url', type: 'string (URL)', required: false, description: 'Card URL.' },
      { name: 'document_json', type: 'string (JSON)', required: false, description: 'Card as inline JSON.' },
    ],
  },
  {
    name: 'agent_card_validate',
    protocol: 'agent-card',
    description: 'Validate an Agent Card JSON document against the v0.1 schema.',
    inputs: [
      { name: 'document_json', type: 'string (JSON)', required: true, description: 'Agent Card JSON.' },
    ],
  },

  // AI Evidence Format — 3 tools
  {
    name: 'ai_evidence_validate',
    protocol: 'ai-evidence',
    description: 'Validate an AI Evidence object against the v0.1 schema.',
    inputs: [
      { name: 'document_json', type: 'string (JSON)', required: true, description: 'Evidence object as JSON.' },
    ],
  },
  {
    name: 'ai_evidence_inspect',
    protocol: 'ai-evidence',
    description:
      'Structured summary of an AI Evidence object: claim, source, retrieval method, synthesis role, hash, signed-or-not.',
    inputs: [
      { name: 'document_json', type: 'string (JSON)', required: true, description: 'Evidence object as JSON.' },
    ],
  },
  {
    name: 'ai_evidence_verify_hash',
    protocol: 'ai-evidence',
    description:
      'Compute canonical SHA-256 (LF endings, no trailing newline) over candidate_text and compare to verification.content_hash. Returns ok=true on match or { error: hash_mismatch, expected, recomputed }.',
    inputs: [
      { name: 'document_json', type: 'string (JSON)', required: true, description: 'Evidence object as JSON.' },
      {
        name: 'candidate_text',
        type: 'string',
        required: true,
        description: 'Text whose canonical SHA-256 should match the evidence content_hash.',
      },
    ],
  },

  // MCP Tool Cards — 4 tools
  {
    name: 'tool_card_well_known_url',
    protocol: 'mcp-tool-card',
    description: 'Compute the canonical MCP Tool Card well-known URL: /.well-known/mcp-tools/<tool_name>.json.',
    inputs: [
      { name: 'mcp_server_origin', type: 'string (URL)', required: true, description: 'Origin of the MCP server.' },
      { name: 'tool_name', type: 'string', required: true, description: 'Tool name.' },
    ],
  },
  {
    name: 'tool_card_inspect',
    protocol: 'mcp-tool-card',
    description:
      'Structured summary of an MCP Tool Card: tool identity, safety profile (side-effect class, PII/secrets exposure, approval), test count, p99 latency.',
    inputs: [
      { name: 'url', type: 'string (URL)', required: false, description: 'Tool Card URL.' },
      { name: 'document_json', type: 'string (JSON)', required: false, description: 'Tool Card as inline JSON.' },
    ],
  },
  {
    name: 'tool_card_tested_with',
    protocol: 'mcp-tool-card',
    description:
      'Return the tested-LLM entries for a tool, optionally filtered by a case-insensitive substring of the LLM identifier.',
    inputs: [
      { name: 'url', type: 'string (URL)', required: false, description: 'Tool Card URL.' },
      { name: 'document_json', type: 'string (JSON)', required: false, description: 'Tool Card as inline JSON.' },
      { name: 'llm_filter', type: 'string', required: false, description: 'Substring of LLM identifier (optional).' },
    ],
  },
  {
    name: 'tool_card_validate',
    protocol: 'mcp-tool-card',
    description: 'Validate an MCP Tool Card JSON document against the v0.1 schema.',
    inputs: [
      { name: 'document_json', type: 'string (JSON)', required: true, description: 'Tool Card JSON.' },
    ],
  },

  // AI Tutor Cards (EdTech extension) — 6 tools
  {
    name: 'tutor_card_well_known_url',
    protocol: 'tutor-card',
    description: 'Compute the canonical AI Tutor Card well-known URL: /.well-known/tutors/<tutor_id>.json.',
    inputs: [
      { name: 'origin', type: 'string (URL)', required: true, description: 'Origin URL.' },
      { name: 'tutor_id', type: 'string', required: true, description: 'Tutor identifier.' },
    ],
  },
  {
    name: 'tutor_card_fetch',
    protocol: 'tutor-card',
    description: 'Fetch a Tutor Card from an origin\'s /.well-known/tutors/<tutor_id>.json. Returns the raw conforming JSON.',
    inputs: [
      { name: 'origin', type: 'string (URL)', required: true, description: 'Origin URL.' },
      { name: 'tutor_id', type: 'string', required: true, description: 'Tutor identifier.' },
    ],
  },
  {
    name: 'tutor_card_validate',
    protocol: 'tutor-card',
    description: 'Validate a Tutor Card JSON document against the v0.1 schema, including the COPPA conditional rule (audience.age_range_min < 13 ⇒ data_privacy.coppa_compliant must be true).',
    inputs: [
      { name: 'document_json', type: 'string (JSON)', required: true, description: 'Tutor Card JSON.' },
    ],
  },
  {
    name: 'tutor_card_inspect',
    protocol: 'tutor-card',
    description: 'Structured summary of a Tutor Card: tutor identity, audience, pedagogy approach, safety strength, FERPA/COPPA/GDPR posture, evaluation count.',
    inputs: [
      { name: 'url', type: 'string (URL)', required: false, description: 'Tutor Card URL.' },
      { name: 'document_json', type: 'string (JSON)', required: false, description: 'Tutor Card as inline JSON.' },
    ],
  },
  {
    name: 'tutor_card_subject_check',
    protocol: 'tutor-card',
    description: 'Classify a topic against the tutor\'s subject scope. Returns one of: primary, included, excluded, unknown — with a brief explanation.',
    inputs: [
      { name: 'document_json', type: 'string (JSON)', required: true, description: 'Tutor Card JSON.' },
      { name: 'topic', type: 'string', required: true, description: 'Topic to classify, e.g. "algebra" or "differential equations".' },
    ],
  },
  {
    name: 'tutor_card_coppa_check',
    protocol: 'tutor-card',
    description: 'Enforce the spec\'s COPPA conditional rule: if audience.age_range_min < 13 then data_privacy.coppa_compliant MUST be true. Returns { ok: true } or { error: coppa_violation, reason }.',
    inputs: [
      { name: 'document_json', type: 'string (JSON)', required: true, description: 'Tutor Card JSON.' },
    ],
  },

  // Student AI Disclosure (EdTech extension) — 5 tools
  {
    name: 'disclosure_validate',
    protocol: 'student-ai-disclosure',
    description: 'Validate a Student AI Disclosure JSON document against the v0.1 schema. Enforces all conditional rules: ai_used true requires tools/roles/extent/prompt_mode; ai_used false forbids them; prompt mode gates prompts presence and text/hash exclusivity.',
    inputs: [
      { name: 'document_json', type: 'string (JSON)', required: true, description: 'Disclosure JSON.' },
    ],
  },
  {
    name: 'disclosure_inspect',
    protocol: 'student-ai-disclosure',
    description: 'Structured summary of a Student AI Disclosure: assignment identity, AI usage facts, tools used (with back-refs to Agent / Tutor Cards), roles, assistance extent, prompt-mode + count, artifact hash, policy posture, signature + teacher acknowledgment.',
    inputs: [
      { name: 'document_json', type: 'string (JSON)', required: true, description: 'Disclosure JSON.' },
    ],
  },
  {
    name: 'disclosure_verify_artifact_hash',
    protocol: 'student-ai-disclosure',
    description: 'Recompute SHA-256 over a candidate artifact and compare to disclosure.artifact_hash. Pass candidate_text (canonical SHA-256: LF endings, no trailing newline) for text artifacts, or candidate_bytes_base64 (raw-bytes SHA-256) for binary artifacts.',
    inputs: [
      { name: 'document_json', type: 'string (JSON)', required: true, description: 'Disclosure JSON.' },
      { name: 'candidate_text', type: 'string', required: false, description: 'Text artifact (canonical mode).' },
      { name: 'candidate_bytes_base64', type: 'string (base64)', required: false, description: 'Base64-encoded raw artifact bytes.' },
    ],
  },
  {
    name: 'disclosure_verify_prompt_hash',
    protocol: 'student-ai-disclosure',
    description: 'Verify a single prompt hash in a hashed-mode disclosure. Looks up prompt_id and compares canonical SHA-256 of candidate_text against the stored hash.',
    inputs: [
      { name: 'document_json', type: 'string (JSON)', required: true, description: 'Disclosure JSON.' },
      { name: 'prompt_id', type: 'string', required: true, description: 'ID of the prompt to verify, e.g. "p1".' },
      { name: 'candidate_text', type: 'string', required: true, description: 'Candidate prompt text.' },
    ],
  },
  {
    name: 'disclosure_aup_check',
    protocol: 'student-ai-disclosure',
    description: 'Surface the disclosure\'s policy posture: declared_compliant / declared_non_compliant / aup_referenced_but_unclaimed / no_aup_reference. Reports declared posture only; for the actual join use aup_check_compliance.',
    inputs: [
      { name: 'document_json', type: 'string (JSON)', required: true, description: 'Disclosure JSON.' },
    ],
  },

  // Classroom AI AUP (EdTech extension — closes the trio) — 5 tools
  {
    name: 'aup_well_known_url',
    protocol: 'classroom-aup',
    description: 'Compute the canonical Classroom AI AUP well-known URL: /.well-known/ai-aup.json.',
    inputs: [
      { name: 'origin', type: 'string (URL)', required: true, description: 'Origin URL of the institution.' },
    ],
  },
  {
    name: 'aup_fetch',
    protocol: 'classroom-aup',
    description: 'Fetch a Classroom AI AUP from a URL. Returns the parsed, schema-validated JSON document.',
    inputs: [
      { name: 'url', type: 'string (URL)', required: true, description: 'AUP URL.' },
    ],
  },
  {
    name: 'aup_validate',
    protocol: 'classroom-aup',
    description: 'Validate a Classroom AI AUP JSON document against the v0.1 schema. Enforces conditional rules: course scope requires non-empty course_ids; assignment scope requires non-empty assignment_ids; assistance_extent_max=none forbids permitted_roles; expires_at must follow effective_at; roles cannot be both permitted and prohibited.',
    inputs: [
      { name: 'document_json', type: 'string (JSON)', required: true, description: 'AUP JSON.' },
    ],
  },
  {
    name: 'aup_inspect',
    protocol: 'classroom-aup',
    description: 'Structured summary of a Classroom AI AUP: policy identity, scope, permitted/prohibited role counts, disclosure requirements, supervision level, vendor requirements posture, parent-consent gating.',
    inputs: [
      { name: 'url', type: 'string (URL)', required: false, description: 'AUP URL.' },
      { name: 'document_json', type: 'string (JSON)', required: false, description: 'AUP as inline JSON.' },
    ],
  },
  {
    name: 'aup_check_compliance',
    protocol: 'classroom-aup',
    description: 'HEADLINE — joins an AUP with a Student AI Disclosure and decides whether the submission complies. Eight gates: effective window, signature, artifact_hash, teacher acknowledgment, prompt evidence mode, permitted/prohibited roles, assistance-extent ceiling, no-AI vs ai_used. Returns { allowed, violations[] }, one entry per failed gate.',
    inputs: [
      { name: 'aup_json', type: 'string (JSON)', required: false, description: 'AUP as inline JSON.' },
      { name: 'aup_url', type: 'string (URL)', required: false, description: 'AUP URL — server fetches it.' },
      { name: 'disclosure_json', type: 'string (JSON)', required: true, description: 'Student AI Disclosure as inline JSON.' },
    ],
  },
  // Clinical AI Disclosure — 4 tools
  {
    name: 'clinical_ai_well_known_url',
    protocol: 'clinical-ai',
    description: 'Compute the canonical Clinical AI Card well-known URL: /.well-known/clinical-ai/<system_id>.json.',
    inputs: [
      { name: 'origin', type: 'string (URL)', required: true, description: 'Vendor origin.' },
      { name: 'system_id', type: 'string', required: true, description: 'Stable system identifier (kebab-case).' },
    ],
  },
  {
    name: 'clinical_ai_fetch',
    protocol: 'clinical-ai',
    description: 'Fetch a Clinical AI Card from a URL. Returns the parsed, schema-validated JSON document.',
    inputs: [
      { name: 'url', type: 'string (URL)', required: true, description: 'Card URL.' },
    ],
  },
  {
    name: 'clinical_ai_validate',
    protocol: 'clinical-ai',
    description: 'Validate a Clinical AI Card against the v0.1 schema. Enforces headline rules: autonomy ⇔ medical device (FDA position), SaMD class + rationale completeness, FDA-clearance documentation, PHI ⇒ explicit HIPAA + BAA, bias_audit_uri required for SaMD II+ / autonomous / pre-authorization.',
    inputs: [
      { name: 'document_json', type: 'string (JSON)', required: true, description: 'Card JSON.' },
    ],
  },
  {
    name: 'clinical_ai_inspect',
    protocol: 'clinical-ai',
    description: 'Structured summary of a Clinical AI Card: system identity, clinical context, regulatory posture, clinical role, evidence (studies + bias audit + performance metrics), HIPAA / BAA, EHR integration, safety + mandated reporting.',
    inputs: [
      { name: 'url', type: 'string (URL)', required: false, description: 'Card URL.' },
      { name: 'document_json', type: 'string (JSON)', required: false, description: 'Card as inline JSON.' },
    ],
  },
  // AI Incident Card — 5 tools
  {
    name: 'incident_well_known_url',
    protocol: 'ai-incident-card',
    description: 'Compute the canonical AI Incident Card well-known URL: /.well-known/ai-incidents/<id>.json.',
    inputs: [
      { name: 'origin', type: 'string (URL)', required: true, description: 'Vendor origin.' },
      { name: 'incident_id', type: 'string', required: true, description: 'Convention: INC-<YYYY-MM-DD>-<vendor>-<seq>.' },
    ],
  },
  {
    name: 'incident_fetch',
    protocol: 'ai-incident-card',
    description: 'Fetch an AI Incident Card from a URL. Returns the parsed, schema-validated JSON document.',
    inputs: [
      { name: 'url', type: 'string (URL)', required: true, description: 'Card URL.' },
    ],
  },
  {
    name: 'incident_validate',
    protocol: 'ai-incident-card',
    description: 'Validate an AI Incident Card against the v0.1 schema. Enforces conditional rules: status=resolved requires resolved_at; status=withdrawn requires withdrawal block; non-empty regulatory.reported_to requires non-empty regulatory_filing_uris; root_cause=other and categories containing "other" both require _other_text fields.',
    inputs: [
      { name: 'document_json', type: 'string (JSON)', required: true, description: 'Card JSON.' },
    ],
  },
  {
    name: 'incident_inspect',
    protocol: 'ai-incident-card',
    description: 'Structured summary of an AI Incident Card: identity, severity, status, categories, affected vendor/products with cross-spec ref counts, root cause, harm, mitigation, regulatory filings, withdrawal posture, revision metadata.',
    inputs: [
      { name: 'url', type: 'string (URL)', required: false, description: 'Card URL.' },
      { name: 'document_json', type: 'string (JSON)', required: false, description: 'Card as inline JSON.' },
    ],
  },
  {
    name: 'incident_index_fetch',
    protocol: 'ai-incident-card',
    description: 'HEADLINE — fetch a vendor\'s /.well-known/ai-incidents.json index and return a procurement-friendly summary: total count, breakdown by severity, breakdown by status, IDs sorted by disclosed_at descending. The cheapest possible vendor-history scan for CISO / procurement.',
    inputs: [
      { name: 'origin', type: 'string (URL)', required: true, description: 'Vendor origin.' },
    ],
  },

  // --------------------------------------------------------------------------
  // AI Procurement Decision Card — buyer-side, spec #11
  // --------------------------------------------------------------------------
  {
    name: 'decision_card_well_known_url',
    protocol: 'decision-card',
    description: 'Compute the canonical AI Procurement Decision Card well-known URL: /.well-known/decisions/<decision_id>.json.',
    inputs: [
      { name: 'origin', type: 'string (URL)', required: true, description: 'Buyer origin (e.g. https://springfield.edu).' },
      { name: 'decision_id', type: 'string', required: true, description: 'Buyer-issued identifier (e.g. SPRINGFIELD-DEC-2026-001).' },
    ],
  },
  {
    name: 'decision_card_fetch',
    protocol: 'decision-card',
    description: 'Fetch an AI Procurement Decision Card from a URL. Returns the parsed, schema-validated JSON document.',
    inputs: [
      { name: 'url', type: 'string (URL)', required: true, description: 'Full URL to the Decision Card JSON.' },
    ],
  },
  {
    name: 'decision_card_validate',
    protocol: 'decision-card',
    description: 'Validate a Decision Card JSON document against the v0.1 schema. Enforces conditional rules: status=approved-with-conditions / rejected-with-remediation require non-empty conditions; status=withdrawn requires withdrawal block; publication.is_public=true requires publication_uri.',
    inputs: [
      { name: 'document_json', type: 'string (JSON)', required: true, description: 'Decision Card as inline JSON.' },
    ],
  },
  {
    name: 'decision_card_inspect',
    protocol: 'decision-card',
    description: 'Procurement-grade summary of a Decision Card: buyer identity, decision status + scope, vendor + documents reviewed by type, rubric pass/partial/fail counts, conditions count, signatures count, publication posture, history event count, withdrawal flag.',
    inputs: [
      { name: 'url', type: 'string (URL)', required: false, description: 'Fetch by URL (or supply document_json).' },
      { name: 'document_json', type: 'string (JSON)', required: false, description: 'Decision Card as inline JSON.' },
    ],
  },

  // ── v0.6.0 — Decision Intelligence preview tools (3 new) ──────────────────
  {
    name: 'decision_card_infer_status',
    protocol: 'decision-card',
    description:
      "Given a rubric, infer the right `decision.status`. Mirrors procurement-decision-api's rubric engine: any 'fail' → 'rejected-with-remediation'; any 'partial' or 'pass-with-condition' → 'approved-with-conditions'; all 'pass' → 'approved'; empty or all 'n/a' → 'pending'.",
    inputs: [
      { name: 'rubric', type: 'array<RubricCriterion>', required: true, description: 'Rubric criteria with { id, result } where result ∈ {pass, pass-with-condition, partial, fail, n/a}.' },
    ],
  },
  {
    name: 'decision_card_to_policy_bundle',
    protocol: 'decision-card',
    description:
      "Translate a Decision Card into the PolicyBundle that policy-as-code-engine's POST /bundles/from-decision-card would generate. Read-only preview. 'approved' → allow-all; 'rejected*' / 'withdrawn' / 'expired' / 'pending' → deny-all; 'approved-with-conditions' → one policy per condition (deny-by-default, allow only when conditions_satisfied.{id} is true).",
    inputs: [
      { name: 'url', type: 'string (URL)', required: false, description: 'Fetch the Decision Card by URL (or supply document_json).' },
      { name: 'document_json', type: 'string (JSON)', required: false, description: 'Decision Card as inline JSON.' },
    ],
  },
  {
    name: 'decision_card_signature_check',
    protocol: 'decision-card',
    description:
      "Structural check on a Decision Card's signatures[] block: count signers, show their method/key/timestamp, and return the canonical-JSON hash of the card body (excluding signatures) so a caller can pair this with attestation_verify for cryptographic checking.",
    inputs: [
      { name: 'url', type: 'string (URL)', required: false, description: 'Fetch by URL (or supply document_json).' },
      { name: 'document_json', type: 'string (JSON)', required: false, description: 'Decision Card as inline JSON.' },
    ],
  },

  // ── v0.6.0 — AI Incident Card remediation tools (2 new) ───────────────────
  {
    name: 'incident_affected_walk',
    protocol: 'ai-incident-card',
    description:
      "Walk an Incident Card's `affected` block and return every referenced Suite document as { uri, kind }. Useful as the seed list for incident-correlation-rs or fan-out validation via aeo-validator-service.",
    inputs: [
      { name: 'url', type: 'string (URL)', required: false, description: 'Fetch the Incident Card by URL.' },
      { name: 'document_json', type: 'string (JSON)', required: false, description: 'Incident Card as inline JSON.' },
    ],
  },
  {
    name: 'incident_remediation_plan',
    protocol: 'ai-incident-card',
    description:
      'Map each affected URI in an Incident Card to a recommended Action + Urgency. Single-hop preview of what incident-correlation-rs.correlate() would produce: agent/tutor/tool-card → revalidate; vendor/product → request_review. Urgency follows severity.',
    inputs: [
      { name: 'url', type: 'string (URL)', required: false, description: 'Fetch the Incident Card by URL.' },
      { name: 'document_json', type: 'string (JSON)', required: false, description: 'Incident Card as inline JSON.' },
    ],
  },

  // ── v0.6.0 — Hash attestation tools (3 new, cross-cutting) ────────────────
  {
    name: 'attestation_canonical_hash',
    protocol: 'cross-cutting',
    description:
      'Compute the SHA-256 canonical-JSON hash of an arbitrary value (sorted keys, no whitespace). This is the structural hash convention used by procurement-decision-api, aeo-validator-service, aeo-graph-explorer-rs, and hash-attestation-rs. Identical JSON values produce identical hashes regardless of original whitespace or key order.',
    inputs: [
      { name: 'body', type: 'any JSON', required: true, description: 'Value to canonicalize and hash.' },
    ],
  },
  {
    name: 'attestation_verify',
    protocol: 'cross-cutting',
    description:
      'Verify an ed25519 Attestation envelope (algorithm/signed_hash/signature/key_url/signed_at) against a body and a public key. Recomputes the canonical hash, checks it matches signed_hash, then verifies the ed25519 signature over the hash string. Returns { ok, reason? }. Public key accepted as 64-char hex or base64.',
    inputs: [
      { name: 'attestation', type: 'object', required: true, description: 'Envelope with algorithm/signed_hash/signature/key_url/signed_at.' },
      { name: 'body', type: 'any JSON', required: true, description: 'Body the attestation was minted over.' },
      { name: 'public_key', type: 'string (hex/base64)', required: true, description: '32-byte ed25519 verifying key.' },
    ],
  },
  {
    name: 'attestation_inspect',
    protocol: 'cross-cutting',
    description:
      'Pretty-print an Attestation envelope with structural validation: confirms every required field is present, reports the decoded signature byte-length (should be 64), and surfaces the key_url + signed_at fields a caller would use to find the matching public key.',
    inputs: [
      { name: 'attestation', type: 'object', required: true, description: 'Attestation envelope.' },
    ],
  },

  // ── v0.6.0 — Audit-stream governance event tools (3 new, cross-cutting) ───
  {
    name: 'audit_event_compose',
    protocol: 'cross-cutting',
    description:
      'Build a ready-to-POST audit-stream-py GovernanceEvent: assigns event_id, computes the canonical hash, links to prev_hash (defaults to 64 zeros for event #1). Kind must be one of the 19 declared event kinds (decision_card_drafted, watch_drifted, request_denied, etc., plus "other").',
    inputs: [
      { name: 'event_id', type: 'integer', required: true, description: 'Event sequence number (≥1).' },
      { name: 'kind', type: 'string', required: true, description: 'Governance event kind.' },
      { name: 'source', type: 'string', required: true, description: 'Producer identifier.' },
      { name: 'payload', type: 'object', required: false, description: 'Free-form payload.' },
      { name: 'prev_hash', type: 'string (hex)', required: false, description: '64-char hex; defaults to 64 zeros.' },
      { name: 'timestamp', type: 'string (ISO-8601)', required: false, description: 'Optional; defaults to now.' },
    ],
  },
  {
    name: 'audit_chain_verify',
    protocol: 'cross-cutting',
    description:
      "Walk an array of GovernanceEvents top-to-bottom and verify the hash chain: monotonic event_id, prev_hash linkage, self-consistency of each event's hash. Returns { valid, checked, first_break_at, reason } — the same shape audit-stream-py's GET /verify endpoint emits.",
    inputs: [
      { name: 'events', type: 'array<GovernanceEvent>', required: true, description: 'Ordered events to verify end-to-end.' },
    ],
  },
  {
    name: 'audit_event_inspect',
    protocol: 'cross-cutting',
    description:
      'Pretty-print one GovernanceEvent with structural validation: required fields, known/unknown kind, payload key list, and self-consistency check (does the event\'s `hash` match the recomputed canonical hash of the body?).',
    inputs: [
      { name: 'event', type: 'object', required: true, description: 'Single GovernanceEvent to inspect.' },
    ],
  },

  // ── v0.7.0 — Live audit-stream tools (talk to a running audit-stream-py) ──
  {
    name: 'audit_event_emit',
    protocol: 'cross-cutting',
    description:
      "POST one governance event to a running audit-stream-py instance (env var AUDIT_STREAM_URL). The server assigns event_id/timestamp/prev_hash/hash; the caller provides kind + source + payload. Use when Claude needs to record a governance moment from inside a chat (e.g. a manual override, a human-approved exception, an out-of-band incident). Requires AUDIT_STREAM_URL in the MCP server's environment.",
    inputs: [
      { name: 'kind', type: 'string', required: true, description: 'Snake_case event kind. Use "other" for ad-hoc kinds.' },
      { name: 'source', type: 'string', required: true, description: 'Stable producer identifier (e.g. mcp-kinetic-gain, manual).' },
      { name: 'payload', type: 'object', required: false, description: 'Free-form structured payload alongside kind+source.' },
    ],
  },
  {
    name: 'audit_events_query',
    protocol: 'cross-cutting',
    description:
      'GET recent governance events from a running audit-stream-py instance (env var AUDIT_STREAM_URL), with optional server-side filters. Surface the last N denies, attestation failures, breaker trips, contract incompatibilities, etc. Returns the events array plus a `count` field. Requires AUDIT_STREAM_URL.',
    inputs: [
      { name: 'kind', type: 'string', required: false, description: 'Filter by event kind (exact match).' },
      { name: 'source', type: 'string', required: false, description: 'Filter by source (exact match).' },
      { name: 'limit', type: 'integer', required: false, description: "Cap on events returned. Defaults to server's own cap." },
      { name: 'since_id', type: 'integer', required: false, description: 'Return events with event_id > since_id (tailing).' },
    ],
  },
  {
    name: 'audit_chain_verify_live',
    protocol: 'cross-cutting',
    description:
      "Ask a running audit-stream-py instance to walk its own chain end-to-end and report whether it's still intact. This is the canonical compliance answer — covers the FULL server-side history, not just events the agent has in context. Returns the same shape as audit_chain_verify but for the live chain. Requires AUDIT_STREAM_URL.",
    inputs: [],
  },

  // ── v0.6.0 — Cross-spec Suite operations (2 new, cross-cutting) ───────────
  {
    name: 'suite_doc_detect_spec',
    protocol: 'cross-cutting',
    description:
      "Detect which Kinetic Gain Suite spec a JSON document is by sniffing its top-level *_version field. Returns { spec, version_field, version }. Recognises all 11 specs; returns spec='unknown' for anything else.",
    inputs: [
      { name: 'body', type: 'object', required: true, description: 'JSON document to classify.' },
    ],
  },
  {
    name: 'suite_doc_drift',
    protocol: 'cross-cutting',
    description:
      "Compare two snapshots of the same Suite document (e.g. yesterday's tutor-card vs today's) and report structural drift: added/removed/changed top-level keys, version-field bump, hash delta. Useful for change-review surfaces and incident-correlation triage.",
    inputs: [
      { name: 'before', type: 'object', required: true, description: 'Earlier snapshot of the document.' },
      { name: 'after', type: 'object', required: true, description: 'Later snapshot of the same document.' },
    ],
  },
];

export const MCP_SERVER_REPO = 'https://github.com/mizcausevic-dev/mcp-kinetic-gain';
export const TOTAL_TOOL_COUNT = TOOLS.length;
