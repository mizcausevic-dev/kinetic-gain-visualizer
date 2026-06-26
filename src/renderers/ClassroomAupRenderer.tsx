import { Card, Field, Pill } from './common';

type ClassroomAup = {
  aup_version: string;
  policy_id: string;
  policy_name: string;
  version: string;
  effective_at: string;
  expires_at?: string;
  replaces?: string;
  scope: {
    type: 'district' | 'school' | 'course' | 'assignment';
    institution_id: string;
    grade_bands?: string[];
    course_ids?: string[];
    assignment_ids?: string[];
    parent_policy_uri?: string;
  };
  permitted_use: {
    permitted_roles: string[];
    permitted_tool_categories?: string[];
    permitted_tools?: Array<{
      name: string;
      agent_card_uri?: string;
      tutor_card_uri?: string;
      notes?: string;
    }>;
    assistance_extent_max: 'none' | 'minor' | 'substantial' | 'primary_author';
  };
  prohibited_use?: {
    prohibited_roles?: string[];
    prohibited_uses?: string[];
  };
  disclosure_requirements: {
    required_when: 'always' | 'when_used' | 'never';
    required_prompt_evidence_mode?: 'full' | 'hashed' | 'omitted' | 'any';
    signature_required: boolean;
    teacher_acknowledgment_required?: boolean;
    artifact_hash_required?: boolean;
  };
  supervision?: {
    level: 'unsupervised' | 'teacher_visible' | 'teacher_approved' | 'proctored';
    human_in_loop_categories?: string[];
  };
  vendor_requirements?: {
    requires_tutor_card?: boolean;
    requires_agent_card?: boolean;
    required_compliance?: Array<'ferpa' | 'coppa' | 'gdpr' | 'state-specific'>;
    state_specific_laws?: string[];
    required_content_filter_strength_min?: 'strict' | 'moderate' | 'light';
    requires_mandated_reporter_protocol?: boolean;
    requires_human_in_loop_for?: string[];
    retention_days_max?: number;
    prohibits_third_party_data_sharing?: boolean;
    prohibits_model_training_on_student_data?: boolean;
  };
  parent_notification?: {
    notification_level: 'none' | 'at_enrollment' | 'per_assignment' | 'per_use';
    parent_consent_required: boolean;
    consent_age_threshold?: number;
  };
  enforcement?: {
    violation_response?: string[];
    appeals_process_uri?: string;
  };
  published_by: { name: string; role?: string; contact_uri?: string };
  published_at: string;
  audit_log_uri?: string;
};

function extentTone(extent: string): 'green' | 'amber' | 'red' | 'slate' {
  if (extent === 'none') return 'red';
  if (extent === 'minor') return 'green';
  if (extent === 'substantial') return 'amber';
  if (extent === 'primary_author') return 'red';
  return 'slate';
}

function supervisionTone(level?: string): 'green' | 'amber' | 'red' | 'slate' {
  if (level === 'unsupervised') return 'amber';
  if (level === 'teacher_visible') return 'green';
  if (level === 'teacher_approved') return 'green';
  if (level === 'proctored') return 'red';
  return 'slate';
}

function disclosureToneAndLabel(when: string): {
  tone: 'green' | 'amber' | 'red' | 'slate';
  label: string;
} {
  if (when === 'always') return { tone: 'red', label: 'always required' };
  if (when === 'when_used') return { tone: 'amber', label: 'required when AI is used' };
  if (when === 'never') return { tone: 'slate', label: 'not required' };
  return { tone: 'slate', label: when };
}

export function ClassroomAupRenderer({ doc }: { doc: ClassroomAup }) {
  const dr = doc.disclosure_requirements;
  const disclosureLabel = disclosureToneAndLabel(dr.required_when);
  const isProctoredNoAI =
    doc.permitted_use.assistance_extent_max === 'none' &&
    doc.permitted_use.permitted_roles.length === 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card title={doc.policy_name} subtitle={`v${doc.aup_version} · policy version ${doc.version}`}>
        <Field label="Policy ID" value={<code className="code">{doc.policy_id}</code>} mono />
        <Field label="Scope" value={<Pill tone="violet">{doc.scope.type}</Pill>} />
        <Field
          label="Institution"
          value={<code className="code">{doc.scope.institution_id}</code>}
          mono
        />
        <Field label="Effective" value={doc.effective_at} />
        {doc.expires_at && <Field label="Expires" value={doc.expires_at} />}
        {doc.scope.parent_policy_uri && (
          <Field
            label="Refines"
            value={
              <a
                href={doc.scope.parent_policy_uri}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:underline code break-all"
              >
                ↗ {doc.scope.parent_policy_uri}
              </a>
            }
            mono
          />
        )}
      </Card>

      {/* Proctored no-AI warning banner */}
      {isProctoredNoAI && (
        <Card title="🚫 No AI use permitted" subtitle="assistance_extent_max=none" tone="warning">
          <p className="text-sm text-amber-200">
            This policy declares zero permitted AI use. Any submission with{' '}
            <code className="code">ai_used=true</code> will fail compliance check.
          </p>
        </Card>
      )}

      {/* Scope details */}
      <Card title="Scope" subtitle="Who this policy applies to">
        {doc.scope.grade_bands && doc.scope.grade_bands.length > 0 && (
          <Field
            label="Grade bands"
            value={
              <div className="flex flex-wrap gap-1.5">
                {doc.scope.grade_bands.map((g) => (
                  <Pill key={g} tone="blue">
                    {g}
                  </Pill>
                ))}
              </div>
            }
          />
        )}
        {doc.scope.course_ids && doc.scope.course_ids.length > 0 && (
          <Field
            label="Course IDs"
            value={
              <div className="flex flex-wrap gap-1.5">
                {doc.scope.course_ids.map((c) => (
                  <code key={c} className="code text-xs px-2 py-0.5 bg-slate-800 rounded">
                    {c}
                  </code>
                ))}
              </div>
            }
          />
        )}
        {doc.scope.assignment_ids && doc.scope.assignment_ids.length > 0 && (
          <Field
            label="Assignment IDs"
            value={
              <div className="flex flex-wrap gap-1.5">
                {doc.scope.assignment_ids.map((a) => (
                  <code key={a} className="code text-xs px-2 py-0.5 bg-slate-800 rounded">
                    {a}
                  </code>
                ))}
              </div>
            }
          />
        )}
      </Card>

      {/* Permitted use */}
      <Card title="Permitted use" subtitle="What AI use is allowed">
        <Field
          label="Assistance extent ceiling"
          value={
            <Pill tone={extentTone(doc.permitted_use.assistance_extent_max)}>
              max: {doc.permitted_use.assistance_extent_max}
            </Pill>
          }
        />
        <Field
          label="Permitted roles"
          value={
            doc.permitted_use.permitted_roles.length === 0 ? (
              <span className="text-red-300 italic text-sm">none, zero AI use permitted</span>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {doc.permitted_use.permitted_roles.map((r) => (
                  <Pill key={r} tone="green">
                    {r}
                  </Pill>
                ))}
              </div>
            )
          }
        />
        {doc.permitted_use.permitted_tool_categories && (
          <Field
            label="Tool categories"
            value={
              <div className="flex flex-wrap gap-1.5">
                {doc.permitted_use.permitted_tool_categories.map((c) => (
                  <Pill key={c} tone="blue">
                    {c}
                  </Pill>
                ))}
              </div>
            }
          />
        )}
        {doc.permitted_use.permitted_tools && doc.permitted_use.permitted_tools.length > 0 && (
          <Field
            label="Allow-listed tools"
            value={
              <div className="space-y-2">
                {doc.permitted_use.permitted_tools.map((t, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs"
                  >
                    <div className="font-semibold text-white">{t.name}</div>
                    {t.notes && <div className="text-slate-400 italic mt-0.5">{t.notes}</div>}
                    {t.tutor_card_uri && (
                      <a
                        href={t.tutor_card_uri}
                        target="_blank"
                        rel="noreferrer"
                        className="block text-blue-400 hover:underline code break-all mt-1"
                      >
                        ↗ Tutor Card · {t.tutor_card_uri}
                      </a>
                    )}
                    {t.agent_card_uri && (
                      <a
                        href={t.agent_card_uri}
                        target="_blank"
                        rel="noreferrer"
                        className="block text-blue-400 hover:underline code break-all mt-1"
                      >
                        ↗ Agent Card · {t.agent_card_uri}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            }
          />
        )}
      </Card>

      {/* Prohibited use */}
      {doc.prohibited_use &&
        ((doc.prohibited_use.prohibited_roles && doc.prohibited_use.prohibited_roles.length > 0) ||
          (doc.prohibited_use.prohibited_uses && doc.prohibited_use.prohibited_uses.length > 0)) && (
          <Card title="Prohibited use" subtitle="Explicit deny list" tone="warning">
            {doc.prohibited_use.prohibited_roles &&
              doc.prohibited_use.prohibited_roles.length > 0 && (
                <Field
                  label="Prohibited roles"
                  value={
                    <div className="flex flex-wrap gap-1.5">
                      {doc.prohibited_use.prohibited_roles.map((r) => (
                        <Pill key={r} tone="red">
                          {r}
                        </Pill>
                      ))}
                    </div>
                  }
                />
              )}
            {doc.prohibited_use.prohibited_uses &&
              doc.prohibited_use.prohibited_uses.length > 0 && (
                <Field
                  label="Prohibitions"
                  value={
                    <ul className="space-y-1 text-sm text-slate-300">
                      {doc.prohibited_use.prohibited_uses.map((u, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-red-400">✕</span>
                          <span>{u}</span>
                        </li>
                      ))}
                    </ul>
                  }
                />
              )}
          </Card>
        )}

      {/* Disclosure requirements */}
      <Card title="Disclosure requirements" subtitle="What every submission must carry">
        <Field
          label="Required"
          value={<Pill tone={disclosureLabel.tone}>{disclosureLabel.label}</Pill>}
        />
        {dr.required_prompt_evidence_mode && (
          <Field
            label="Prompt evidence mode"
            value={
              <Pill tone={dr.required_prompt_evidence_mode === 'any' ? 'slate' : 'amber'}>
                {dr.required_prompt_evidence_mode}
              </Pill>
            }
          />
        )}
        <Field
          label="Signature"
          value={
            <Pill tone={dr.signature_required ? 'red' : 'slate'}>
              {dr.signature_required ? 'required' : 'optional'}
            </Pill>
          }
        />
        <Field
          label="Teacher ack"
          value={
            <Pill tone={dr.teacher_acknowledgment_required ? 'red' : 'slate'}>
              {dr.teacher_acknowledgment_required ? 'required' : 'optional'}
            </Pill>
          }
        />
        <Field
          label="Artifact hash"
          value={
            <Pill tone={dr.artifact_hash_required !== false ? 'red' : 'slate'}>
              {dr.artifact_hash_required !== false ? 'required (binds disclosure to file)' : 'optional'}
            </Pill>
          }
        />
      </Card>

      {/* Supervision */}
      {doc.supervision && (
        <Card title="Supervision" subtitle="Human-in-loop posture">
          <Field
            label="Level"
            value={<Pill tone={supervisionTone(doc.supervision.level)}>{doc.supervision.level}</Pill>}
          />
          {doc.supervision.human_in_loop_categories &&
            doc.supervision.human_in_loop_categories.length > 0 && (
              <Field
                label="Escalate to human"
                value={
                  <div className="flex flex-wrap gap-1.5">
                    {doc.supervision.human_in_loop_categories.map((c) => (
                      <Pill key={c} tone="amber">
                        {c}
                      </Pill>
                    ))}
                  </div>
                }
              />
            )}
        </Card>
      )}

      {/* Vendor requirements — the procurement weapon */}
      {doc.vendor_requirements && (
        <Card
          title="Vendor requirements"
          subtitle="The procurement weapon, joins against vendor Tutor / Agent Cards"
          tone="authority"
        >
          {doc.vendor_requirements.requires_tutor_card !== undefined && (
            <Field
              label="Tutor Card"
              value={
                <Pill tone={doc.vendor_requirements.requires_tutor_card ? 'red' : 'slate'}>
                  {doc.vendor_requirements.requires_tutor_card ? 'required' : 'optional'}
                </Pill>
              }
            />
          )}
          {doc.vendor_requirements.required_compliance &&
            doc.vendor_requirements.required_compliance.length > 0 && (
              <Field
                label="Compliance"
                value={
                  <div className="flex flex-wrap gap-1.5">
                    {doc.vendor_requirements.required_compliance.map((c) => (
                      <Pill key={c} tone="red">
                        {c.toUpperCase()}
                      </Pill>
                    ))}
                  </div>
                }
              />
            )}
          {doc.vendor_requirements.state_specific_laws &&
            doc.vendor_requirements.state_specific_laws.length > 0 && (
              <Field
                label="State laws"
                value={
                  <div className="flex flex-wrap gap-1.5">
                    {doc.vendor_requirements.state_specific_laws.map((l) => (
                      <code
                        key={l}
                        className="code text-xs px-2 py-0.5 bg-slate-800 text-slate-200 rounded"
                      >
                        {l}
                      </code>
                    ))}
                  </div>
                }
              />
            )}
          {doc.vendor_requirements.required_content_filter_strength_min && (
            <Field
              label="Content filter ≥"
              value={
                <Pill tone="red">
                  {doc.vendor_requirements.required_content_filter_strength_min}
                </Pill>
              }
            />
          )}
          {doc.vendor_requirements.retention_days_max !== undefined && (
            <Field
              label="Retention ≤"
              value={
                <span className="code text-slate-300">
                  {doc.vendor_requirements.retention_days_max} days
                </span>
              }
              mono
            />
          )}
          {doc.vendor_requirements.requires_mandated_reporter_protocol && (
            <Field
              label="Mandated reporter"
              value={<Pill tone="red">protocol required</Pill>}
            />
          )}
          {doc.vendor_requirements.prohibits_third_party_data_sharing && (
            <Field
              label="3rd-party sharing"
              value={<Pill tone="red">prohibited</Pill>}
            />
          )}
          {doc.vendor_requirements.prohibits_model_training_on_student_data && (
            <Field
              label="Model training"
              value={<Pill tone="red">no student data</Pill>}
            />
          )}
        </Card>
      )}

      {/* Parent notification */}
      {doc.parent_notification && (
        <Card title="Parent notification" subtitle="COPPA gating">
          <Field
            label="Notification"
            value={<Pill tone="blue">{doc.parent_notification.notification_level}</Pill>}
          />
          <Field
            label="Consent"
            value={
              <Pill tone={doc.parent_notification.parent_consent_required ? 'red' : 'slate'}>
                {doc.parent_notification.parent_consent_required ? 'required' : 'not required'}
              </Pill>
            }
          />
          {doc.parent_notification.consent_age_threshold !== undefined && (
            <Field
              label="Age threshold"
              value={
                <span className="code">
                  &lt; {doc.parent_notification.consent_age_threshold} years
                </span>
              }
              mono
            />
          )}
        </Card>
      )}

      {/* Enforcement */}
      {doc.enforcement && doc.enforcement.violation_response && (
        <Card title="Enforcement" subtitle="What happens on violation">
          <ol className="space-y-1 text-sm text-slate-300 list-decimal list-inside">
            {doc.enforcement.violation_response.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ol>
          {doc.enforcement.appeals_process_uri && (
            <div className="mt-3">
              <Field
                label="Appeals"
                value={
                  <a
                    href={doc.enforcement.appeals_process_uri}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:underline code break-all"
                  >
                    {doc.enforcement.appeals_process_uri}
                  </a>
                }
                mono
              />
            </div>
          )}
        </Card>
      )}

      {/* Publisher */}
      <Card title="Published by" subtitle="Authority + audit trail">
        <Field label="Name" value={doc.published_by.name} />
        {doc.published_by.role && <Field label="Role" value={doc.published_by.role} />}
        {doc.published_by.contact_uri && (
          <Field
            label="Contact"
            value={
              <a
                href={doc.published_by.contact_uri}
                className="text-blue-400 hover:underline code break-all"
              >
                {doc.published_by.contact_uri}
              </a>
            }
            mono
          />
        )}
        <Field label="Published at" value={doc.published_at} />
        {doc.audit_log_uri && (
          <Field
            label="Audit log"
            value={
              <a
                href={doc.audit_log_uri}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:underline code break-all"
              >
                ↗ {doc.audit_log_uri}
              </a>
            }
            mono
          />
        )}
      </Card>
    </div>
  );
}
