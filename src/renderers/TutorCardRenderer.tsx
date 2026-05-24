import { Card, Field, Pill } from './common';

type Doc = {
  tutor_card_version: string;
  tutor: { id: string; name: string; version: string; provider: string; homepage?: string; description: string };
  audience: {
    age_range_min: number;
    age_range_max: number;
    grade_range_min: string;
    grade_range_max: string;
    language_codes: string[];
  };
  subject_scope: {
    primary_subjects: string[];
    topics_included?: string[];
    topics_excluded?: string[];
  };
  pedagogy: {
    approach: string;
    homework_policy: 'complete' | 'guide_only' | 'refuse';
    assessment_policy: 'complete' | 'guide_only' | 'refuse';
    supports_visual_explanations?: boolean;
    supports_step_by_step_breakdown?: boolean;
    supports_alternative_explanations?: boolean;
  };
  curriculum_alignment?: { framework: string; version?: string; coverage_uri?: string }[];
  safety: {
    content_filter_strength: 'strict' | 'moderate' | 'light';
    mandated_reporter_protocol: boolean;
    human_in_loop_required: string[];
    blocks_explicit_content?: boolean;
    blocks_drug_alcohol_content?: boolean;
    blocks_violence_content?: boolean;
    blocks_political_advocacy?: boolean;
  };
  data_privacy: {
    ferpa_compliant: boolean;
    coppa_compliant: boolean;
    gdpr_compliant: boolean;
    retention_days: number;
    data_sharing_with_parents: 'full_transcript' | 'summaries_only' | 'none';
    data_sharing_with_school: 'full_transcript' | 'summaries_only' | 'none';
    third_party_data_sharing: boolean;
  };
  agent_card_uri?: string;
  evaluations?: { suite: string; result_uri: string; ran_at: string }[];
};

const policyTone: Record<string, 'green' | 'amber' | 'red'> = {
  refuse: 'green', // refusing homework/assessment is the strict / aligned choice
  guide_only: 'amber',
  complete: 'red', // completing assignments is the lax / blocking choice for procurement
};

const filterTone: Record<string, 'green' | 'amber' | 'red'> = {
  strict: 'green',
  moderate: 'amber',
  light: 'red',
};

const shareTone: Record<string, 'green' | 'amber' | 'red'> = {
  none: 'green',
  summaries_only: 'amber',
  full_transcript: 'red',
};

function complianceCheck(card: Doc) {
  const minAge = card.audience.age_range_min;
  if (minAge < 13 && !card.data_privacy.coppa_compliant) {
    return {
      pass: false,
      message: `COPPA violation: audience min age is ${minAge} (<13) but coppa_compliant=false. Procurement-blocking for K-12.`,
    };
  }
  return { pass: true, message: 'COPPA conditional rule satisfied.' };
}

export function TutorCardRenderer({ doc }: { doc: Doc }) {
  const compliance = complianceCheck(doc);
  return (
    <div className="grid lg:grid-cols-12 gap-6">
      <div className="lg:col-span-7 space-y-6">
        <Card>
          <div className="flex items-center gap-2 mb-2">
            <Pill tone="violet">{doc.tutor.provider}</Pill>
            <Pill tone="slate">Tutor v{doc.tutor.version}</Pill>
            <Pill>{doc.pedagogy.approach}</Pill>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">{doc.tutor.name}</h2>
          <p className="text-sm text-slate-500 code mt-1">{doc.tutor.id}</p>
          <p className="text-slate-300 mt-3 leading-relaxed">{doc.tutor.description}</p>

          {!compliance.pass && (
            <div className="mt-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-300">
              <strong>Compliance flag:</strong> {compliance.message}
            </div>
          )}
        </Card>

        <Card title="Audience" subtitle="Who the tutor is for">
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Ages"
              value={`${doc.audience.age_range_min}–${doc.audience.age_range_max}`}
              mono
            />
            <Field
              label="Grades"
              value={`${doc.audience.grade_range_min}–${doc.audience.grade_range_max}`}
              mono
            />
          </div>
          <Field
            label="Languages"
            value={
              <div className="flex flex-wrap gap-1.5">
                {doc.audience.language_codes.map((lang) => (
                  <Pill key={lang}>{lang}</Pill>
                ))}
              </div>
            }
          />
        </Card>

        <Card title="Subject scope">
          <Field
            label="Primary"
            value={
              <div className="flex flex-wrap gap-1.5">
                {doc.subject_scope.primary_subjects.map((s) => (
                  <Pill key={s} tone="violet">
                    {s}
                  </Pill>
                ))}
              </div>
            }
          />
          {doc.subject_scope.topics_included && doc.subject_scope.topics_included.length > 0 && (
            <Field
              label="Included"
              value={
                <div className="flex flex-wrap gap-1.5">
                  {doc.subject_scope.topics_included.map((t) => (
                    <Pill key={t} tone="green">
                      {t}
                    </Pill>
                  ))}
                </div>
              }
            />
          )}
          {doc.subject_scope.topics_excluded && doc.subject_scope.topics_excluded.length > 0 && (
            <Field
              label="Excluded"
              value={
                <div className="flex flex-wrap gap-1.5">
                  {doc.subject_scope.topics_excluded.map((t) => (
                    <Pill key={t} tone="red">
                      {t}
                    </Pill>
                  ))}
                </div>
              }
            />
          )}
        </Card>

        <Card title="Pedagogy" subtitle="How the tutor teaches">
          <Field label="Approach" value={<Pill tone="violet">{doc.pedagogy.approach}</Pill>} />
          <Field
            label="Homework"
            value={<Pill tone={policyTone[doc.pedagogy.homework_policy] ?? 'slate'}>{doc.pedagogy.homework_policy}</Pill>}
          />
          <Field
            label="Assessment"
            value={
              <Pill tone={policyTone[doc.pedagogy.assessment_policy] ?? 'slate'}>
                {doc.pedagogy.assessment_policy}
              </Pill>
            }
          />
          {(doc.pedagogy.supports_visual_explanations ||
            doc.pedagogy.supports_step_by_step_breakdown ||
            doc.pedagogy.supports_alternative_explanations) && (
            <div className="mt-3 pt-3 border-t border-slate-800">
              <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2 code">Behavioral features</div>
              <div className="flex flex-wrap gap-1.5">
                {doc.pedagogy.supports_visual_explanations && <Pill tone="green">visual explanations</Pill>}
                {doc.pedagogy.supports_step_by_step_breakdown && <Pill tone="green">step-by-step</Pill>}
                {doc.pedagogy.supports_alternative_explanations && <Pill tone="green">alternative explanations</Pill>}
              </div>
            </div>
          )}
        </Card>
      </div>

      <div className="lg:col-span-5 space-y-6">
        <Card title="Safety" subtitle="Filtering + escalation" tone="warning">
          <Field
            label="Content filter"
            value={<Pill tone={filterTone[doc.safety.content_filter_strength] ?? 'slate'}>{doc.safety.content_filter_strength}</Pill>}
          />
          <Field
            label="Mandated reporter"
            value={<Pill tone={doc.safety.mandated_reporter_protocol ? 'green' : 'red'}>{doc.safety.mandated_reporter_protocol ? 'yes' : 'no'}</Pill>}
          />
          {doc.safety.human_in_loop_required.length > 0 && (
            <Field
              label="Escalates"
              value={
                <div className="flex flex-wrap gap-1.5">
                  {doc.safety.human_in_loop_required.map((c) => (
                    <Pill key={c} tone="amber">
                      {c}
                    </Pill>
                  ))}
                </div>
              }
            />
          )}
          <div className="mt-3 pt-3 border-t border-amber-500/30 grid grid-cols-2 gap-2 text-xs">
            {doc.safety.blocks_explicit_content !== undefined && (
              <span>
                Explicit: <Pill tone={doc.safety.blocks_explicit_content ? 'green' : 'red'}>{doc.safety.blocks_explicit_content ? 'blocked' : 'allowed'}</Pill>
              </span>
            )}
            {doc.safety.blocks_drug_alcohol_content !== undefined && (
              <span>
                Drugs / alc: <Pill tone={doc.safety.blocks_drug_alcohol_content ? 'green' : 'amber'}>{doc.safety.blocks_drug_alcohol_content ? 'blocked' : 'allowed'}</Pill>
              </span>
            )}
            {doc.safety.blocks_violence_content !== undefined && (
              <span>
                Violence: <Pill tone={doc.safety.blocks_violence_content ? 'green' : 'amber'}>{doc.safety.blocks_violence_content ? 'blocked' : 'allowed'}</Pill>
              </span>
            )}
            {doc.safety.blocks_political_advocacy !== undefined && (
              <span>
                Political: <Pill tone={doc.safety.blocks_political_advocacy ? 'green' : 'amber'}>{doc.safety.blocks_political_advocacy ? 'blocked' : 'allowed'}</Pill>
              </span>
            )}
          </div>
        </Card>

        <Card title="Data privacy" subtitle="FERPA / COPPA / GDPR" tone="authority">
          <div className="grid grid-cols-3 gap-3 mb-3">
            <ComplianceBadge label="FERPA" passing={doc.data_privacy.ferpa_compliant} />
            <ComplianceBadge label="COPPA" passing={doc.data_privacy.coppa_compliant} />
            <ComplianceBadge label="GDPR" passing={doc.data_privacy.gdpr_compliant} />
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400 text-xs uppercase tracking-widest">Retention</span>
              <span className="text-slate-100 code">{doc.data_privacy.retention_days} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 text-xs uppercase tracking-widest">Parents see</span>
              <Pill tone={shareTone[doc.data_privacy.data_sharing_with_parents] ?? 'slate'}>{doc.data_privacy.data_sharing_with_parents}</Pill>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 text-xs uppercase tracking-widest">School sees</span>
              <Pill tone={shareTone[doc.data_privacy.data_sharing_with_school] ?? 'slate'}>{doc.data_privacy.data_sharing_with_school}</Pill>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 text-xs uppercase tracking-widest">3rd-party share</span>
              <Pill tone={doc.data_privacy.third_party_data_sharing ? 'red' : 'green'}>{doc.data_privacy.third_party_data_sharing ? 'yes' : 'no'}</Pill>
            </div>
          </div>
        </Card>

        {doc.curriculum_alignment && doc.curriculum_alignment.length > 0 && (
          <Card title="Curriculum alignment" subtitle="Frameworks the tutor maps to">
            <ul className="space-y-2">
              {doc.curriculum_alignment.map((f) => (
                <li key={f.framework} className="text-sm">
                  <div className="font-medium text-slate-200">{f.framework}</div>
                  {f.version && <div className="text-xs text-slate-500 code">v{f.version}</div>}
                  {f.coverage_uri && (
                    <a className="text-xs text-blue-400 hover:underline code" href={f.coverage_uri} target="_blank" rel="noreferrer">
                      coverage map ↗
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {doc.agent_card_uri && (
          <Card title="Underlying agent">
            <Field
              label="Agent card"
              value={
                <a className="text-blue-400 hover:underline code text-xs break-all" href={doc.agent_card_uri} target="_blank" rel="noreferrer">
                  {doc.agent_card_uri}
                </a>
              }
            />
          </Card>
        )}

        {doc.evaluations && doc.evaluations.length > 0 && (
          <Card title="Evaluations" subtitle="Independent assessments">
            <ul className="space-y-1.5">
              {doc.evaluations.map((e) => (
                <li key={e.suite} className="text-sm">
                  <div className="font-medium text-slate-200">{e.suite}</div>
                  <div className="text-xs text-slate-500 code">{e.ran_at}</div>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </div>
  );
}

function ComplianceBadge({ label, passing }: { label: string; passing: boolean }) {
  return (
    <div
      className={`rounded-lg p-3 text-center ${passing ? 'bg-emerald-500/100/20 border border-emerald-500/40' : 'bg-red-500/100/20 border border-red-500/40'}`}
    >
      <div className="text-[9px] uppercase tracking-widest text-slate-400 code mb-1">{label}</div>
      <div className={`text-lg font-bold ${passing ? 'text-emerald-300' : 'text-red-300'}`}>
        {passing ? '✓' : '✗'}
      </div>
    </div>
  );
}
