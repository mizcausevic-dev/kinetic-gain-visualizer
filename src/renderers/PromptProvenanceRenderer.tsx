import { Card, Field, LinkList, Pill } from './common';

type Doc = {
  provenance_version: string;
  prompt: { id: string; name: string; version: string; hash: string; content_uri: string; content_type: string };
  lineage?: { parent?: string; derivation?: string; change_summary?: string };
  authorship?: { created_by?: string; reviewed_by?: string[]; approved_by?: string; created_at?: string; approved_at?: string };
  intent?: { purpose?: string; in_scope?: string[]; out_of_scope?: string[]; models_supported?: string[] };
  evaluations?: { suite: string; result_uri: string; score?: number; passed: boolean; ran_at: string }[];
  approval?: { state: string; policy_uri?: string };
  deprecation?: { reason: string; superseded_by?: string };
};

const approvalTone: Record<string, 'green' | 'amber' | 'red' | 'slate'> = {
  approved: 'green',
  under_review: 'amber',
  draft: 'slate',
  rejected: 'red',
  deprecated: 'red',
};

export function PromptProvenanceRenderer({ doc }: { doc: Doc }) {
  return (
    <div className="grid lg:grid-cols-12 gap-6">
      <div className="lg:col-span-7 space-y-6">
        <Card>
          <Pill tone="green">{doc.prompt.content_type}</Pill>
          <h2 className="text-3xl font-bold tracking-tight mt-2">{doc.prompt.name}</h2>
          <p className="text-sm text-slate-500 code mt-1">{doc.prompt.id}@{doc.prompt.version}</p>
          <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
            <Field label="Hash" value={doc.prompt.hash} mono />
            <Field label="Content" value={<a className="text-blue-400 hover:underline code" href={doc.prompt.content_uri} target="_blank" rel="noreferrer">{doc.prompt.content_uri}</a>} />
            {doc.approval && (
              <Field
                label="Approval"
                value={
                  <Pill tone={approvalTone[doc.approval.state] ?? 'slate'}>{doc.approval.state}</Pill>
                }
              />
            )}
          </div>
        </Card>

        {doc.intent && (
          <Card title="Intent" subtitle="What the prompt is for">
            {doc.intent.purpose && <p className="text-slate-300 mb-3">{doc.intent.purpose}</p>}
            {doc.intent.models_supported && (
              <div className="mt-2">
                <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Models supported</div>
                <div className="flex flex-wrap gap-2">
                  {doc.intent.models_supported.map((m) => <Pill key={m}>{m}</Pill>)}
                </div>
              </div>
            )}
          </Card>
        )}

        {doc.evaluations && doc.evaluations.length > 0 && (
          <Card title="Evaluations" subtitle="Gate criteria for production">
            <div className="space-y-2">
              {doc.evaluations.map((ev) => (
                <div key={ev.suite + ev.ran_at} className="flex items-center justify-between gap-4 border-b border-slate-800 last:border-0 py-2">
                  <div>
                    <div className="text-sm font-medium">{ev.suite}</div>
                    <a className="text-xs text-blue-400 code hover:underline" href={ev.result_uri} target="_blank" rel="noreferrer">{ev.result_uri}</a>
                  </div>
                  <div className="flex items-center gap-3">
                    {typeof ev.score === 'number' && (
                      <span className="text-sm font-semibold code text-slate-300">{ev.score.toFixed(2)}</span>
                    )}
                    <Pill tone={ev.passed ? 'green' : 'red'}>{ev.passed ? 'passed' : 'failed'}</Pill>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      <div className="lg:col-span-5 space-y-6">
        {doc.lineage && doc.lineage.parent && (
          <Card title="Lineage" subtitle="Where this version came from">
            <Field label="Parent" value={doc.lineage.parent} mono />
            {doc.lineage.derivation && <Field label="Derivation" value={<Pill>{doc.lineage.derivation}</Pill>} />}
            {doc.lineage.change_summary && <Field label="Change" value={doc.lineage.change_summary} />}
          </Card>
        )}

        {doc.authorship && (
          <Card title="Authorship">
            <Field label="Created by" value={doc.authorship.created_by} mono />
            {doc.authorship.reviewed_by && <Field label="Reviewed by" value={<LinkList items={doc.authorship.reviewed_by.map((r) => `mailto:${r}`)} />} />}
            <Field label="Approved by" value={doc.authorship.approved_by} mono />
            {doc.authorship.created_at && <Field label="Created" value={doc.authorship.created_at} mono />}
            {doc.authorship.approved_at && <Field label="Approved" value={doc.authorship.approved_at} mono />}
          </Card>
        )}

        {doc.deprecation && (
          <Card title="Deprecation" tone="warning">
            <Field label="Reason" value={doc.deprecation.reason} />
            {doc.deprecation.superseded_by && <Field label="Replaced by" value={doc.deprecation.superseded_by} mono />}
          </Card>
        )}
      </div>
    </div>
  );
}
