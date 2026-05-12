import { Card, Field, Pill } from './common';

type TestEntry = { llm: string; provider?: string; test_suite_uri: string; pass_rate: number; tested_at: string; sample_size?: number };

type Doc = {
  tool_card_version: string;
  tool: { server_id: string; name: string; version: string; mcp_server_uri: string; description: string };
  schema: { input_schema_uri?: string; input_schema_inline?: object; output_schema_uri?: string };
  safety: {
    side_effect_class: string;
    external_systems?: string[];
    reversible: boolean;
    rate_limited: boolean;
    pii_exposure: string;
    secrets_exposure: string;
    human_approval_required: boolean;
    refusal_modes?: string[];
  };
  tested_with?: TestEntry[];
  performance?: { p50_latency_ms?: number; p99_latency_ms?: number; measurement_window?: string };
  cost?: { per_call_amount?: number; per_call_currency?: string; notes?: string };
  audit?: { log_uri?: string; retention_days?: number; incident_response_uri?: string };
};

const sideEffectTone: Record<string, 'green' | 'amber' | 'red' | 'slate'> = {
  read: 'green',
  mutating: 'amber',
  external: 'amber',
  destructive: 'red',
};

const exposureTone: Record<string, 'green' | 'amber' | 'red'> = {
  none: 'green',
  low: 'green',
  medium: 'amber',
  high: 'red',
  reads_secret_material: 'amber',
  writes_secret_material: 'red',
  handles_keys: 'red',
};

export function McpToolCardRenderer({ doc }: { doc: Doc }) {
  return (
    <div className="grid lg:grid-cols-12 gap-6">
      <div className="lg:col-span-7 space-y-6">
        <Card>
          <div className="flex items-center gap-2 mb-2">
            <Pill tone="rose">{doc.tool.server_id}</Pill>
            <Pill tone={sideEffectTone[doc.safety.side_effect_class] ?? 'slate'}>{doc.safety.side_effect_class}</Pill>
            {doc.safety.human_approval_required && <Pill tone="red">approval required</Pill>}
          </div>
          <h2 className="text-3xl font-bold tracking-tight code">{doc.tool.name}</h2>
          <p className="text-sm text-slate-500 mt-1">v{doc.tool.version}</p>
          <p className="text-slate-700 mt-3 leading-relaxed">{doc.tool.description}</p>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <Field label="MCP server" value={<a className="text-blue-600 hover:underline code" href={doc.tool.mcp_server_uri} target="_blank" rel="noreferrer">{doc.tool.mcp_server_uri}</a>} />
          </div>
        </Card>

        <Card title="Schema" subtitle="Input contract">
          {doc.schema.input_schema_inline ? (
            <pre className="text-xs code bg-slate-50 rounded p-3 border border-slate-200 overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(doc.schema.input_schema_inline, null, 2)}
            </pre>
          ) : doc.schema.input_schema_uri ? (
            <a className="text-blue-600 hover:underline code text-sm" href={doc.schema.input_schema_uri} target="_blank" rel="noreferrer">
              {doc.schema.input_schema_uri}
            </a>
          ) : (
            <p className="text-sm text-slate-400">No input schema declared.</p>
          )}
        </Card>

        {doc.tested_with && doc.tested_with.length > 0 && (
          <Card title="Tested with" subtitle={`${doc.tested_with.length} model${doc.tested_with.length === 1 ? '' : 's'} validated`}>
            <div className="space-y-3">
              {doc.tested_with.map((t) => (
                <div key={t.llm + t.tested_at} className="border border-slate-200 rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium code">{t.llm}</div>
                      <div className="text-xs text-slate-500">{t.provider ?? '—'} · {t.tested_at}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 rounded bg-slate-200 overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${(t.pass_rate * 100).toFixed(0)}%` }} />
                      </div>
                      <span className="text-sm code font-semibold text-slate-700 w-12 text-right">{(t.pass_rate * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      <div className="lg:col-span-5 space-y-6">
        <Card title="Safety profile" tone="warning">
          <Field label="Side effect" value={<Pill tone={sideEffectTone[doc.safety.side_effect_class] ?? 'slate'}>{doc.safety.side_effect_class}</Pill>} />
          <Field label="Reversible" value={<Pill tone={doc.safety.reversible ? 'green' : 'red'}>{doc.safety.reversible ? 'yes' : 'no'}</Pill>} />
          <Field label="Rate limited" value={<Pill tone={doc.safety.rate_limited ? 'green' : 'amber'}>{doc.safety.rate_limited ? 'yes' : 'no'}</Pill>} />
          <Field label="PII exposure" value={<Pill tone={exposureTone[doc.safety.pii_exposure] ?? 'slate'}>{doc.safety.pii_exposure}</Pill>} />
          <Field label="Secrets" value={<Pill tone={exposureTone[doc.safety.secrets_exposure] ?? 'slate'}>{doc.safety.secrets_exposure}</Pill>} />
          {doc.safety.external_systems && doc.safety.external_systems.length > 0 && (
            <Field label="External" value={<div className="flex flex-wrap gap-1.5">{doc.safety.external_systems.map((e) => <Pill key={e}>{e}</Pill>)}</div>} />
          )}
          {doc.safety.refusal_modes && doc.safety.refusal_modes.length > 0 && (
            <Field label="Refusals" value={<div className="flex flex-wrap gap-1.5">{doc.safety.refusal_modes.map((r) => <Pill key={r} tone="amber">{r}</Pill>)}</div>} />
          )}
        </Card>

        {doc.performance && (
          <Card title="Performance">
            {typeof doc.performance.p50_latency_ms === 'number' && <Field label="p50 latency" value={`${doc.performance.p50_latency_ms} ms`} mono />}
            {typeof doc.performance.p99_latency_ms === 'number' && <Field label="p99 latency" value={`${doc.performance.p99_latency_ms} ms`} mono />}
            {doc.performance.measurement_window && <Field label="Window" value={doc.performance.measurement_window} mono />}
          </Card>
        )}

        {doc.cost && doc.cost.per_call_amount !== undefined && (
          <Card title="Cost">
            <Field
              label="Per call"
              value={
                <span className="code font-semibold">
                  {doc.cost.per_call_currency ?? 'USD'} {doc.cost.per_call_amount.toFixed(4)}
                </span>
              }
            />
            {doc.cost.notes && <p className="text-xs text-slate-500 italic mt-2">{doc.cost.notes}</p>}
          </Card>
        )}
      </div>
    </div>
  );
}
