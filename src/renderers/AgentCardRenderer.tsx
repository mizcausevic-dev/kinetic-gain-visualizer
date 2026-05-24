import { Card, Field, Pill } from './common';

type Tool = { name: string; side_effects: string; mcp_tool_card_uri?: string };
type ModelUse = { name: string; provider?: string; role: string };
type Refusal = { category: string; behavior: string; example_prompts?: string[] };

type Doc = {
  agent_card_version: string;
  agent: { id: string; name: string; version: string; provider: string; homepage?: string; description: string };
  capabilities: {
    primary_purpose: string;
    models_used: ModelUse[];
    tools: Tool[];
    max_context_tokens: number;
    memory_persistence: string;
    autonomy_level: string;
    prompts_used?: string[];
  };
  refusal_taxonomy: Refusal[];
  deployment: { environment: string; uptime_sla?: string; regions?: string[] };
  safety_posture: { human_in_loop_required: string[]; audit_log_uri?: string; incident_response_uri?: string };
};

const sideEffectTone: Record<string, 'green' | 'amber' | 'red' | 'slate'> = {
  read: 'green',
  mutating: 'amber',
  external: 'amber',
  destructive: 'red',
};

const autonomyTone: Record<string, 'green' | 'amber' | 'red'> = {
  assistive: 'green',
  supervised: 'amber',
  autonomous: 'red',
};

const envTone: Record<string, 'green' | 'amber' | 'slate'> = {
  production: 'green',
  staging: 'amber',
  sandbox: 'slate',
  experimental: 'slate',
};

export function AgentCardRenderer({ doc }: { doc: Doc }) {
  return (
    <div className="grid lg:grid-cols-12 gap-6">
      <div className="lg:col-span-7 space-y-6">
        <Card>
          <div className="flex items-center gap-2 mb-2">
            <Pill tone="violet">{doc.agent.provider}</Pill>
            <Pill tone={envTone[doc.deployment.environment] ?? 'slate'}>{doc.deployment.environment}</Pill>
            <Pill tone={autonomyTone[doc.capabilities.autonomy_level] ?? 'slate'}>{doc.capabilities.autonomy_level}</Pill>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">{doc.agent.name}</h2>
          <p className="text-sm text-slate-500 code mt-1">{doc.agent.id}@{doc.agent.version}</p>
          <p className="text-slate-300 mt-3 leading-relaxed">{doc.agent.description}</p>
        </Card>

        <Card title="Capabilities" subtitle="Models, tools, context">
          <p className="text-slate-300 mb-4">{doc.capabilities.primary_purpose}</p>

          <div className="mb-4">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Models used</div>
            <div className="grid sm:grid-cols-2 gap-2">
              {doc.capabilities.models_used.map((m) => (
                <div key={m.name} className="p-3 rounded-lg border border-slate-800 bg-slate-950">
                  <div className="text-sm font-medium">{m.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{m.provider ?? '—'} · <Pill>{m.role}</Pill></div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Tools</div>
            <div className="flex flex-wrap gap-2">
              {doc.capabilities.tools.map((t) => (
                <div key={t.name} className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 text-sm flex items-center gap-2">
                  <span className="code">{t.name}</span>
                  <Pill tone={sideEffectTone[t.side_effects] ?? 'slate'}>{t.side_effects}</Pill>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800">
            <Field label="Max context" value={`${doc.capabilities.max_context_tokens.toLocaleString()} tokens`} mono />
            <Field label="Memory" value={<Pill>{doc.capabilities.memory_persistence}</Pill>} />
          </div>
        </Card>
      </div>

      <div className="lg:col-span-5 space-y-6">
        <Card title="Refusal taxonomy" subtitle={`${doc.refusal_taxonomy.length} declared categories`} tone="warning">
          <div className="space-y-2">
            {doc.refusal_taxonomy.length === 0 && <p className="text-sm text-amber-200">No refusals declared.</p>}
            {doc.refusal_taxonomy.map((r) => (
              <div key={r.category} className="flex items-center justify-between gap-3 py-1.5">
                <span className="text-sm font-medium code">{r.category}</span>
                <Pill tone="amber">{r.behavior}</Pill>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Safety posture" tone="authority">
          {doc.safety_posture.human_in_loop_required.length > 0 && (
            <>
              <div className="text-[10px] uppercase tracking-widest text-slate-400 mb-2">Human-in-the-loop required</div>
              <div className="flex flex-wrap gap-2 mb-3">
                {doc.safety_posture.human_in_loop_required.map((c) => (
                  <span key={c} className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs code">{c}</span>
                ))}
              </div>
            </>
          )}
          {doc.safety_posture.audit_log_uri && (
            <div className="text-sm text-slate-300 break-all">
              <span className="text-[10px] uppercase tracking-widest text-slate-400 mr-2">audit_log</span>
              <a className="code text-slate-200 hover:text-white" href={doc.safety_posture.audit_log_uri} target="_blank" rel="noreferrer">
                {doc.safety_posture.audit_log_uri}
              </a>
            </div>
          )}
          {doc.safety_posture.incident_response_uri && (
            <div className="text-sm text-slate-300 break-all mt-1.5">
              <span className="text-[10px] uppercase tracking-widest text-slate-400 mr-2">incident</span>
              <a className="code text-slate-200 hover:text-white" href={doc.safety_posture.incident_response_uri} target="_blank" rel="noreferrer">
                {doc.safety_posture.incident_response_uri}
              </a>
            </div>
          )}
        </Card>

        <Card title="Deployment">
          <Field label="Environment" value={<Pill tone={envTone[doc.deployment.environment] ?? 'slate'}>{doc.deployment.environment}</Pill>} />
          {doc.deployment.uptime_sla && <Field label="SLA" value={doc.deployment.uptime_sla} mono />}
          {doc.deployment.regions && <Field label="Regions" value={
            <div className="flex flex-wrap gap-1.5">{doc.deployment.regions.map((r) => <Pill key={r}>{r}</Pill>)}</div>
          } />}
        </Card>
      </div>
    </div>
  );
}
