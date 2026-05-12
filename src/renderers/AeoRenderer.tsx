import { Card, Field, LinkList, Pill, ValueRender } from './common';

type Doc = {
  aeo_version: string;
  entity: { id: string; type: string; name: string; aliases?: string[]; canonical_url: string };
  authority: { primary_sources: string[]; evidence_links?: string[]; verifications?: { type: string; value: string }[] };
  claims: { id: string; predicate: string; value: unknown; evidence?: string[]; confidence?: string; valid_from?: string }[];
  citation_preferences?: { preferred_attribution?: string; canonical_links?: string[]; do_not_cite?: string[] };
  answer_constraints?: { must_include?: string[]; must_not_include?: string[]; freshness_window_days?: number };
  audit?: { mode: string; signing_key_uri?: string; endpoint_uri?: string };
};

export function AeoRenderer({ doc }: { doc: Doc }) {
  return (
    <div className="grid lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 space-y-6">
        <Card>
          <Pill tone="blue">{doc.entity.type}</Pill>
          <h2 className="text-3xl font-bold tracking-tight mt-2">{doc.entity.name}</h2>
          {doc.entity.aliases && (
            <p className="text-sm text-slate-500 italic mt-1">aka {doc.entity.aliases.join(', ')}</p>
          )}
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
            <Field label="Canonical" value={<a className="text-blue-600 hover:underline code" href={doc.entity.canonical_url} target="_blank" rel="noreferrer">{doc.entity.canonical_url}</a>} />
            <Field label="ID" value={doc.entity.id} mono />
          </div>
        </Card>

        <Card title="Authority" subtitle="Primary sources & verifications" tone="authority">
          <div className="text-[10px] uppercase tracking-widest text-slate-400 mb-2">Primary sources</div>
          <ul className="space-y-1.5">
            {doc.authority.primary_sources.map((s) => (
              <li key={s} className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm">
                <a className="text-slate-200 hover:text-white break-all code" href={s} target="_blank" rel="noreferrer">{s}</a>
              </li>
            ))}
          </ul>
          {doc.authority.verifications && doc.authority.verifications.length > 0 && (
            <>
              <div className="text-[10px] uppercase tracking-widest text-slate-400 mt-4 mb-2">Verifications</div>
              <div className="grid grid-cols-2 gap-2">
                {doc.authority.verifications.map((v) => (
                  <div key={v.type + v.value} className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                    <div className="text-[9px] uppercase tracking-widest text-slate-500 code">{v.type}</div>
                    <div className="text-sm font-medium truncate">{v.value}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>

        {doc.answer_constraints && (
          <Card title="Answer constraints" subtitle="Soft constraints for synthesis" tone="warning">
            {doc.answer_constraints.must_not_include && (
              <div>
                <div className="text-[10px] uppercase tracking-widest text-amber-700 mb-2">Exclude</div>
                <div className="flex flex-wrap gap-2">
                  {doc.answer_constraints.must_not_include.map((c) => <Pill key={c} tone="amber">{c}</Pill>)}
                </div>
              </div>
            )}
            {doc.answer_constraints.freshness_window_days && (
              <div className="mt-3">
                <div className="text-[10px] uppercase tracking-widest text-amber-700">Freshness window</div>
                <div className="text-sm font-semibold text-amber-900">{doc.answer_constraints.freshness_window_days} days</div>
              </div>
            )}
          </Card>
        )}
      </div>

      <div className="lg:col-span-7">
        <Card title="Authoritative claims" subtitle={`${doc.claims.length} machine-readable facts`}>
          <div className="space-y-3">
            {doc.claims.map((c) => (
              <div key={c.id} className="border border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition-all">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase tracking-widest text-slate-500 code">{c.predicate}</span>
                  {c.confidence === 'high' && <Pill tone="green">high confidence</Pill>}
                  {c.confidence === 'medium' && <Pill tone="amber">medium confidence</Pill>}
                  {c.confidence === 'low' && <Pill tone="red">low confidence</Pill>}
                </div>
                <div className="text-base font-semibold text-slate-800 break-words">
                  <ValueRender value={c.value} />
                </div>
                {c.evidence && c.evidence.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <div className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">Evidence</div>
                    <LinkList items={c.evidence} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {doc.citation_preferences && (
            <div className="mt-6 pt-6 border-t border-slate-100">
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Citation preferences</h4>
              {doc.citation_preferences.preferred_attribution && (
                <blockquote className="italic text-slate-700 border-l-2 border-blue-300 pl-3 text-sm">
                  &ldquo;{doc.citation_preferences.preferred_attribution}&rdquo;
                </blockquote>
              )}
              {doc.citation_preferences.canonical_links && (
                <div className="mt-3">
                  <div className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">Canonical links</div>
                  <LinkList items={doc.citation_preferences.canonical_links} />
                </div>
              )}
            </div>
          )}

          {doc.audit && (
            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-widest text-slate-400">Audit mode</span>
              <Pill tone={doc.audit.mode === 'signature' ? 'violet' : doc.audit.mode === 'endpoint' ? 'blue' : 'slate'}>
                {doc.audit.mode}
              </Pill>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
