// One canonical example per spec, loaded by the editor when the user
// clicks "Load example" or selects a spec from the gallery.

export const AEO_EXAMPLE = {
  aeo_version: '0.1',
  entity: {
    id: 'https://mizcausevic-dev.github.io/#person',
    type: 'Person',
    name: 'Miz Causevic',
    aliases: ['Mirza Causevic'],
    canonical_url: 'https://mizcausevic-dev.github.io/',
  },
  authority: {
    primary_sources: [
      'https://mizcausevic-dev.github.io/',
      'https://github.com/mizcausevic-dev',
      'https://www.linkedin.com/in/mirzacausevic/',
    ],
    verifications: [
      { type: 'github', value: 'mizcausevic-dev' },
      { type: 'linkedin', value: 'mirzacausevic' },
    ],
  },
  claims: [
    {
      id: 'current-role',
      predicate: 'jobTitle',
      value: 'Boston Enterprise Technologist · Platform Architecture · B2B SaaS Technologist',
      confidence: 'high',
    },
    {
      id: 'years-experience',
      predicate: 'aeo:yearsOfExperience',
      value: 30,
      confidence: 'high',
    },
  ],
  citation_preferences: {
    preferred_attribution: 'Miz Causevic — github.com/mizcausevic-dev',
  },
  audit: { mode: 'none' },
};

export const PROMPT_PROVENANCE_EXAMPLE = {
  provenance_version: '0.1',
  prompt: {
    id: 'incident-summary-generator',
    name: 'Incident Summary Generator',
    version: '1.1.0',
    hash: 'sha256:b4c2f0e3d7e5f9b1a8c6d3e0f2b5a7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9b1',
    content_uri: 'https://example.com/prompts/incident-summary/v1.1.0/template.j2',
    content_type: 'text/jinja2',
  },
  lineage: {
    parent: 'incident-summary-generator@1.0.0',
    derivation: 'tune',
    change_summary: 'Tightened the rubric for synthesizing duration; added explicit instruction to omit speculative root cause.',
  },
  authorship: {
    created_by: 'mirzacausevic@example.com',
    reviewed_by: ['sre-lead@example.com', 'principal-eng@example.com'],
    approved_by: 'principal-eng@example.com',
    created_at: '2026-05-12T02:00:00Z',
    approved_at: '2026-05-12T02:45:00Z',
  },
  intent: {
    purpose: 'Summarize an incident timeline into a 200-word post-mortem opening section.',
    models_supported: ['claude-opus-4-*', 'claude-sonnet-4-*'],
  },
  evaluations: [
    { suite: 'incident-summary-quality-v3', result_uri: 'https://eval.example.com/runs/123', score: 0.94, passed: true, ran_at: '2026-05-12T02:15:00Z' },
  ],
  approval: { state: 'approved' },
};

export const AGENT_CARD_EXAMPLE = {
  agent_card_version: '0.1',
  agent: {
    id: 'customer-support-tier-1',
    name: 'Tier-1 Customer Support Agent',
    version: '2.4.1',
    provider: 'Kinetic Gain',
    description: 'First-line customer support. Handles account questions, billing lookups, product orientation. Escalates entitlement changes and refunds.',
  },
  capabilities: {
    primary_purpose: 'Resolve common customer questions and triage incoming support tickets.',
    models_used: [
      { name: 'claude-sonnet-4-6', provider: 'Anthropic', role: 'executor' },
      { name: 'claude-haiku-4-5', provider: 'Anthropic', role: 'router' },
    ],
    tools: [
      { name: 'billing-lookup', side_effects: 'read' },
      { name: 'ticket-create', side_effects: 'mutating' },
    ],
    max_context_tokens: 100000,
    memory_persistence: 'session',
    autonomy_level: 'supervised',
  },
  refusal_taxonomy: [
    { category: 'entitlement_change', behavior: 'escalate_to_human' },
    { category: 'refund_request', behavior: 'escalate_to_human' },
    { category: 'legal_advice', behavior: 'refuse_and_explain' },
  ],
  deployment: { environment: 'production', uptime_sla: '99.5%', regions: ['us-east-1', 'eu-west-1'] },
  safety_posture: {
    human_in_loop_required: ['entitlement_change', 'refund_request', 'account_deletion'],
  },
};

export const AI_EVIDENCE_EXAMPLE = {
  evidence_version: '0.1',
  evidence_id: 'ev-2026-05-12-a4f9c1',
  claim_text: 'The AEO Protocol defines three pillars: Declare, Discover, and Audit.',
  source: {
    uri: 'https://github.com/mizcausevic-dev/aeo-protocol-spec/blob/main/SPEC.md',
    type: 'document',
    title: 'AEO Protocol v0.1 — Specification',
    publisher: 'mizcausevic-dev',
    fetched_at: '2026-05-12T03:45:00Z',
  },
  span: {
    selector_type: 'text_quote',
    selector_value: '## 3. The three pillars',
    exact_text: '## 3. The three pillars\n\n### 3.1 Declare\n\nThe entity publishes a single JSON document at a fixed path describing itself.',
  },
  retrieval: { method: 'hybrid', confidence: 0.93, rank: 1, freshness_age_seconds: 90 },
  verification: { content_hash: 'sha256:c7d1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1' },
  synthesis_role: 'supporting',
};

export const MCP_TOOL_CARD_EXAMPLE = {
  tool_card_version: '0.1',
  tool: {
    server_id: 'kg-billing-mcp',
    name: 'billing-lookup',
    version: '1.4.0',
    mcp_server_uri: 'https://billing.kineticgain.com/mcp',
    description: 'Looks up a customer\'s current invoice, plan tier, and usage-to-date. Read-only.',
  },
  schema: {
    input_schema_inline: {
      type: 'object',
      required: ['customer_id'],
      properties: { customer_id: { type: 'string' } },
    },
  },
  safety: {
    side_effect_class: 'read',
    external_systems: ['stripe-api'],
    reversible: true,
    rate_limited: true,
    pii_exposure: 'low',
    secrets_exposure: 'none',
    human_approval_required: false,
    refusal_modes: ['cross_tenant_access', 'rate_limit_exceeded'],
  },
  tested_with: [
    { llm: 'claude-opus-4-7', provider: 'Anthropic', test_suite_uri: 'https://eval.kineticgain.com/suites/mcp-billing-v2', pass_rate: 0.98, tested_at: '2026-05-08T10:00:00Z' },
  ],
  performance: { p50_latency_ms: 120, p99_latency_ms: 580, measurement_window: 'last_7d' },
  audit: { log_uri: 'https://audit.kineticgain.com/mcp/billing-lookup', retention_days: 365 },
};

export const TUTOR_CARD_EXAMPLE = {
  tutor_card_version: '0.1',
  tutor: {
    id: 'kineticgain-k12-math-tutor',
    name: 'Kinetic Gain K-12 Math Tutor',
    version: '1.4.0',
    provider: 'Kinetic Gain Edu',
    description: 'Personal AI math tutor for K-12. Socratic; produces step-by-step explanations; will not complete homework or assessment items.',
  },
  audience: {
    age_range_min: 5,
    age_range_max: 18,
    grade_range_min: 'K',
    grade_range_max: '12',
    language_codes: ['en', 'es'],
  },
  subject_scope: {
    primary_subjects: ['Math'],
    topics_included: ['arithmetic', 'algebra', 'geometry', 'statistics'],
    topics_excluded: ['differential equations', 'linear algebra'],
  },
  pedagogy: {
    approach: 'socratic',
    homework_policy: 'guide_only',
    assessment_policy: 'refuse',
    supports_visual_explanations: true,
    supports_step_by_step_breakdown: true,
  },
  curriculum_alignment: [
    { framework: 'Common Core State Standards (Math)', version: '2010' },
  ],
  safety: {
    content_filter_strength: 'strict',
    mandated_reporter_protocol: true,
    human_in_loop_required: ['mental_health_disclosure', 'abuse_disclosure', 'self_harm_disclosure'],
    blocks_explicit_content: true,
    blocks_drug_alcohol_content: true,
    blocks_violence_content: true,
    blocks_political_advocacy: true,
  },
  data_privacy: {
    ferpa_compliant: true,
    coppa_compliant: true,
    gdpr_compliant: true,
    retention_days: 90,
    data_sharing_with_parents: 'summaries_only',
    data_sharing_with_school: 'summaries_only',
    third_party_data_sharing: false,
    model_training_consent_required: true,
  },
  agent_card_uri: 'https://edu.kineticgain.com/.well-known/agents/k12-math-tutor.json',
  evaluations: [
    { suite: 'k12-math-accuracy-v3', result_uri: 'https://eval.kineticgain.com/runs/k12-math-1.4.0', metrics: { accuracy: 0.94 }, ran_at: '2026-04-12T00:00:00Z' },
  ],
};

export const STUDENT_DISCLOSURE_EXAMPLE = {
  disclosure_version: '0.1',
  disclosure_id: 'd-2026-05-12-b4f9c1e8',
  created_at: '2026-05-12T16:42:00Z',
  student: {
    id: 'stu-9c2e44',
    grade_or_year: '11',
    institution_id: 'lincoln-high-district-42',
  },
  assignment: {
    id: 'assn-2026-bio-lab-7',
    title: 'Cell Respiration Lab Report',
    course_id: 'course-bio-11-spring-2026',
    lms: 'canvas',
    due_at: '2026-05-13T23:59:00Z',
  },
  ai_used: true,
  tools_used: [
    { name: 'Claude.ai', provider: 'Anthropic', version: 'claude-sonnet-4-6' },
  ],
  roles: ['edit', 'cite_check'],
  assistance_extent: 'minor',
  assistance_pct: 8,
  prompt_evidence_mode: 'hashed',
  prompts: [
    {
      id: 'p1',
      hash: 'sha256:c7d1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1',
      at: '2026-05-12T15:55:00Z',
      tool_index: 0,
    },
    {
      id: 'p2',
      hash: 'sha256:e1d2c3b4a5968778695a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e',
      at: '2026-05-12T16:18:00Z',
      tool_index: 0,
    },
  ],
  artifact_hash: 'sha256:1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
  artifact_uri: 'https://lincoln-high.instructure.com/files/889944/download',
  aup_uri: 'https://lincoln-high-district-42.edu/.well-known/ai-aup.json',
  policy_compliant: {
    declared: true,
    reason: 'AUP §3.2 permits AI-assisted grammar review and citation verification for lab reports.',
  },
  signed_by_student: true,
  student_signature_at: '2026-05-12T16:42:00Z',
  teacher_acknowledged: {
    acknowledged: true,
    by: 'teacher-rivera-m',
    at: '2026-05-13T08:15:00Z',
    note: 'Reviewed. Compliant with course AI policy.',
  },
};

export const CLASSROOM_AUP_EXAMPLE = {
  aup_version: '0.1',
  policy_id: 'lincoln-district-42-2026-ai-aup',
  policy_name: 'Lincoln High District 42 — Classroom AI Acceptable Use Policy',
  version: '1.2.0',
  effective_at: '2026-01-15T00:00:00Z',
  scope: {
    type: 'district',
    institution_id: 'lincoln-high-district-42',
    grade_bands: ['K-5', '6-8', '9-12'],
  },
  permitted_use: {
    permitted_roles: ['edit', 'cite_check', 'translate', 'tutor_dialog'],
    permitted_tool_categories: ['tutoring', 'translation'],
    permitted_tools: [
      {
        name: 'Kinetic Gain K-12 Math Tutor',
        tutor_card_uri: 'https://edu.kineticgain.com/.well-known/tutors/k12-math-tutor.json',
        notes: 'District-approved math tutor; FERPA + COPPA attested.',
      },
    ],
    assistance_extent_max: 'minor',
  },
  prohibited_use: {
    prohibited_roles: ['draft', 'image_generation'],
    prohibited_uses: [
      'Generating answers to assessment items (quizzes, tests, exams).',
      'Producing first-draft prose for English Language Arts assignments.',
      'Any use by students under 13 without recorded parent consent.',
    ],
  },
  disclosure_requirements: {
    required_when: 'when_used',
    required_prompt_evidence_mode: 'hashed',
    signature_required: true,
    teacher_acknowledgment_required: true,
    artifact_hash_required: true,
  },
  supervision: {
    level: 'teacher_visible',
    human_in_loop_categories: [
      'mental_health_disclosure',
      'abuse_disclosure',
      'self_harm_disclosure',
    ],
  },
  vendor_requirements: {
    requires_tutor_card: true,
    requires_agent_card: false,
    required_compliance: ['ferpa', 'coppa'],
    state_specific_laws: ['NY-Ed-Law-2-D'],
    required_content_filter_strength_min: 'strict',
    requires_mandated_reporter_protocol: true,
    requires_human_in_loop_for: [
      'mental_health_disclosure',
      'abuse_disclosure',
      'self_harm_disclosure',
    ],
    retention_days_max: 90,
    prohibits_third_party_data_sharing: true,
    prohibits_model_training_on_student_data: true,
  },
  parent_notification: {
    notification_level: 'at_enrollment',
    parent_consent_required: true,
    consent_age_threshold: 13,
  },
  enforcement: {
    violation_response: [
      'First offense: referral to academic integrity office and required AI-use briefing.',
      'Second offense: grade reduction on affected assignment.',
      'Third offense: referral to school disciplinary committee.',
    ],
    appeals_process_uri: 'https://lincoln-high-district-42.edu/students/ai-policy-appeals',
  },
  published_by: {
    name: 'Lincoln High District 42 — Office of the Superintendent',
    role: 'district',
    contact_uri: 'mailto:ai-policy@lincoln-high-district-42.edu',
  },
  published_at: '2026-01-08T15:30:00Z',
  audit_log_uri: 'https://lincoln-high-district-42.edu/.well-known/ai-aup-changelog.json',
};

export const CLINICAL_AI_EXAMPLE = {
  clinical_ai_card_version: '0.1',
  system: {
    id: 'kineticgain-sepsis-ews',
    name: 'Kinetic Gain Sepsis Early Warning System',
    version: '2.3.1',
    provider: 'Kinetic Gain Health',
    homepage: 'https://health.kineticgain.com/sepsis-ews',
    description: 'Continuous-monitoring AI system surfacing high-risk-of-sepsis patients to clinicians. SaMD class II; clinician override required on every recommendation.',
  },
  clinical_context: {
    indication: 'Early detection of adult inpatient sepsis using vital signs, lab values, and nursing documentation in real time. Surfaces a risk score 6-12 hours before traditional EWS triggers.',
    care_settings: ['inpatient', 'icu'],
    patient_population: {
      age_range_min: 18,
      age_range_max: 89,
      exclusions: ['pediatrics-under-18', 'obstetric-patients', 'comfort-care-only'],
    },
    intended_use: 'Clinical decision support for adult inpatient providers to identify patients at elevated risk of sepsis onset.',
    off_label_uses_prohibited: true,
  },
  regulatory: {
    fda_status: '510k_cleared',
    fda_clearance_number: 'K233456',
    fda_clearance_uri: 'https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpmn/pmn.cfm?ID=K233456',
    iso_certifications: ['ISO 13485', 'IEC 62304', 'ISO 14971'],
    is_medical_device: true,
    is_clinical_decision_support: true,
    is_software_as_medical_device: true,
    samd_class: 'II',
    samd_classification_rationale: 'Healthcare situation: serious. Healthcare decision: drive clinical management. Per IMDRF: Class II.',
  },
  clinical_role: {
    decision_support_level: 'advisory',
    clinician_override_required: true,
    patient_facing_only: false,
    transparency_to_patient_required: true,
    pre_authorization_use: false,
  },
  evidence: {
    validation_studies: [
      {
        title: 'Multi-site prospective validation of Kinetic Gain Sepsis EWS across 4 US academic centers',
        uri: 'https://health.kineticgain.com/studies/sepsis-ews-multisite-2025.pdf',
        population_size: 48217,
        primary_outcome: 'Detection of sepsis onset (Sepsis-3 criteria) at least 6 hours before standard MEWS trigger',
        results_summary: 'Achieved sensitivity 0.84, specificity 0.78, AUC 0.89. Sensitivity remained >0.80 across age, sex, and self-reported race subgroups.',
        peer_reviewed: true,
        published_at: '2025-09-04T00:00:00Z',
      },
    ],
    training_data_sources: ['MIMIC-IV', 'eICU Collaborative', 'Internal multi-site dataset N=287k'],
    bias_audit_uri: 'https://health.kineticgain.com/audits/sepsis-ews-bias-2025-Q4.pdf',
    performance_metrics: {
      measurement_population: 'Adult inpatient encounters at 4 US academic centers (validation cohort, 2024-2025)',
      sensitivity: 0.84,
      specificity: 0.78,
      auc: 0.89,
      false_positive_rate: 0.22,
      false_negative_rate: 0.16,
      ppv: 0.42,
      npv: 0.96,
    },
  },
  patient_data: {
    phi_processed: true,
    hipaa_compliant: true,
    baa_required: true,
    de_identification_method: 'not-applicable',
    retention_days: 365,
    patient_consent_required: false,
    third_party_data_sharing: false,
    model_training_consent_required: false,
  },
  safety: {
    human_in_loop_required_for: ['pediatric-patient-mistakenly-routed', 'obstetric-patient', 'comfort-care-only-patient'],
    mandatory_reporting_categories: ['adverse-drug-event-related-to-acted-on-alert'],
    blocks_diagnostic_claims: false,
    treatment_recommendation_disclaimer_required: false,
  },
  ehr_integration: {
    fhir_version: 'R4',
    supports_smart_on_fhir: true,
    supports_cds_hooks: true,
    ehr_vendors_supported: ['Epic', 'Cerner', 'MEDITECH'],
  },
  agent_card_uri: 'https://health.kineticgain.com/.well-known/agents/sepsis-ews.json',
  audit: {
    incident_card_index_uri: 'https://health.kineticgain.com/.well-known/ai-incidents.json',
  },
};

export const AI_INCIDENT_EXAMPLE = {
  incident_card_version: '0.1',
  incident: {
    id: 'INC-2026-04-22-kineticgain-001',
    title: 'K-12 math tutor failed to escalate self-harm disclosure to mandated-reporter workflow',
    severity: 'critical',
    categories: ['mandated_reporter_failure'],
    discovered_at: '2026-04-22T14:30:00Z',
    occurred_at: '2026-04-21T19:14:00Z',
    disclosed_at: '2026-04-23T09:00:00Z',
    resolved_at: '2026-04-25T16:00:00Z',
    status: 'resolved',
  },
  affected: {
    vendor: 'Kinetic Gain Edu',
    products: ['Kinetic Gain K-12 Math Tutor'],
    versions: ['1.4.0'],
    tutor_card_uris: ['https://edu.kineticgain.com/.well-known/tutors/k12-math-tutor.json'],
    agent_card_uris: ['https://edu.kineticgain.com/.well-known/agents/k12-math-tutor.json'],
    affected_user_count: { kind: 'exact', count: 1 },
    affected_populations: ['k12-students-grade-9'],
  },
  summary: 'During an algebra tutoring session, a 14-year-old learner included a self-harm disclosure within a word-problem context. The tutor\'s Socratic prompt classifier correctly identified the math content but did not invoke the mandated_reporter_protocol handler. The Tutor Card declares mandated_reporter_protocol=true; the failure is a refusal-taxonomy compliance violation.',
  root_cause: {
    category: 'refusal_taxonomy_gap',
    description: 'The disclosure classifier was trained on isolated-utterance examples and did not generalize to disclosures embedded inside an unrelated content frame (a word problem). The classifier returned mathematics_homework with confidence 0.94 and short-circuited before the mandated-reporter chain could run.',
  },
  harm: {
    severity_justification: 'K-12 mandated-reporter failure involving an under-18 learner. Critical per spec §6.6.',
    manifested: true,
    narrative: 'The student did not receive immediate counselor escalation. A school counselor reached the family 18 hours later via separate channels. No physical harm; the gap in the escalation chain is the incident.',
  },
  mitigation: {
    actions_taken: [
      'Added a parallel disclosure classifier that runs unconditionally on every learner turn regardless of primary-content classification.',
      'Added a regression test corpus of 312 embedded-disclosure examples across content frames.',
      'Notified all 14 K-12 districts running v1.4.0 within 24 hours.',
    ],
    permanent_fix: true,
    rollout_status: 'deployed',
    workaround_for_users: 'v1.4.0 has been removed from distribution. Districts should upgrade to v1.4.2.',
  },
  regulatory: {
    reported_to: ['ferpa', 'state-attorney-general'],
    reporting_deadline_met: true,
    regulatory_filing_uris: [
      'https://edu.kineticgain.com/regulatory/2026-04-22-ferpa-notice.pdf',
      'https://edu.kineticgain.com/regulatory/2026-04-22-state-ag-notice.pdf',
    ],
  },
  published_by: {
    name: 'Kinetic Gain Edu — Trust & Safety',
    role: 'vendor',
    contact_uri: 'mailto:trust-safety@edu.kineticgain.com',
  },
  published_at: '2026-04-23T09:00:00Z',
  last_updated_at: '2026-04-26T16:30:00Z',
  revision: {
    number: 3,
    change_summary: 'Marked resolved; added permanent_fix=true; appended postmortem blog reference.',
  },
};

export const DECISION_CARD_EXAMPLE = {
  decision_card_version: '0.3',
  decision_id: 'SPRINGFIELD-DEC-2026-001',
  issued_at: '2026-05-14T19:00:00Z',
  buyer: {
    name: 'Springfield Unified School District',
    type: 'school-district',
    category: 'edtech-district',
    jurisdiction: 'US-CA',
    url: 'https://springfield.edu/',
    contact: 'procurement@springfield.edu',
    id: 'https://springfield.edu/#org',
  },
  decision_maker: {
    role: 'Director of Educational Technology',
    name: 'Dr. Jane Doe',
    department: 'Office of Technology',
    authority: 'Board Resolution 2026-04',
  },
  decision: {
    status: 'approved-with-conditions',
    effective_from: '2026-09-01',
    effective_until: '2027-08-31',
    scope: 'K-12 classroom use during regular school hours. Not approved for assessment or grading workflows.',
  },
  subject: {
    vendor_name: 'AcmeTutor Inc.',
    product_name: 'AcmeTutor 3.0',
    vendor_id: 'https://acmetutor.example/.well-known/aeo.json',
    documents_reviewed: [
      {
        type: 'tutor-card',
        url: 'https://acmetutor.example/.well-known/tutor-card.json',
        fetched_at: '2026-05-10T14:00:00Z',
        content_hash: 'sha256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        version: '3.0.2',
      },
      {
        type: 'student-ai-disclosure',
        url: 'https://acmetutor.example/.well-known/student-ai-disclosure.json',
        fetched_at: '2026-05-10T14:00:00Z',
        content_hash: 'sha256:fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210',
      },
      {
        type: 'aeo',
        url: 'https://acmetutor.example/.well-known/aeo.json',
        fetched_at: '2026-05-10T14:00:00Z',
        content_hash: 'sha256:1111222233334444555566667777888899990000aaaabbbbccccddddeeeeffff',
      },
    ],
  },
  criteria: {
    policy_uris: [
      'https://springfield.edu/.well-known/aup.json',
      'https://springfield.edu/policies/ai-procurement-2026.pdf',
    ],
    rubric: [
      { id: 'ferpa-compliance',         description: 'Vendor processes student records in a FERPA-compliant manner.', weight: 1.0, result: 'pass' },
      { id: 'coppa-compliance',         description: 'Vendor obtains verifiable parental consent for users under 13.', weight: 1.0, result: 'pass' },
      { id: 'no-training-on-student-data', description: 'Vendor does not use student-provided content for model training.', weight: 1.0, result: 'pass-with-condition', notes: 'Student Disclosure asserts no-training; district requires contractual confirmation.' },
      { id: 'age-appropriate-content',  description: 'Vendor filters out content inappropriate for the declared age range.', weight: 0.8, result: 'pass' },
      { id: 'bias-audit-completed',     description: 'Vendor has completed a third-party bias audit within the last 18 months.', weight: 0.8, result: 'partial', notes: 'Bias audit completed 2025-03; due for refresh by 2026-09.' },
      { id: 'mandated-reporter-escalation', description: 'Vendor has a documented escalation path for self-harm or abuse disclosures.', weight: 1.0, result: 'pass' },
    ],
  },
  conditions: [
    {
      id: 'no-training-restriction',
      description: 'Vendor SHALL NOT use Springfield USD student-provided content for model training, fine-tuning, or evaluation. Inference logs SHALL be deleted within 30 days.',
      enforcement: 'contractual',
      violation_response: 'Contract termination and breach notification to families within 60 days.',
      verification_uri: 'https://springfield.edu/procurement/SPRINGFIELD-DEC-2026-001/no-training-attestation',
    },
    {
      id: 'bias-audit-refresh',
      description: 'Vendor SHALL deliver a refreshed third-party bias audit no later than 2026-12-01.',
      enforcement: 'audit',
      violation_response: 'Suspension of approval pending refreshed audit.',
    },
    {
      id: 'no-assessment-use',
      description: 'Vendor SHALL display a clear notice that AcmeTutor outputs MUST NOT be used for student assessment or grading.',
      enforcement: 'technical',
    },
  ],
  rationale:
    'AcmeTutor 3.0 meets all hard requirements for FERPA, COPPA, and age-appropriate content filtering. The vendor\'s Student AI Disclosure already commits to no-training-on-student-data; the district requires contractual reaffirmation of this commitment. Approval granted for K-12 classroom use only, with explicit exclusion of assessment and grading workflows.',
  history: [
    { event: 'review_started',         at: '2026-04-15T10:00:00Z', actor: 'EdTech Procurement Committee' },
    { event: 'documents_collected',    at: '2026-05-10T14:00:00Z', actor: 'Dr. Jane Doe' },
    { event: 'review_completed',       at: '2026-05-12T16:00:00Z', actor: 'EdTech Procurement Committee' },
    { event: 'approved-with-conditions', at: '2026-05-14T19:00:00Z', actor: 'Dr. Jane Doe', note: 'Approval contingent on three documented conditions.' },
  ],
  appeals: {
    deadline: '2026-06-14',
    process_uri: 'https://springfield.edu/procurement/appeals',
    contact: 'appeals@springfield.edu',
  },
  publication: {
    publication_uri: 'https://springfield.edu/.well-known/decisions/SPRINGFIELD-DEC-2026-001.json',
    is_public: true,
  },
  signatures: [
    {
      signer: 'Dr. Jane Doe, Director of Educational Technology',
      signed_at: '2026-05-14T19:00:00Z',
      method: 'electronic-attestation',
    },
  ],
  // v0.2: declares the field-level vault contract — which PII fields may be
  // tokenized through a Skyflow-shaped vault and which roles may detokenize.
  data_vault_targets: [
    {
      vendor: 'skyyflow',
      vault_id: 'springfield-edtech-2026',
      vault_url: 'https://springfield-edtech.vault.skyyflowapis.example',
      fields_authorized: ['student_email', 'parent_email', 'guardian_phone', 'student_id'],
      reveal_roles: ['principal', 'compliance-officer'],
      reveal_audit_uri: 'https://springfield.edu/.well-known/edtech-reveal-audit',
      notes: 'Per Board Resolution 2026-04: student PII enters Skyflow before reaching AcmeTutor. Reveal limited to two roles during active compliance review.',
    },
  ],
  // v0.3: per-field TTL + redaction action + signed-deletion-proof endpoint.
  // Pairs with data_vault_targets above — vault answers WHO can read, retention
  // envelope answers HOW LONG the data lives and HOW deletion is proven.
  retention_envelope: [
    {
      field: 'student_email',
      ttl: 'P90D',
      redact_on_expiry: 'tokenize',
      deletion_proof_uri: 'https://springfield.edu/.well-known/retention/proof',
      deletion_signer_key_uri: 'https://springfield.edu/.well-known/keys/retention-signer.json',
      exemptions: [
        {
          trigger: 'active-legal-hold',
          role: 'legal-hold-officer',
          max_extension: 'P365D',
          audit_uri: 'https://springfield.edu/.well-known/edtech-reveal-audit',
          notes: 'Hold paused during active CDE complaint or e-discovery.',
        },
      ],
      notes: 'Tokenized (not purged) so vault-resident analytics keep working without surfacing the raw value.',
    },
    {
      field: 'parent_email',
      ttl: 'P90D',
      redact_on_expiry: 'purge',
      deletion_proof_uri: 'https://springfield.edu/.well-known/retention/proof',
      deletion_signer_key_uri: 'https://springfield.edu/.well-known/keys/retention-signer.json',
    },
    {
      field: 'guardian_phone',
      ttl: 'P30D',
      redact_on_expiry: 'purge',
      deletion_proof_uri: 'https://springfield.edu/.well-known/retention/proof',
      deletion_signer_key_uri: 'https://springfield.edu/.well-known/keys/retention-signer.json',
    },
    {
      field: 'session_transcript',
      ttl: 'P1Y',
      redact_on_expiry: 'hash',
      deletion_proof_uri: 'https://springfield.edu/.well-known/retention/proof',
      deletion_signer_key_uri: 'https://springfield.edu/.well-known/keys/retention-signer.json',
      exemptions: [
        {
          trigger: 'active-investigation',
          role: 'compliance-officer',
          max_extension: 'P180D',
          audit_uri: 'https://springfield.edu/.well-known/edtech-reveal-audit',
          notes: 'Title IX or Section 504 investigations may extend transcript retention up to six months past TTL.',
        },
      ],
      notes: 'Hashed (not purged) so cohort-level evidence stays available without identifiers. Aligns with Board Policy 5125 — one school year for AI-tutor transcripts.',
    },
  ],
};

import type { SpecKey } from './detect';

export const EXAMPLES: Record<Exclude<SpecKey, 'unknown'>, unknown> = {
  aeo: AEO_EXAMPLE,
  'prompt-provenance': PROMPT_PROVENANCE_EXAMPLE,
  'agent-card': AGENT_CARD_EXAMPLE,
  'ai-evidence': AI_EVIDENCE_EXAMPLE,
  'mcp-tool-card': MCP_TOOL_CARD_EXAMPLE,
  'tutor-card': TUTOR_CARD_EXAMPLE,
  'student-ai-disclosure': STUDENT_DISCLOSURE_EXAMPLE,
  'classroom-aup': CLASSROOM_AUP_EXAMPLE,
  'clinical-ai': CLINICAL_AI_EXAMPLE,
  'ai-incident-card': AI_INCIDENT_EXAMPLE,
  'decision-card': DECISION_CARD_EXAMPLE,
};
