import { Card, Field, Pill } from './common';

type EvidenceSource = {
  source_id: string;
  source_type: 'document' | 'image' | 'database_record' | 'external_api' | 'structured_data';
  content_hash: string;
  retrieval_confidence: number;
  synthesis_role: 'primary' | 'supporting' | 'excluded';
};

type ClaimsCard = {
  claims_card_version: string;
  claim: {
    claim_id: string;
    policy_id: string;
    claimant_ref: string;
    claim_type: 'property_damage' | 'medical' | 'auto' | 'life' | 'liability' | 'other';
    filed_at: string;
  };
  decision: {
    outcome: 'approve' | 'deny' | 'pend' | 'refer';
    reasons: string[];
    rule_refs: string[];
    coverage: { covered: boolean; amount: number | null; currency: string };
  };
  evidence_bundle: {
    sources: EvidenceSource[];
    model: { model_id: string; model_version: string; provider: string };
    synthesis_method: string;
  };
  governance: {
    underwriting_rules_version: string;
    jurisdiction: string;
    regulatory_refs: string[];
    human_in_loop: boolean;
    reviewer_ref: string | null;
  };
  attestation: {
    card_hash: string;
    signature: string;
    algorithm: string;
    signing_key_id: string;
    signed_at: string;
    chain_index: number;
    prev_card_hash: string | null;
  };
  disclaimer: string;
};

type PillTone = 'slate' | 'green' | 'amber' | 'red' | 'blue' | 'violet' | 'rose';

function outcomeTone(outcome: ClaimsCard['decision']['outcome']): PillTone {
  switch (outcome) {
    case 'approve':
      return 'green';
    case 'deny':
      return 'red';
    case 'pend':
      return 'amber';
    case 'refer':
      return 'blue';
    default:
      return 'slate';
  }
}

function fmtAmount(amount: number | null, currency: string): string {
  if (amount === null || amount === undefined) return '—';
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

export function ClaimsDecisionCardRenderer({ doc }: { doc: ClaimsCard }) {
  const dec = doc.decision;
  const ev = doc.evidence_bundle;
  const gov = doc.governance;
  const att = doc.attestation;
  const prev = att?.prev_card_hash;

  return (
    <div className="space-y-4">
      <Card
        title={doc.claim?.claim_id ?? 'Claim'}
        subtitle={`AI Claims Decision Card · v${doc.claims_card_version}`}
      >
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Pill tone={outcomeTone(dec.outcome)}>{dec.outcome}</Pill>
          <Pill tone="slate">{doc.claim?.claim_type?.replace(/_/g, ' ')}</Pill>
          {gov?.human_in_loop ? <Pill tone="blue">human in the loop</Pill> : <Pill tone="amber">fully automated</Pill>}
        </div>
        <Field label="Policy" value={<span className="code">{doc.claim?.policy_id}</span>} />
        <Field label="Claimant ref" value={<span className="code">{doc.claim?.claimant_ref}</span>} />
        <Field label="Filed" value={<span className="code">{doc.claim?.filed_at}</span>} />
      </Card>

      <Card title="Decision" subtitle="Outcome, coverage, and the underwriting rules applied">
        <Field
          label="Coverage"
          value={
            <span>
              <span className="font-semibold">{dec.coverage?.covered ? 'Covered' : 'Not covered'}</span>
              {dec.coverage?.covered && (
                <span className="text-slate-300"> · {fmtAmount(dec.coverage.amount, dec.coverage.currency)}</span>
              )}
            </span>
          }
        />
        {dec.reasons?.length > 0 && (
          <div className="mt-2">
            <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Reasons</div>
            <ul className="list-disc list-inside space-y-0.5 text-slate-200">
              {dec.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}
        {dec.rule_refs?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {dec.rule_refs.map((r) => (
              <Pill key={r} tone="violet">
                {r}
              </Pill>
            ))}
          </div>
        )}
      </Card>

      <Card title="Evidence bundle" subtitle="What the model considered, content-hashed at retrieval">
        <Field
          label="Model"
          value={
            <span>
              <span className="font-semibold">{ev.model?.model_id}</span>
              <span className="text-slate-500">
                {' '}
                · v{ev.model?.model_version} · {ev.model?.provider}
              </span>
            </span>
          }
        />
        <Field label="Synthesis method" value={ev.synthesis_method} />
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="px-3 py-2 font-medium">Source</th>
                <th className="px-3 py-2 font-medium">Type</th>
                <th className="px-3 py-2 font-medium">Role</th>
                <th className="px-3 py-2 font-medium">Confidence</th>
                <th className="px-3 py-2 font-medium">Content hash</th>
              </tr>
            </thead>
            <tbody>
              {ev.sources?.map((s) => (
                <tr key={s.source_id} className="border-t border-slate-800">
                  <td className="px-3 py-2 code">{s.source_id}</td>
                  <td className="px-3 py-2">
                    <Pill tone="slate">{s.source_type.replace(/_/g, ' ')}</Pill>
                  </td>
                  <td className="px-3 py-2">
                    <Pill tone={s.synthesis_role === 'excluded' ? 'red' : s.synthesis_role === 'primary' ? 'green' : 'slate'}>
                      {s.synthesis_role}
                    </Pill>
                  </td>
                  <td className="px-3 py-2 tabular-nums">{(s.retrieval_confidence * 100).toFixed(0)}%</td>
                  <td className="px-3 py-2 code text-slate-500" title={s.content_hash}>
                    {s.content_hash.slice(0, 12)}…
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Governance" subtitle="Jurisdiction, applicable frameworks, human oversight">
        <Field label="Underwriting ruleset" value={<span className="code">{gov.underwriting_rules_version}</span>} />
        <Field label="Jurisdiction" value={<Pill tone="blue">{gov.jurisdiction}</Pill>} />
        {gov.regulatory_refs?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {gov.regulatory_refs.map((r) => (
              <Pill key={r} tone="slate">
                {r}
              </Pill>
            ))}
          </div>
        )}
        <Field label="Human in the loop" value={gov.human_in_loop ? 'Yes' : 'No'} />
        {gov.reviewer_ref && <Field label="Reviewer" value={<span className="code">{gov.reviewer_ref}</span>} />}
      </Card>

      <Card title="Attestation" subtitle="ed25519 signature over the canonical hash · chain-linked">
        <Field label="Algorithm" value={<Pill tone="green">{att.algorithm}</Pill>} />
        <Field label="Chain index" value={<span className="tabular-nums">{att.chain_index}</span>} />
        <Field
          label="Predecessor"
          value={
            prev ? (
              <span className="code" title={prev}>
                {prev.slice(0, 12)}…
              </span>
            ) : (
              <span className="text-slate-500 italic">none (chain genesis)</span>
            )
          }
        />
        <Field label="Signing key" value={<span className="code">{att.signing_key_id}</span>} />
        <Field label="Signed at" value={<span className="code">{att.signed_at}</span>} />
        <Field
          label="Card hash"
          value={
            <span className="code text-slate-500" title={att.card_hash}>
              {att.card_hash.slice(0, 16)}…
            </span>
          }
        />
      </Card>

      {doc.disclaimer && (
        <p className="text-xs text-slate-500 leading-relaxed px-1">{doc.disclaimer}</p>
      )}
    </div>
  );
}
