import { Card, Field, Pill } from './common';

type IncidentCard = {
  incident_card_version: string;
  incident: {
    id: string;
    title: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    categories: string[];
    discovered_at: string;
    occurred_at?: string;
    disclosed_at: string;
    resolved_at?: string;
    status: 'active' | 'mitigated' | 'resolved' | 'withdrawn';
  };
  categories_other_text?: string;
  affected: {
    vendor: string;
    products: string[];
    versions?: string[];
    agent_card_uris?: string[];
    tutor_card_uris?: string[];
    tool_card_uris?: string[];
    affected_user_count?: { kind: 'exact' | 'approximate' | 'unknown'; count?: number };
    affected_populations?: string[];
  };
  summary: string;
  root_cause: { category: string; description: string; category_other_text?: string };
  harm: { severity_justification: string; manifested: boolean; narrative?: string };
  mitigation: {
    actions_taken: string[];
    permanent_fix: boolean;
    rollout_status: 'planned' | 'in_progress' | 'deployed';
    workaround_for_users?: string;
  };
  evidence?: {
    evidence_uris?: string[];
    prompt_provenance_uri?: string;
    reproduction_uri?: string;
    internal_postmortem_uri?: string;
  };
  references?: Array<{ type: string; title: string; uri: string; published_at?: string }>;
  regulatory?: {
    reported_to?: string[];
    reporting_deadline_met?: boolean;
    regulatory_filing_uris?: string[];
    not_reportable_justification?: string;
  };
  withdrawal?: { withdrawn_at: string; reason: string; replacement_incident_uri?: string };
  published_by: { name: string; role: string; contact_uri?: string; pgp_fingerprint?: string };
  published_at: string;
  last_updated_at: string;
  revision?: { number: number; change_summary: string };
};

function sevTone(s: string): 'slate' | 'amber' | 'red' {
  if (s === 'low') return 'slate';
  if (s === 'medium' || s === 'high') return 'amber';
  return 'red'; // critical
}

function statusTone(s: string): 'red' | 'amber' | 'green' | 'slate' {
  if (s === 'active') return 'red';
  if (s === 'mitigated') return 'amber';
  if (s === 'resolved') return 'green';
  return 'slate'; // withdrawn
}

function rolloutTone(s: string): 'red' | 'amber' | 'green' {
  if (s === 'planned') return 'red';
  if (s === 'in_progress') return 'amber';
  return 'green'; // deployed
}

export function IncidentCardRenderer({ doc }: { doc: IncidentCard }) {
  const inc = doc.incident;
  const isWithdrawn = inc.status === 'withdrawn';

  return (
    <div className="space-y-4">
      {/* Withdrawal banner (if applicable) */}
      {isWithdrawn && doc.withdrawal && (
        <Card title="🚫 INCIDENT WITHDRAWN" subtitle={`withdrawn at ${doc.withdrawal.withdrawn_at}`} tone="warning">
          <Field label="Reason" value={<em className="text-amber-200">{doc.withdrawal.reason}</em>} />
          {doc.withdrawal.replacement_incident_uri && (
            <Field
              label="Replaced by"
              value={
                <a href={doc.withdrawal.replacement_incident_uri} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline code break-all">
                  ↗ {doc.withdrawal.replacement_incident_uri}
                </a>
              }
              mono
            />
          )}
        </Card>
      )}

      {/* Header */}
      <Card title={inc.title} subtitle={`Incident · v${doc.incident_card_version}`}>
        <Field label="Incident ID" value={<code className="code">{inc.id}</code>} mono />
        <Field
          label="Severity / status"
          value={
            <span className="flex items-center gap-2">
              <Pill tone={sevTone(inc.severity)}>{inc.severity.toUpperCase()}</Pill>
              <Pill tone={statusTone(inc.status)}>{inc.status}</Pill>
            </span>
          }
        />
        <Field
          label="Categories"
          value={
            <div className="flex flex-wrap gap-1.5">
              {inc.categories.map((c) => (
                <Pill key={c} tone="red">{c}</Pill>
              ))}
            </div>
          }
        />
        {doc.categories_other_text && (
          <Field label="Other category" value={<em>{doc.categories_other_text}</em>} />
        )}
        <Field
          label="Timeline"
          value={
            <div className="text-xs space-y-0.5 code text-slate-300">
              <div>occurred:   {inc.occurred_at ?? '—'}</div>
              <div>discovered: {inc.discovered_at}</div>
              <div>disclosed:  {inc.disclosed_at}</div>
              {inc.resolved_at && <div>resolved:   {inc.resolved_at}</div>}
            </div>
          }
        />
      </Card>

      {/* Summary */}
      <Card title="Summary" subtitle="What happened, plain English">
        <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{doc.summary}</p>
      </Card>

      {/* Affected */}
      <Card title="Affected" subtitle={`${doc.affected.vendor} — ${doc.affected.products.length} product${doc.affected.products.length === 1 ? '' : 's'}`}>
        <Field label="Vendor" value={doc.affected.vendor} />
        <Field
          label="Products"
          value={
            <div className="flex flex-wrap gap-1.5">
              {doc.affected.products.map((p) => (
                <Pill key={p} tone="violet">{p}</Pill>
              ))}
            </div>
          }
        />
        {doc.affected.versions && doc.affected.versions.length > 0 && (
          <Field
            label="Versions"
            value={
              <div className="flex flex-wrap gap-1.5">
                {doc.affected.versions.map((v) => (
                  <code key={v} className="code text-xs px-2 py-0.5 bg-slate-800 rounded">{v}</code>
                ))}
              </div>
            }
          />
        )}
        {doc.affected.affected_user_count && (
          <Field
            label="Users affected"
            value={
              <span className="code text-sm text-slate-200">
                {doc.affected.affected_user_count.kind}
                {doc.affected.affected_user_count.count !== undefined && (
                  <> · {doc.affected.affected_user_count.count.toLocaleString()}</>
                )}
              </span>
            }
            mono
          />
        )}
        {doc.affected.affected_populations && doc.affected.affected_populations.length > 0 && (
          <Field
            label="Populations"
            value={
              <div className="flex flex-wrap gap-1.5">
                {doc.affected.affected_populations.map((p) => (
                  <Pill key={p} tone="amber">{p}</Pill>
                ))}
              </div>
            }
          />
        )}
      </Card>

      {/* Cross-spec references */}
      {(doc.affected.agent_card_uris?.length || doc.affected.tutor_card_uris?.length || doc.affected.tool_card_uris?.length) && (
        <Card title="Cross-spec references" subtitle="Chain through to every affected disclosure">
          {doc.affected.agent_card_uris && doc.affected.agent_card_uris.length > 0 && (
            <Field
              label={`Agent Card${doc.affected.agent_card_uris.length === 1 ? '' : 's'}`}
              value={
                <ul className="space-y-0.5">
                  {doc.affected.agent_card_uris.map((u) => (
                    <li key={u}>
                      <a href={u} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline code text-xs break-all">↗ {u}</a>
                    </li>
                  ))}
                </ul>
              }
            />
          )}
          {doc.affected.tutor_card_uris && doc.affected.tutor_card_uris.length > 0 && (
            <Field
              label={`Tutor Card${doc.affected.tutor_card_uris.length === 1 ? '' : 's'}`}
              value={
                <ul className="space-y-0.5">
                  {doc.affected.tutor_card_uris.map((u) => (
                    <li key={u}>
                      <a href={u} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline code text-xs break-all">↗ {u}</a>
                    </li>
                  ))}
                </ul>
              }
            />
          )}
          {doc.affected.tool_card_uris && doc.affected.tool_card_uris.length > 0 && (
            <Field
              label={`MCP Tool Card${doc.affected.tool_card_uris.length === 1 ? '' : 's'}`}
              value={
                <ul className="space-y-0.5">
                  {doc.affected.tool_card_uris.map((u) => (
                    <li key={u}>
                      <a href={u} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline code text-xs break-all">↗ {u}</a>
                    </li>
                  ))}
                </ul>
              }
            />
          )}
        </Card>
      )}

      {/* Root cause */}
      <Card title="Root cause" subtitle="Technical breakdown">
        <Field label="Category" value={<Pill tone="red">{doc.root_cause.category}</Pill>} />
        {doc.root_cause.category_other_text && (
          <Field label="Other category" value={<em>{doc.root_cause.category_other_text}</em>} />
        )}
        <Field label="Description" value={<p className="text-sm text-slate-300 leading-relaxed">{doc.root_cause.description}</p>} />
      </Card>

      {/* Harm */}
      <Card title="Harm" subtitle="Impact assessment">
        <Field
          label="Manifested"
          value={<Pill tone={doc.harm.manifested ? 'red' : 'amber'}>{doc.harm.manifested ? 'yes, harm actually occurred' : 'no, near-miss or theoretical'}</Pill>}
        />
        <Field
          label="Severity justification"
          value={<em className="text-sm text-slate-300">{doc.harm.severity_justification}</em>}
        />
        {doc.harm.narrative && <Field label="Narrative" value={<p className="text-sm text-slate-300 leading-relaxed">{doc.harm.narrative}</p>} />}
      </Card>

      {/* Mitigation */}
      <Card title="Mitigation" subtitle="What was done about it">
        <Field
          label="Permanent fix"
          value={<Pill tone={doc.mitigation.permanent_fix ? 'green' : 'amber'}>{doc.mitigation.permanent_fix ? 'yes' : 'no, temporary mitigation pending full fix'}</Pill>}
        />
        <Field
          label="Rollout status"
          value={<Pill tone={rolloutTone(doc.mitigation.rollout_status)}>{doc.mitigation.rollout_status}</Pill>}
        />
        <Field
          label="Actions taken"
          value={
            <ol className="space-y-1 text-sm text-slate-300 list-decimal list-inside">
              {doc.mitigation.actions_taken.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ol>
          }
        />
        {doc.mitigation.workaround_for_users && (
          <Field label="Workaround" value={<em className="text-sm text-slate-300">{doc.mitigation.workaround_for_users}</em>} />
        )}
      </Card>

      {/* Regulatory */}
      {doc.regulatory && (doc.regulatory.reported_to?.length || doc.regulatory.not_reportable_justification) && (
        <Card title="Regulatory" subtitle="Filings and reporting deadlines" tone="authority">
          {doc.regulatory.reported_to && doc.regulatory.reported_to.length > 0 && (
            <Field
              label="Reported to"
              value={
                <div className="flex flex-wrap gap-1.5">
                  {doc.regulatory.reported_to.map((r) => (
                    <Pill key={r} tone="red">{r}</Pill>
                  ))}
                </div>
              }
            />
          )}
          {doc.regulatory.reporting_deadline_met !== undefined && (
            <Field
              label="Deadline met"
              value={<Pill tone={doc.regulatory.reporting_deadline_met ? 'green' : 'red'}>{doc.regulatory.reporting_deadline_met ? 'yes' : 'NO'}</Pill>}
            />
          )}
          {doc.regulatory.regulatory_filing_uris && doc.regulatory.regulatory_filing_uris.length > 0 && (
            <Field
              label="Filing URIs"
              value={
                <ul className="space-y-0.5">
                  {doc.regulatory.regulatory_filing_uris.map((u) => (
                    <li key={u}>
                      <a href={u} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline code text-xs break-all">↗ {u}</a>
                    </li>
                  ))}
                </ul>
              }
            />
          )}
          {doc.regulatory.not_reportable_justification && (
            <Field
              label="Not reportable"
              value={<em className="text-sm text-slate-300">{doc.regulatory.not_reportable_justification}</em>}
            />
          )}
        </Card>
      )}

      {/* Evidence */}
      {doc.evidence && (
        <Card title="Evidence" subtitle="Cross-references for forensic reconstruction">
          {doc.evidence.evidence_uris && doc.evidence.evidence_uris.length > 0 && (
            <Field
              label="AI Evidence docs"
              value={
                <ul className="space-y-0.5">
                  {doc.evidence.evidence_uris.map((u) => (
                    <li key={u}>
                      <a href={u} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline code text-xs break-all">↗ {u}</a>
                    </li>
                  ))}
                </ul>
              }
            />
          )}
          {doc.evidence.prompt_provenance_uri && (
            <Field
              label="Prompt Provenance"
              value={
                <a href={doc.evidence.prompt_provenance_uri} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline code text-xs break-all">
                  ↗ {doc.evidence.prompt_provenance_uri}
                </a>
              }
              mono
            />
          )}
          {doc.evidence.reproduction_uri && (
            <Field
              label="Reproduction"
              value={
                <a href={doc.evidence.reproduction_uri} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline code text-xs break-all">
                  ↗ {doc.evidence.reproduction_uri}
                </a>
              }
              mono
            />
          )}
          {doc.evidence.internal_postmortem_uri && (
            <Field
              label="Internal postmortem"
              value={
                <a href={doc.evidence.internal_postmortem_uri} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline code text-xs break-all">
                  ↗ {doc.evidence.internal_postmortem_uri}
                </a>
              }
              mono
            />
          )}
        </Card>
      )}

      {/* References */}
      {doc.references && doc.references.length > 0 && (
        <Card title="References" subtitle="External writeups, filings, press">
          <ul className="space-y-1.5">
            {doc.references.map((r, i) => (
              <li key={i} className="text-sm">
                <Pill tone="slate">{r.type}</Pill>{' '}
                <a href={r.uri} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
                  {r.title}
                </a>
                {r.published_at && <span className="text-xs text-slate-500"> · {r.published_at}</span>}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Publisher */}
      <Card title="Published by" subtitle="Authority + audit trail">
        <Field label="Name" value={doc.published_by.name} />
        <Field label="Role" value={<Pill tone="violet">{doc.published_by.role}</Pill>} />
        {doc.published_by.contact_uri && (
          <Field
            label="Contact"
            value={
              <a href={doc.published_by.contact_uri} className="text-blue-400 hover:underline code break-all">
                {doc.published_by.contact_uri}
              </a>
            }
            mono
          />
        )}
        <Field label="Published at" value={doc.published_at} />
        <Field label="Last updated" value={doc.last_updated_at} />
        {doc.revision && (
          <Field
            label="Revision"
            value={
              <span className="text-sm text-slate-300">
                <code className="code">#{doc.revision.number}</code> · {doc.revision.change_summary}
              </span>
            }
          />
        )}
      </Card>
    </div>
  );
}
