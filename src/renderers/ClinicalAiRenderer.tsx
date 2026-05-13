import { Card, Field, Pill } from './common';

type ClinicalAiCard = {
  clinical_ai_card_version: string;
  system: { id: string; name: string; version: string; provider: string; description?: string; homepage?: string };
  clinical_context: {
    indication: string;
    care_settings: string[];
    patient_population: { age_range_min: number; age_range_max: number; exclusions?: string[] };
    intended_use: string;
    off_label_uses_prohibited: boolean;
  };
  regulatory: {
    fda_status: string;
    fda_clearance_number?: string;
    fda_clearance_uri?: string;
    iso_certifications?: string[];
    is_medical_device: boolean;
    is_clinical_decision_support: boolean;
    is_software_as_medical_device: boolean;
    samd_class?: string;
    samd_classification_rationale?: string;
    regional_authorizations?: Array<{ region: string; status: string; identifier?: string; uri?: string }>;
    notes?: string;
  };
  clinical_role: {
    decision_support_level: 'informational' | 'advisory' | 'autonomous';
    clinician_override_required: boolean;
    patient_facing_only: boolean;
    transparency_to_patient_required: boolean;
    pre_authorization_use?: boolean;
  };
  evidence: {
    validation_studies: Array<{
      title: string; uri: string; population_size: number;
      primary_outcome: string; results_summary: string; peer_reviewed: boolean;
      published_at?: string;
    }>;
    training_data_sources: string[];
    bias_audit_uri?: string;
    performance_metrics: {
      measurement_population: string;
      sensitivity?: number; specificity?: number; auc?: number; accuracy?: number;
      false_positive_rate?: number; false_negative_rate?: number;
      precision?: number; recall?: number; f1?: number; ppv?: number; npv?: number;
    };
  };
  patient_data: {
    phi_processed: boolean; hipaa_compliant?: boolean; baa_required?: boolean;
    de_identification_method?: string;
    retention_days: number;
    patient_consent_required: boolean;
    consent_flow_uri?: string;
    third_party_data_sharing: boolean;
    model_training_consent_required?: boolean;
  };
  safety: {
    human_in_loop_required_for: string[];
    escalation_protocols?: string[];
    mandatory_reporting_categories: string[];
    blocks_diagnostic_claims?: boolean;
    treatment_recommendation_disclaimer_required?: boolean;
  };
  ehr_integration?: {
    fhir_version?: string;
    supports_smart_on_fhir?: boolean;
    supports_cds_hooks?: boolean;
    ehr_vendors_supported?: string[];
  };
  agent_card_uri?: string;
  evaluations?: Array<{ suite: string; result_uri: string; ran_at: string; accreditation_body?: string; metrics?: Record<string, unknown> }>;
  audit?: { audit_log_uri?: string; incident_response_uri?: string; incident_card_index_uri?: string; disclosure_uri?: string };
};

function fdaTone(status: string): 'green' | 'amber' | 'red' | 'slate' {
  if (status === '510k_cleared' || status === 'de_novo' || status === 'pma') return 'green';
  if (status === 'enforcement_discretion') return 'amber';
  if (status === 'research_use_only') return 'amber';
  return 'slate';
}

function autonomyTone(level: string): 'green' | 'amber' | 'red' {
  if (level === 'informational') return 'green';
  if (level === 'advisory') return 'amber';
  return 'red'; // autonomous
}

function metric(label: string, value: number | undefined) {
  if (value === undefined) return null;
  return (
    <Field
      label={label}
      value={<span className="code text-slate-800">{(value * 100).toFixed(1)}%</span>}
    />
  );
}

export function ClinicalAiRenderer({ doc }: { doc: ClinicalAiCard }) {
  const reg = doc.regulatory;
  const role = doc.clinical_role;
  const pd = doc.patient_data;
  const phiPosture =
    pd.phi_processed
      ? pd.hipaa_compliant
        ? 'HIPAA-attested · BAA ' + (pd.baa_required ? 'required' : 'not required')
        : 'PHI processed BUT not HIPAA-attested'
      : 'No PHI processed';
  const biasAuditTriggered =
    reg.samd_class && ['II', 'III', 'IV'].includes(reg.samd_class) ||
    role.decision_support_level === 'autonomous' ||
    role.pre_authorization_use === true;

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card title={doc.system.name} subtitle={`v${doc.clinical_ai_card_version} · system version ${doc.system.version}`}>
        <Field label="System ID" value={<code className="code">{doc.system.id}</code>} mono />
        <Field label="Provider" value={doc.system.provider} />
        {doc.system.description && (
          <Field label="Description" value={<em className="text-slate-700">{doc.system.description}</em>} />
        )}
        <Field
          label="FDA status"
          value={
            <span className="flex items-center gap-2 flex-wrap">
              <Pill tone={fdaTone(reg.fda_status)}>{reg.fda_status}</Pill>
              {reg.fda_clearance_number && (
                <span className="code text-xs text-slate-700">{reg.fda_clearance_number}</span>
              )}
              {reg.fda_clearance_uri && (
                <a
                  href={reg.fda_clearance_uri}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline text-xs"
                >
                  view FDA record ↗
                </a>
              )}
            </span>
          }
        />
        {reg.samd_class && (
          <Field
            label="SaMD class"
            value={
              <span className="flex items-center gap-2">
                <Pill tone="violet">Class {reg.samd_class}</Pill>
                {reg.samd_classification_rationale && (
                  <span className="text-xs text-slate-600 italic">{reg.samd_classification_rationale}</span>
                )}
              </span>
            }
          />
        )}
        {reg.iso_certifications && reg.iso_certifications.length > 0 && (
          <Field
            label="ISO certifications"
            value={
              <div className="flex flex-wrap gap-1.5">
                {reg.iso_certifications.map((c) => (
                  <Pill key={c} tone="blue">{c}</Pill>
                ))}
              </div>
            }
          />
        )}
      </Card>

      {/* Autonomy → device callout (always shown, alerts if mismatched) */}
      {role.decision_support_level === 'autonomous' && !reg.is_medical_device && (
        <Card title="⚠ Schema rule violation" subtitle="autonomy ⇔ medical device" tone="warning">
          <p className="text-sm text-amber-900">
            <code className="code">decision_support_level=autonomous</code> requires{' '}
            <code className="code">is_medical_device=true</code>. Per FDA position, autonomous clinical AI is, by definition, a medical device.
          </p>
        </Card>
      )}

      {/* Clinical context */}
      <Card title="Clinical context" subtitle="What it's for, who it's for">
        <Field label="Indication" value={doc.clinical_context.indication} />
        <Field
          label="Care settings"
          value={
            <div className="flex flex-wrap gap-1.5">
              {doc.clinical_context.care_settings.map((s) => (
                <Pill key={s} tone="blue">{s}</Pill>
              ))}
            </div>
          }
        />
        <Field
          label="Patient population"
          value={
            <span>
              ages {doc.clinical_context.patient_population.age_range_min}–
              {doc.clinical_context.patient_population.age_range_max}
            </span>
          }
        />
        {doc.clinical_context.patient_population.exclusions &&
          doc.clinical_context.patient_population.exclusions.length > 0 && (
            <Field
              label="Exclusions"
              value={
                <div className="flex flex-wrap gap-1.5">
                  {doc.clinical_context.patient_population.exclusions.map((e) => (
                    <Pill key={e} tone="red">{e}</Pill>
                  ))}
                </div>
              }
            />
          )}
        <Field label="Intended use" value={<em className="text-slate-700">{doc.clinical_context.intended_use}</em>} />
        <Field
          label="Off-label use"
          value={
            <Pill tone={doc.clinical_context.off_label_uses_prohibited ? 'red' : 'amber'}>
              {doc.clinical_context.off_label_uses_prohibited ? 'prohibited' : 'permitted'}
            </Pill>
          }
        />
      </Card>

      {/* Clinical role */}
      <Card title="Clinical role" subtitle="Decision-support posture">
        <Field
          label="Decision support level"
          value={<Pill tone={autonomyTone(role.decision_support_level)}>{role.decision_support_level}</Pill>}
        />
        <Field
          label="Clinician override"
          value={<Pill tone={role.clinician_override_required ? 'green' : 'red'}>{role.clinician_override_required ? 'required' : 'not required'}</Pill>}
        />
        <Field
          label="Patient-facing only"
          value={<Pill tone={role.patient_facing_only ? 'amber' : 'slate'}>{role.patient_facing_only ? 'yes' : 'no'}</Pill>}
        />
        <Field
          label="Transparency to patient"
          value={<Pill tone={role.transparency_to_patient_required ? 'green' : 'slate'}>{role.transparency_to_patient_required ? 'required' : 'not required'}</Pill>}
        />
        {role.pre_authorization_use !== undefined && (
          <Field
            label="Pre-authorization use"
            value={<Pill tone={role.pre_authorization_use ? 'amber' : 'slate'}>{role.pre_authorization_use ? 'yes' : 'no'}</Pill>}
          />
        )}
      </Card>

      {/* Evidence */}
      <Card title="Evidence" subtitle={`${doc.evidence.validation_studies.length} validation ${doc.evidence.validation_studies.length === 1 ? 'study' : 'studies'}`}>
        {doc.evidence.validation_studies.map((s, i) => (
          <div key={i} className="border-l-2 border-slate-200 pl-3 mb-3">
            <div className="font-semibold text-sm text-slate-900">{s.title}</div>
            <div className="text-xs text-slate-600 mt-1">
              N = {s.population_size.toLocaleString()} ·{' '}
              {s.peer_reviewed ? (
                <Pill tone="green">peer-reviewed</Pill>
              ) : (
                <Pill tone="amber">not peer-reviewed</Pill>
              )}
            </div>
            <div className="text-xs text-slate-700 mt-1">
              <strong>Primary outcome:</strong> {s.primary_outcome}
            </div>
            <div className="text-xs text-slate-700 mt-1">
              <strong>Results:</strong> {s.results_summary}
            </div>
            {s.uri && (
              <a href={s.uri} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-xs">
                view study ↗
              </a>
            )}
          </div>
        ))}
        <Field
          label="Training data"
          value={
            <div className="flex flex-wrap gap-1.5">
              {doc.evidence.training_data_sources.map((src) => (
                <Pill key={src} tone="slate">{src}</Pill>
              ))}
            </div>
          }
        />
        <Field
          label="Bias audit"
          value={
            doc.evidence.bias_audit_uri ? (
              <a
                href={doc.evidence.bias_audit_uri}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline code break-all"
              >
                ↗ {doc.evidence.bias_audit_uri}
              </a>
            ) : biasAuditTriggered ? (
              <Pill tone="red">REQUIRED but missing</Pill>
            ) : (
              <Pill tone="slate">not required at this class</Pill>
            )
          }
        />
      </Card>

      {/* Performance metrics */}
      <Card title="Performance metrics" subtitle={doc.evidence.performance_metrics.measurement_population}>
        {metric('Sensitivity', doc.evidence.performance_metrics.sensitivity)}
        {metric('Specificity', doc.evidence.performance_metrics.specificity)}
        {metric('AUC', doc.evidence.performance_metrics.auc)}
        {metric('Accuracy', doc.evidence.performance_metrics.accuracy)}
        {metric('False-positive rate', doc.evidence.performance_metrics.false_positive_rate)}
        {metric('False-negative rate', doc.evidence.performance_metrics.false_negative_rate)}
        {metric('Precision', doc.evidence.performance_metrics.precision)}
        {metric('Recall', doc.evidence.performance_metrics.recall)}
        {metric('F1', doc.evidence.performance_metrics.f1)}
        {metric('PPV', doc.evidence.performance_metrics.ppv)}
        {metric('NPV', doc.evidence.performance_metrics.npv)}
      </Card>

      {/* Patient data posture — authority tone */}
      <Card title="Patient-data posture" subtitle={phiPosture} tone="authority">
        <Field
          label="PHI processed"
          value={<Pill tone={pd.phi_processed ? 'red' : 'green'}>{pd.phi_processed ? 'yes' : 'no'}</Pill>}
        />
        {pd.hipaa_compliant !== undefined && (
          <Field
            label="HIPAA"
            value={<Pill tone={pd.hipaa_compliant ? 'green' : 'red'}>{pd.hipaa_compliant ? 'compliant' : 'NOT compliant'}</Pill>}
          />
        )}
        {pd.baa_required !== undefined && (
          <Field
            label="BAA"
            value={<Pill tone={pd.baa_required ? 'amber' : 'slate'}>{pd.baa_required ? 'required' : 'not required'}</Pill>}
          />
        )}
        {pd.de_identification_method && (
          <Field
            label="De-identification"
            value={<Pill tone="blue">{pd.de_identification_method}</Pill>}
          />
        )}
        <Field
          label="Retention"
          value={<span className="code text-slate-300">{pd.retention_days} days</span>}
          mono
        />
        <Field
          label="Patient consent"
          value={<Pill tone={pd.patient_consent_required ? 'amber' : 'slate'}>{pd.patient_consent_required ? 'required' : 'not required'}</Pill>}
        />
        <Field
          label="3rd-party sharing"
          value={<Pill tone={pd.third_party_data_sharing ? 'red' : 'green'}>{pd.third_party_data_sharing ? 'YES' : 'no'}</Pill>}
        />
      </Card>

      {/* Safety */}
      <Card title="Safety + mandated reporting" subtitle="Human-in-loop + escalation">
        {doc.safety.human_in_loop_required_for.length > 0 && (
          <Field
            label="Human-in-loop"
            value={
              <div className="flex flex-wrap gap-1.5">
                {doc.safety.human_in_loop_required_for.map((c) => (
                  <Pill key={c} tone="amber">{c}</Pill>
                ))}
              </div>
            }
          />
        )}
        {doc.safety.mandatory_reporting_categories.length > 0 && (
          <Field
            label="Mandatory reporting"
            value={
              <div className="flex flex-wrap gap-1.5">
                {doc.safety.mandatory_reporting_categories.map((c) => (
                  <Pill key={c} tone="red">{c}</Pill>
                ))}
              </div>
            }
          />
        )}
        {doc.safety.blocks_diagnostic_claims !== undefined && (
          <Field
            label="Blocks diagnostic claims"
            value={<Pill tone={doc.safety.blocks_diagnostic_claims ? 'green' : 'red'}>{doc.safety.blocks_diagnostic_claims ? 'yes' : 'no'}</Pill>}
          />
        )}
      </Card>

      {/* EHR integration */}
      {doc.ehr_integration && (
        <Card title="EHR integration" subtitle="FHIR / SMART / CDS Hooks">
          {doc.ehr_integration.fhir_version && (
            <Field label="FHIR version" value={<Pill tone="blue">{doc.ehr_integration.fhir_version}</Pill>} />
          )}
          {doc.ehr_integration.supports_smart_on_fhir !== undefined && (
            <Field
              label="SMART on FHIR"
              value={<Pill tone={doc.ehr_integration.supports_smart_on_fhir ? 'green' : 'slate'}>{doc.ehr_integration.supports_smart_on_fhir ? 'supported' : 'not supported'}</Pill>}
            />
          )}
          {doc.ehr_integration.supports_cds_hooks !== undefined && (
            <Field
              label="CDS Hooks"
              value={<Pill tone={doc.ehr_integration.supports_cds_hooks ? 'green' : 'slate'}>{doc.ehr_integration.supports_cds_hooks ? 'supported' : 'not supported'}</Pill>}
            />
          )}
          {doc.ehr_integration.ehr_vendors_supported && doc.ehr_integration.ehr_vendors_supported.length > 0 && (
            <Field
              label="EHR vendors"
              value={
                <div className="flex flex-wrap gap-1.5">
                  {doc.ehr_integration.ehr_vendors_supported.map((v) => (
                    <Pill key={v} tone="violet">{v}</Pill>
                  ))}
                </div>
              }
            />
          )}
        </Card>
      )}

      {/* Cross-refs */}
      {(doc.agent_card_uri || doc.audit?.incident_card_index_uri) && (
        <Card title="Cross-references" subtitle="Chain through to other Kinetic Gain documents">
          {doc.agent_card_uri && (
            <Field
              label="Agent Card"
              value={
                <a href={doc.agent_card_uri} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline code break-all">
                  ↗ {doc.agent_card_uri}
                </a>
              }
              mono
            />
          )}
          {doc.audit?.incident_card_index_uri && (
            <Field
              label="Incident Card index"
              value={
                <a href={doc.audit.incident_card_index_uri} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline code break-all">
                  ↗ {doc.audit.incident_card_index_uri}
                </a>
              }
              mono
            />
          )}
        </Card>
      )}
    </div>
  );
}
