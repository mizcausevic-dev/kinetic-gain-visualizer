import { Card, Field, Pill } from './common';

type StudentDisclosure = {
  disclosure_version: string;
  disclosure_id: string;
  created_at: string;
  student: {
    id: string;
    display_name?: string;
    grade_or_year?: string;
    institution_id?: string;
  };
  assignment: {
    id: string;
    title: string;
    course_id: string;
    lms?: string;
    due_at?: string;
  };
  ai_used: boolean;
  tools_used?: Array<{
    name: string;
    provider?: string;
    version?: string;
    agent_card_uri?: string;
    tutor_card_uri?: string;
  }>;
  roles?: string[];
  roles_other_text?: string;
  assistance_extent?: 'minor' | 'substantial' | 'primary_author';
  assistance_pct?: number;
  prompt_evidence_mode?: 'full' | 'hashed' | 'omitted';
  prompts?: Array<{
    id: string;
    text?: string;
    hash?: string;
    at?: string;
    tool_index?: number;
  }>;
  artifact_hash: string;
  artifact_uri?: string;
  aup_uri?: string;
  policy_compliant?: { declared: boolean; reason?: string };
  signed_by_student: boolean;
  student_signature_at: string;
  teacher_acknowledged?: {
    acknowledged: boolean;
    by: string;
    at: string;
    note?: string;
  };
};

function extentTone(extent?: string): 'green' | 'amber' | 'red' | 'slate' {
  if (extent === 'minor') return 'green';
  if (extent === 'substantial') return 'amber';
  if (extent === 'primary_author') return 'red';
  return 'slate';
}

function modeTone(mode?: string): 'green' | 'amber' | 'slate' {
  if (mode === 'full') return 'green';
  if (mode === 'hashed') return 'amber';
  return 'slate';
}

function policyStatus(doc: StudentDisclosure): {
  status: string;
  tone: 'green' | 'amber' | 'red' | 'slate';
} {
  if (!doc.aup_uri) return { status: 'no AUP referenced', tone: 'slate' };
  if (!doc.policy_compliant) return { status: 'AUP referenced — no declaration', tone: 'amber' };
  if (doc.policy_compliant.declared) return { status: 'declared compliant', tone: 'green' };
  return { status: 'declared non-compliant', tone: 'red' };
}

const ROLE_DESCRIPTIONS: Record<string, string> = {
  brainstorm: 'idea generation only',
  outline: 'structural planning',
  draft: 'initial draft content',
  edit: 'grammar / style cleanup of student prose',
  translate: 'language translation',
  cite_check: 'citation verification',
  code_completion: 'IDE / chat code completion',
  code_review: 'AI reviewed student code',
  research_synthesis: 'summary of sources',
  tutor_dialog: 'Socratic / step-by-step tutoring',
  image_generation: 'generated visual assets',
  data_analysis: 'exploratory data analysis',
  other: 'see roles_other_text',
};

export function DisclosureRenderer({ doc }: { doc: StudentDisclosure }) {
  const policy = policyStatus(doc);

  return (
    <div className="space-y-4">
      {/* Header card */}
      <Card title="Disclosure" subtitle={`v${doc.disclosure_version}`}>
        <Field label="Disclosure ID" value={<code className="code">{doc.disclosure_id}</code>} mono />
        <Field label="Created" value={doc.created_at} />
        <Field
          label="AI used"
          value={<Pill tone={doc.ai_used ? 'amber' : 'green'}>{doc.ai_used ? 'yes' : 'no'}</Pill>}
        />
        <Field
          label="Signed by student"
          value={
            <span className="flex items-center gap-2">
              <Pill tone={doc.signed_by_student ? 'green' : 'red'}>
                {doc.signed_by_student ? 'signed' : 'UNSIGNED'}
              </Pill>
              <span className="text-xs text-slate-500">{doc.student_signature_at}</span>
            </span>
          }
        />
      </Card>

      {/* Student + assignment */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Student" subtitle="LMS identity">
          <Field label="ID" value={<code className="code">{doc.student.id}</code>} mono />
          {doc.student.display_name && <Field label="Display name" value={doc.student.display_name} />}
          {doc.student.grade_or_year && <Field label="Grade / year" value={doc.student.grade_or_year} />}
          {doc.student.institution_id && (
            <Field label="Institution" value={<code className="code">{doc.student.institution_id}</code>} mono />
          )}
        </Card>
        <Card title="Assignment" subtitle="LMS context">
          <Field label="Title" value={doc.assignment.title} />
          <Field label="Assignment ID" value={<code className="code">{doc.assignment.id}</code>} mono />
          <Field label="Course" value={<code className="code">{doc.assignment.course_id}</code>} mono />
          {doc.assignment.lms && (
            <Field label="LMS" value={<Pill tone="blue">{doc.assignment.lms}</Pill>} />
          )}
          {doc.assignment.due_at && <Field label="Due" value={doc.assignment.due_at} />}
        </Card>
      </div>

      {/* AI usage — only when ai_used */}
      {doc.ai_used && (
        <Card title="AI usage" subtitle="What was used and how">
          <Field
            label="Assistance extent"
            value={
              <span className="flex items-center gap-2">
                <Pill tone={extentTone(doc.assistance_extent)}>{doc.assistance_extent}</Pill>
                {doc.assistance_pct !== undefined && (
                  <span className="text-xs text-slate-400 code">~{doc.assistance_pct}% AI-originated</span>
                )}
              </span>
            }
          />
          <Field
            label="Roles"
            value={
              <div className="flex flex-wrap gap-1.5">
                {(doc.roles ?? []).map((r) => (
                  <span key={r} className="inline-flex items-center gap-1">
                    <Pill tone="violet">{r}</Pill>
                    <span className="text-[10px] text-slate-500">{ROLE_DESCRIPTIONS[r] ?? ''}</span>
                  </span>
                ))}
              </div>
            }
          />
          {doc.roles?.includes('other') && doc.roles_other_text && (
            <Field label="Other role" value={<em>{doc.roles_other_text}</em>} />
          )}
          <Field
            label="Tools used"
            value={
              <div className="space-y-1.5">
                {(doc.tools_used ?? []).map((t, i) => (
                  <div key={i} className="text-sm">
                    <span className="font-semibold">{t.name}</span>
                    {t.provider && <span className="text-slate-500"> · {t.provider}</span>}
                    {t.version && <span className="code text-xs text-slate-500"> ({t.version})</span>}
                    {(t.agent_card_uri || t.tutor_card_uri) && (
                      <div className="ml-3 mt-0.5 text-xs space-y-0.5">
                        {t.agent_card_uri && (
                          <a
                            href={t.agent_card_uri}
                            target="_blank"
                            rel="noreferrer"
                            className="block text-blue-400 hover:underline code break-all"
                          >
                            ↗ Agent Card · {t.agent_card_uri}
                          </a>
                        )}
                        {t.tutor_card_uri && (
                          <a
                            href={t.tutor_card_uri}
                            target="_blank"
                            rel="noreferrer"
                            className="block text-blue-400 hover:underline code break-all"
                          >
                            ↗ Tutor Card · {t.tutor_card_uri}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            }
          />
        </Card>
      )}

      {/* Prompt evidence — only when ai_used */}
      {doc.ai_used && doc.prompt_evidence_mode && (
        <Card title="Prompt evidence" subtitle="What was asked of the AI">
          <Field
            label="Mode"
            value={
              <span className="flex items-center gap-2">
                <Pill tone={modeTone(doc.prompt_evidence_mode)}>{doc.prompt_evidence_mode}</Pill>
                <span className="text-xs text-slate-500">
                  {doc.prompt_evidence_mode === 'full' && 'literal prompt text preserved'}
                  {doc.prompt_evidence_mode === 'hashed' && 'canonical SHA-256 only (privacy-preserving)'}
                  {doc.prompt_evidence_mode === 'omitted' && 'consciously not retained'}
                </span>
              </span>
            }
          />
          {doc.prompts && doc.prompts.length > 0 && (
            <div className="mt-2 space-y-2">
              {doc.prompts.map((p) => (
                <div
                  key={p.id}
                  className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs"
                >
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-semibold code text-white">{p.id}</span>
                    {p.at && <span className="text-slate-500">{p.at}</span>}
                    {p.tool_index !== undefined && (
                      <span className="text-slate-500">→ tool[{p.tool_index}]</span>
                    )}
                  </div>
                  {p.text && (
                    <div className="text-slate-300 italic whitespace-pre-wrap leading-relaxed">
                      "{p.text}"
                    </div>
                  )}
                  {p.hash && (
                    <div className="code text-[11px] text-slate-400 break-all">{p.hash}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Artifact binding — dark/authority */}
      <Card title="Artifact binding" subtitle="SHA-256 ties disclosure to a specific submission" tone="authority">
        <Field
          label="Artifact hash"
          value={<span className="code text-slate-300 break-all">{doc.artifact_hash}</span>}
          mono
        />
        {doc.artifact_uri && (
          <Field
            label="Artifact URI"
            value={
              <a
                href={doc.artifact_uri}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:underline code break-all"
              >
                {doc.artifact_uri}
              </a>
            }
            mono
          />
        )}
      </Card>

      {/* Policy posture */}
      <Card title="Policy posture" subtitle="Against the operative AUP" tone={policy.tone === 'red' ? 'warning' : 'default'}>
        <Field label="Status" value={<Pill tone={policy.tone}>{policy.status}</Pill>} />
        {doc.aup_uri && (
          <Field
            label="AUP URI"
            value={
              <a
                href={doc.aup_uri}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:underline code break-all"
              >
                {doc.aup_uri}
              </a>
            }
            mono
          />
        )}
        {doc.policy_compliant?.reason && (
          <Field label="Reason" value={<em>{doc.policy_compliant.reason}</em>} />
        )}
      </Card>

      {/* Teacher acknowledgment */}
      {doc.teacher_acknowledged && (
        <Card title="Teacher acknowledgment" subtitle="Grader review">
          <Field
            label="Acknowledged"
            value={
              <Pill tone={doc.teacher_acknowledged.acknowledged ? 'green' : 'slate'}>
                {doc.teacher_acknowledged.acknowledged ? 'reviewed' : 'pending'}
              </Pill>
            }
          />
          <Field label="By" value={<code className="code">{doc.teacher_acknowledged.by}</code>} mono />
          <Field label="At" value={doc.teacher_acknowledged.at} />
          {doc.teacher_acknowledged.note && (
            <Field label="Note" value={<em>{doc.teacher_acknowledged.note}</em>} />
          )}
        </Card>
      )}
    </div>
  );
}
