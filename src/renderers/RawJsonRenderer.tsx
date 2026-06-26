import { Card } from './common';

export function RawJsonRenderer({ doc }: { doc: unknown }) {
  return (
    <Card title="Raw JSON" subtitle="No recognized spec, showing the document as-is">
      <pre className="text-xs code bg-slate-950 rounded-lg p-4 border border-slate-800 overflow-x-auto whitespace-pre-wrap">
        {JSON.stringify(doc, null, 2)}
      </pre>
      <p className="text-xs text-slate-500 mt-3">
        To render a spec-aware view, the document must include one of:{' '}
        <code className="code">aeo_version</code>,{' '}
        <code className="code">provenance_version</code>,{' '}
        <code className="code">agent_card_version</code>,{' '}
        <code className="code">evidence_version</code>, or{' '}
        <code className="code">tool_card_version</code>.
      </p>
    </Card>
  );
}
