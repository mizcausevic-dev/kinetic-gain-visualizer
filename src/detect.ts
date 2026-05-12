/**
 * Spec auto-detection for the Kinetic Gain Protocol Suite.
 *
 * Every spec in the suite carries a top-level `<name>_version` field.
 * `detectSpec` inspects an arbitrary JSON object and returns the
 * matching spec key, or `"unknown"` if no version field matches.
 */
export type SpecKey =
  | 'aeo'
  | 'prompt-provenance'
  | 'agent-card'
  | 'ai-evidence'
  | 'mcp-tool-card'
  | 'tutor-card'
  | 'student-ai-disclosure'
  | 'unknown';

export interface SpecInfo {
  key: Exclude<SpecKey, 'unknown'>;
  displayName: string;
  versionField: string;
  specRepo: string;
  accent: string; // tailwind color stem used for badges and highlights
}

export const SPECS: Record<Exclude<SpecKey, 'unknown'>, SpecInfo> = {
  aeo: {
    key: 'aeo',
    displayName: 'AEO Protocol',
    versionField: 'aeo_version',
    specRepo: 'https://github.com/mizcausevic-dev/aeo-protocol-spec',
    accent: 'blue',
  },
  'prompt-provenance': {
    key: 'prompt-provenance',
    displayName: 'Prompt Provenance',
    versionField: 'provenance_version',
    specRepo: 'https://github.com/mizcausevic-dev/prompt-provenance-spec',
    accent: 'emerald',
  },
  'agent-card': {
    key: 'agent-card',
    displayName: 'Agent Card',
    versionField: 'agent_card_version',
    specRepo: 'https://github.com/mizcausevic-dev/agent-cards-spec',
    accent: 'violet',
  },
  'ai-evidence': {
    key: 'ai-evidence',
    displayName: 'AI Evidence',
    versionField: 'evidence_version',
    specRepo: 'https://github.com/mizcausevic-dev/ai-evidence-format-spec',
    accent: 'amber',
  },
  'mcp-tool-card': {
    key: 'mcp-tool-card',
    displayName: 'MCP Tool Card',
    versionField: 'tool_card_version',
    specRepo: 'https://github.com/mizcausevic-dev/mcp-tool-card-spec',
    accent: 'rose',
  },
  'tutor-card': {
    key: 'tutor-card',
    displayName: 'AI Tutor Card',
    versionField: 'tutor_card_version',
    specRepo: 'https://github.com/mizcausevic-dev/ai-tutor-card-spec',
    accent: 'teal',
  },
  'student-ai-disclosure': {
    key: 'student-ai-disclosure',
    displayName: 'Student AI Disclosure',
    versionField: 'disclosure_version',
    specRepo: 'https://github.com/mizcausevic-dev/student-ai-disclosure-spec',
    accent: 'indigo',
  },
};

export function detectSpec(value: unknown): SpecKey {
  if (!value || typeof value !== 'object') return 'unknown';
  const obj = value as Record<string, unknown>;
  for (const info of Object.values(SPECS)) {
    if (info.versionField in obj) return info.key;
  }
  return 'unknown';
}

export function specInfo(key: SpecKey): SpecInfo | null {
  if (key === 'unknown') return null;
  return SPECS[key];
}
