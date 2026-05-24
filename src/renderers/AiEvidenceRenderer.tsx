import { Card, Field, Pill } from './common';

type Doc = {
  evidence_version: string;
  evidence_id: string;
  claim_text: string;
  source: { uri: string; type: string; title?: string; publisher?: string; published_at?: string; fetched_at: string };
  span: { selector_type: string; selector_value?: string; exact_text?: string; surrounding_context?: string };
  retrieval: { method: string; confidence?: number; rank?: number; freshness_age_seconds?: number; retriever_id?: string };
  verification: { content_hash: string; signature?: string; signed_by?: string };
  synthesis_role: string;
  notes?: string;
};

const roleTone: Record<string, 'green' | 'red' | 'amber' | 'slate'> = {
  supporting: 'green',
  contradicting: 'red',
  partial: 'amber',
  background: 'slate',
};

const methodTone: Record<string, 'blue' | 'violet' | 'amber' | 'slate'> = {
  vector: 'violet',
  keyword: 'blue',
  graph: 'amber',
  hybrid: 'violet',
  direct_fetch: 'slate',
  model_recall: 'amber',
};

export function AiEvidenceRenderer({ doc }: { doc: Doc }) {
  return (
    <div className="grid lg:grid-cols-12 gap-6">
      <div className="lg:col-span-7 space-y-6">
        <Card>
          <div className="flex items-center gap-2 mb-2">
            <Pill tone={roleTone[doc.synthesis_role] ?? 'slate'}>{doc.synthesis_role}</Pill>
            <span className="text-xs text-slate-500 code">{doc.evidence_id}</span>
          </div>
          <h2 className="text-xl font-semibold tracking-tight mb-3">Claim</h2>
          <blockquote className="text-slate-300 border-l-2 border-amber-400 pl-4 italic text-base leading-relaxed">
            &ldquo;{doc.claim_text}&rdquo;
          </blockquote>
        </Card>

        <Card title="Span" subtitle="What the engine pulled out of the source">
          <Field label="Selector" value={<><Pill>{doc.span.selector_type}</Pill> <span className="code text-sm ml-2">{doc.span.selector_value ?? ''}</span></>} />
          {doc.span.exact_text && (
            <div className="mt-3">
              <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Exact text</div>
              <pre className="text-xs code bg-slate-950 rounded p-3 border border-slate-800 overflow-x-auto whitespace-pre-wrap">{doc.span.exact_text}</pre>
            </div>
          )}
          {doc.span.surrounding_context && (
            <Field label="Context" value={doc.span.surrounding_context} />
          )}
        </Card>

        <Card title="Source">
          <Field label="URI" value={<a className="text-blue-400 hover:underline code" href={doc.source.uri} target="_blank" rel="noreferrer">{doc.source.uri}</a>} />
          <Field label="Type" value={<Pill>{doc.source.type}</Pill>} />
          {doc.source.title && <Field label="Title" value={doc.source.title} />}
          {doc.source.publisher && <Field label="Publisher" value={doc.source.publisher} />}
          {doc.source.published_at && <Field label="Published" value={doc.source.published_at} mono />}
          <Field label="Fetched" value={doc.source.fetched_at} mono />
        </Card>
      </div>

      <div className="lg:col-span-5 space-y-6">
        <Card title="Retrieval" subtitle="How the engine got the span">
          <Field label="Method" value={<Pill tone={methodTone[doc.retrieval.method] ?? 'slate'}>{doc.retrieval.method}</Pill>} />
          {typeof doc.retrieval.confidence === 'number' && (
            <Field
              label="Confidence"
              value={
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded bg-slate-200 overflow-hidden">
                    <div className="h-full bg-emerald-500/100" style={{ width: `${(doc.retrieval.confidence * 100).toFixed(0)}%` }} />
                  </div>
                  <span className="text-sm code text-slate-300">{(doc.retrieval.confidence * 100).toFixed(0)}%</span>
                </div>
              }
            />
          )}
          {typeof doc.retrieval.rank === 'number' && <Field label="Rank" value={`#${doc.retrieval.rank}`} mono />}
          {typeof doc.retrieval.freshness_age_seconds === 'number' && (
            <Field label="Freshness" value={`${doc.retrieval.freshness_age_seconds}s old at fetch`} mono />
          )}
          {doc.retrieval.retriever_id && <Field label="Retriever" value={doc.retrieval.retriever_id} mono />}
        </Card>

        <Card title="Verification" tone="authority">
          <div className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">Content hash</div>
          <pre className="text-xs code bg-slate-800 rounded p-3 border border-slate-700 overflow-x-auto break-all whitespace-pre-wrap text-slate-200">
{doc.verification.content_hash}
          </pre>
          {doc.verification.signature && (
            <div className="mt-3">
              <div className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">Signature</div>
              <div className="text-xs code text-slate-300 break-all">{doc.verification.signature.slice(0, 64)}&hellip;</div>
              {doc.verification.signed_by && <div className="text-[10px] text-slate-500 mt-1">signed by <span className="code">{doc.verification.signed_by}</span></div>}
            </div>
          )}
        </Card>

        {doc.notes && (
          <Card title="Notes" tone="warning">
            <p className="text-sm text-amber-200">{doc.notes}</p>
          </Card>
        )}
      </div>
    </div>
  );
}
