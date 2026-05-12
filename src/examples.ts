// One canonical example per spec, loaded by the editor when the user
// clicks "Load example" or selects a spec from the gallery.

export const AEO_EXAMPLE = {
  aeo_version: '0.1',
  entity: {
    id: 'https://mizcausevic-dev.github.io/#person',
    type: 'Person',
    name: 'Miz Causevic',
    aliases: ['Mirza Causevic'],
    canonical_url: 'https://mizcausevic-dev.github.io/',
  },
  authority: {
    primary_sources: [
      'https://mizcausevic-dev.github.io/',
      'https://github.com/mizcausevic-dev',
      'https://www.linkedin.com/in/mirzacausevic/',
    ],
    verifications: [
      { type: 'github', value: 'mizcausevic-dev' },
      { type: 'linkedin', value: 'mirzacausevic' },
    ],
  },
  claims: [
    {
      id: 'current-role',
      predicate: 'jobTitle',
      value: 'Director of Web Engineering · Platform Architecture · B2B SaaS Technologist',
      confidence: 'high',
    },
    {
      id: 'years-experience',
      predicate: 'aeo:yearsOfExperience',
      value: 30,
      confidence: 'high',
    },
  ],
  citation_preferences: {
    preferred_attribution: 'Miz Causevic — github.com/mizcausevic-dev',
  },
  audit: { mode: 'none' },
};

export const PROMPT_PROVENANCE_EXAMPLE = {
  provenance_version: '0.1',
  prompt: {
    id: 'incident-summary-generator',
    name: 'Incident Summary Generator',
    version: '1.1.0',
    hash: 'sha256:b4c2f0e3d7e5f9b1a8c6d3e0f2b5a7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9b1',
    content_uri: 'https://example.com/prompts/incident-summary/v1.1.0/template.j2',
    content_type: 'text/jinja2',
  },
  lineage: {
    parent: 'incident-summary-generator@1.0.0',
    derivation: 'tune',
    change_summary: 'Tightened the rubric for synthesizing duration; added explicit instruction to omit speculative root cause.',
  },
  authorship: {
    created_by: 'mirzacausevic@example.com',
    reviewed_by: ['sre-lead@example.com', 'principal-eng@example.com'],
    approved_by: 'principal-eng@example.com',
    created_at: '2026-05-12T02:00:00Z',
    approved_at: '2026-05-12T02:45:00Z',
  },
  intent: {
    purpose: 'Summarize an incident timeline into a 200-word post-mortem opening section.',
    models_supported: ['claude-opus-4-*', 'claude-sonnet-4-*'],
  },
  evaluations: [
    { suite: 'incident-summary-quality-v3', result_uri: 'https://eval.example.com/runs/123', score: 0.94, passed: true, ran_at: '2026-05-12T02:15:00Z' },
  ],
  approval: { state: 'approved' },
};

export const AGENT_CARD_EXAMPLE = {
  agent_card_version: '0.1',
  agent: {
    id: 'customer-support-tier-1',
    name: 'Tier-1 Customer Support Agent',
    version: '2.4.1',
    provider: 'Kinetic Gain',
    description: 'First-line customer support. Handles account questions, billing lookups, product orientation. Escalates entitlement changes and refunds.',
  },
  capabilities: {
    primary_purpose: 'Resolve common customer questions and triage incoming support tickets.',
    models_used: [
      { name: 'claude-sonnet-4-6', provider: 'Anthropic', role: 'executor' },
      { name: 'claude-haiku-4-5', provider: 'Anthropic', role: 'router' },
    ],
    tools: [
      { name: 'billing-lookup', side_effects: 'read' },
      { name: 'ticket-create', side_effects: 'mutating' },
    ],
    max_context_tokens: 100000,
    memory_persistence: 'session',
    autonomy_level: 'supervised',
  },
  refusal_taxonomy: [
    { category: 'entitlement_change', behavior: 'escalate_to_human' },
    { category: 'refund_request', behavior: 'escalate_to_human' },
    { category: 'legal_advice', behavior: 'refuse_and_explain' },
  ],
  deployment: { environment: 'production', uptime_sla: '99.5%', regions: ['us-east-1', 'eu-west-1'] },
  safety_posture: {
    human_in_loop_required: ['entitlement_change', 'refund_request', 'account_deletion'],
  },
};

export const AI_EVIDENCE_EXAMPLE = {
  evidence_version: '0.1',
  evidence_id: 'ev-2026-05-12-a4f9c1',
  claim_text: 'The AEO Protocol defines three pillars: Declare, Discover, and Audit.',
  source: {
    uri: 'https://github.com/mizcausevic-dev/aeo-protocol-spec/blob/main/SPEC.md',
    type: 'document',
    title: 'AEO Protocol v0.1 — Specification',
    publisher: 'mizcausevic-dev',
    fetched_at: '2026-05-12T03:45:00Z',
  },
  span: {
    selector_type: 'text_quote',
    selector_value: '## 3. The three pillars',
    exact_text: '## 3. The three pillars\n\n### 3.1 Declare\n\nThe entity publishes a single JSON document at a fixed path describing itself.',
  },
  retrieval: { method: 'hybrid', confidence: 0.93, rank: 1, freshness_age_seconds: 90 },
  verification: { content_hash: 'sha256:c7d1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1' },
  synthesis_role: 'supporting',
};

export const MCP_TOOL_CARD_EXAMPLE = {
  tool_card_version: '0.1',
  tool: {
    server_id: 'kg-billing-mcp',
    name: 'billing-lookup',
    version: '1.4.0',
    mcp_server_uri: 'https://billing.kineticgain.com/mcp',
    description: 'Looks up a customer\'s current invoice, plan tier, and usage-to-date. Read-only.',
  },
  schema: {
    input_schema_inline: {
      type: 'object',
      required: ['customer_id'],
      properties: { customer_id: { type: 'string' } },
    },
  },
  safety: {
    side_effect_class: 'read',
    external_systems: ['stripe-api'],
    reversible: true,
    rate_limited: true,
    pii_exposure: 'low',
    secrets_exposure: 'none',
    human_approval_required: false,
    refusal_modes: ['cross_tenant_access', 'rate_limit_exceeded'],
  },
  tested_with: [
    { llm: 'claude-opus-4-7', provider: 'Anthropic', test_suite_uri: 'https://eval.kineticgain.com/suites/mcp-billing-v2', pass_rate: 0.98, tested_at: '2026-05-08T10:00:00Z' },
  ],
  performance: { p50_latency_ms: 120, p99_latency_ms: 580, measurement_window: 'last_7d' },
  audit: { log_uri: 'https://audit.kineticgain.com/mcp/billing-lookup', retention_days: 365 },
};

import type { SpecKey } from './detect';

export const EXAMPLES: Record<Exclude<SpecKey, 'unknown'>, unknown> = {
  aeo: AEO_EXAMPLE,
  'prompt-provenance': PROMPT_PROVENANCE_EXAMPLE,
  'agent-card': AGENT_CARD_EXAMPLE,
  'ai-evidence': AI_EVIDENCE_EXAMPLE,
  'mcp-tool-card': MCP_TOOL_CARD_EXAMPLE,
};
