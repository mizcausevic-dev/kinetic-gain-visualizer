import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronRight,
  Copy,
  Download,
  Hash,
  RotateCcw,
  Scale,
  Wrench,
  XCircle,
} from 'lucide-react';

import {
  buildSampleChain,
  tamperedChain,
  verifyChain,
  type ChainStep,
  type ChainVerifyResult,
  type GovernanceEvent,
} from '../lib/audit-chain';

const KIND_ACCENT: Record<string, string> = {
  decision_card_drafted: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  decision_card_approved: 'bg-green-500/15 text-green-300 border-green-500/30',
  policy_bundle_minted: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  request_denied: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  attestation_failed: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  watch_drifted: 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30',
};

function shortHash(h: string): string {
  if (h.length <= 16) return h;
  return `${h.slice(0, 8)}…${h.slice(-6)}`;
}

function downloadJSON(events: GovernanceEvent[], filename: string) {
  const blob = new Blob([JSON.stringify(events, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function AuditStreamView() {
  const [events, setEvents] = useState<GovernanceEvent[] | null>(null);
  const [result, setResult] = useState<ChainVerifyResult | null>(null);
  const [tampered, setTampered] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const chain = await buildSampleChain();
      if (cancelled) return;
      setEvents(chain);
      const r = await verifyChain(chain);
      if (cancelled) return;
      setResult(r);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleTamper() {
    if (!events) return;
    const evil = tamperedChain(events, 2); // mutate event #3 (policy_bundle_minted)
    setEvents(evil);
    setTampered(true);
    const r = await verifyChain(evil);
    setResult(r);
  }

  async function handleReset() {
    const chain = await buildSampleChain();
    setEvents(chain);
    setTampered(false);
    const r = await verifyChain(chain);
    setResult(r);
  }

  function handleDownload() {
    if (!events) return;
    const filename = tampered
      ? 'audit-stream-sample-tampered.json'
      : 'audit-stream-sample-clean.json';
    downloadJSON(events, filename);
  }

  if (!events || !result) {
    return (
      <div className="text-sm text-slate-400">Computing canonical hashes…</div>
    );
  }

  const brokenIndex =
    result.firstBreakAt !== null ? result.firstBreakAt - 1 : null;
  const brokenEvent =
    brokenIndex !== null ? events[brokenIndex] ?? null : null;
  const brokenStep =
    brokenIndex !== null ? result.steps[brokenIndex] ?? null : null;

  return (
    <div className="space-y-10">
      <header className="space-y-3 max-w-3xl">
        <div className="text-xs uppercase tracking-widest text-slate-500 font-semibold code">
          The audit-stream spine, live
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          One hash-chained governance log. Six producers writing to it.
        </h1>
        <p className="text-slate-400 leading-relaxed">
          Below is a synthetic six-event chain showing a realistic governance arc — buyer drafts a
          Decision Card, approves it with conditions, the PolicyBundle is minted, an enforcement
          gate denies a request, an attestation fails, and a watch on the vendor's tutor-card
          drifts. Every event carries a canonical-JSON SHA-256 hash linking it to the prior event
          (Bitcoin-style chain), produced by{' '}
          <a
            className="text-blue-400 hover:text-blue-300 underline underline-offset-2 code"
            href="https://github.com/mizcausevic-dev/audit-stream-py"
            target="_blank"
            rel="noreferrer"
          >
            audit-stream-py
          </a>{' '}
          and verifiable end-to-end with the{' '}
          <a
            className="text-blue-400 hover:text-blue-300 underline underline-offset-2 code"
            href="https://github.com/mizcausevic-dev/mcp-kinetic-gain/blob/main/src/tools.ts"
            target="_blank"
            rel="noreferrer"
          >
            audit_chain_verify
          </a>{' '}
          MCP tool. This page recomputes the same hashes in your browser via Web Crypto — no
          network calls.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
        <div className="flex items-center flex-wrap gap-4">
          {result.valid ? (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-sm font-semibold">
              <CheckCircle2 size={16} /> Chain valid · {result.checked} events
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 text-sm font-semibold">
              <XCircle size={16} /> Chain broken at event #{result.firstBreakAt}
            </span>
          )}
          {!tampered ? (
            <button
              type="button"
              onClick={handleTamper}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/15 text-amber-200 border border-amber-500/30 hover:bg-amber-500/25 text-sm code"
            >
              <Wrench size={14} /> Tamper with event #3
            </button>
          ) : (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 text-sm code"
            >
              <RotateCcw size={14} /> Reset to clean chain
            </button>
          )}
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/15 text-blue-200 border border-blue-500/30 hover:bg-blue-500/25 text-sm code"
            title={tampered ? 'Download tampered chain JSON' : 'Download clean chain JSON'}
          >
            <Download size={14} /> Download chain JSON
          </button>
        </div>
        {result.reason && (
          <div className="flex items-start gap-2 text-sm text-amber-200 bg-amber-500/5 border border-amber-500/30 rounded-lg p-3">
            <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
            <span>{result.reason}</span>
          </div>
        )}
      </section>

      {brokenEvent && brokenStep && (
        <TamperSpotlight event={brokenEvent} step={brokenStep} />
      )}

      <section className="space-y-3">
        <div className="text-xs uppercase tracking-widest text-slate-500 font-bold code">
          Chain ({result.checked} events)
        </div>
        <div className="space-y-3">
          {events.map((e, idx) => {
            const step = result.steps[idx];
            return (
              <EventCard key={e.event_id} event={e} step={step} />
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
        <div className="text-xs uppercase tracking-widest text-slate-500 font-bold code">
          What this proves
        </div>
        <ul className="text-sm text-slate-300 space-y-2">
          <li>
            <strong className="text-slate-100">Canonical hash is deterministic.</strong> The same
            event body always produces the same hash, regardless of key order or whitespace in the
            JSON. This page uses the same convention as procurement-decision-api,
            aeo-validator-service, and hash-attestation-rs.
          </li>
          <li>
            <strong className="text-slate-100">Tamper = visible break.</strong> Click{' '}
            <em>Tamper with event #3</em> to mutate one field of one event. The recomputed hash no
            longer matches the reported hash, and the chain reports the break at event #3 — the
            same diagnostic <code className="code">audit_chain_verify</code> would emit on a real
            audit-stream-py instance.
          </li>
          <li>
            <strong className="text-slate-100">Download + verify yourself.</strong> The chain JSON
            is the same shape <code className="code">audit-stream-py</code> emits over SSE. Download
            it, feed it to the MCP tool, and you get the same verdict you see here.
          </li>
          <li>
            <strong className="text-slate-100">No backend.</strong> Verification runs in-browser
            via <code className="code">crypto.subtle.digest('SHA-256', …)</code>. There is no
            server call. The chain you're inspecting is the chain you're verifying.
          </li>
        </ul>
      </section>
    </div>
  );
}

function TamperSpotlight({ event, step }: { event: GovernanceEvent; step: ChainStep }) {
  return (
    <section className="rounded-2xl border-2 border-rose-500/40 bg-rose-500/[0.03] p-5 space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Scale size={16} className="text-rose-300" />
        <span className="text-xs uppercase tracking-widest text-rose-300 font-bold code">
          Tampered event spotlight · #{event.event_id} · {event.kind}
        </span>
      </div>
      <p className="text-sm text-slate-300 leading-relaxed">
        The chain reports a hash for this event. The browser then recomputes the canonical-JSON
        SHA-256 of the event body and compares character-by-character. Divergent bytes are
        highlighted below — even one flipped nibble in payload bytes propagates to a wholly
        different hash.
      </p>
      <div className="grid md:grid-cols-2 gap-3">
        <HashColumn
          label="reported_hash"
          sublabel="what the chain claims"
          value={step.reportedHash}
          compareTo={step.recomputedHash}
          tone="claim"
        />
        <HashColumn
          label="recomputed_hash"
          sublabel="what your browser computed"
          value={step.recomputedHash}
          compareTo={step.reportedHash}
          tone="truth"
        />
      </div>
      <div className="text-xs text-slate-400 code">
        Diverging hex characters: <strong className="text-rose-300">{countDiff(step.reportedHash, step.recomputedHash)}</strong> of {step.reportedHash.length} ({Math.round((countDiff(step.reportedHash, step.recomputedHash) / step.reportedHash.length) * 100)}% — an avalanche, as expected for SHA-256).
      </div>
    </section>
  );
}

function countDiff(a: string, b: string): number {
  const n = Math.max(a.length, b.length);
  let diff = 0;
  for (let i = 0; i < n; i += 1) {
    if (a[i] !== b[i]) diff += 1;
  }
  return diff;
}

function HashColumn({
  label,
  sublabel,
  value,
  compareTo,
  tone,
}: {
  label: string;
  sublabel: string;
  value: string;
  compareTo: string;
  tone: 'claim' | 'truth';
}) {
  const accent =
    tone === 'truth'
      ? 'border-emerald-500/30 bg-emerald-500/5'
      : 'border-slate-700 bg-slate-950/40';
  const labelTone = tone === 'truth' ? 'text-emerald-300' : 'text-slate-300';
  return (
    <div className={`rounded-lg border ${accent} p-3 space-y-2`}>
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className={`text-[11px] uppercase tracking-wider font-bold code ${labelTone}`}>
            {label}
          </div>
          <div className="text-[11px] text-slate-500">{sublabel}</div>
        </div>
        <CopyButton value={value} />
      </div>
      <div className="font-mono text-[11px] leading-relaxed break-all code text-slate-200">
        {value.split('').map((c, i) => {
          const diff = compareTo[i] !== c;
          return (
            <span
              key={i}
              className={diff ? 'text-rose-300 bg-rose-500/15 rounded-sm px-px' : ''}
            >
              {c}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // clipboard API unavailable — silently ignore
    }
  }
  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-200 px-1.5 py-0.5 rounded code"
      aria-label="Copy hash to clipboard"
    >
      {copied ? <Check size={11} className="text-emerald-300" /> : <Copy size={11} />}
      {copied ? <span className="text-emerald-300">copied</span> : 'copy'}
    </button>
  );
}

function EventCard({ event, step }: { event: GovernanceEvent; step: ChainStep }) {
  const [expanded, setExpanded] = useState(false);
  const kindClass = KIND_ACCENT[event.kind] ?? 'bg-slate-700/40 text-slate-300 border-slate-700';
  const ok = step.status === 'ok';
  return (
    <div
      className={`rounded-xl border-2 ${
        ok ? 'border-slate-800' : 'border-rose-500/50'
      } bg-slate-950/40`}
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full p-4 text-left flex items-start gap-3"
      >
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center code text-sm text-slate-300">
          #{event.event_id}
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border ${kindClass} code`}>
              {event.kind}
            </span>
            <span className="text-xs text-slate-500 code">{event.source}</span>
            <span className="text-xs text-slate-500 code">{event.timestamp}</span>
            {ok ? (
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-300 code">
                <CheckCircle2 size={11} /> ok
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] text-rose-300 code">
                <XCircle size={11} /> {step.status}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Hash size={11} className="text-slate-500" />
            <span className="code">{shortHash(event.hash)}</span>
            <ChevronRight size={12} className="text-slate-600" />
            <span className="code text-slate-500">links to next</span>
          </div>
        </div>
      </button>
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-slate-800 pt-3">
          <KV label="event_id" value={String(event.event_id)} />
          <KV label="kind" value={event.kind} />
          <KV label="source" value={event.source} />
          <KV label="timestamp" value={event.timestamp} />
          <KV label="prev_hash" value={event.prev_hash} mono copyable />
          <KV label="reported hash" value={event.hash} mono copyable />
          <KV
            label="recomputed hash"
            value={step.recomputedHash}
            mono
            copyable
            tone={step.recomputedHash === event.hash ? 'ok' : 'bad'}
          />
          <KV
            label="expected prev_hash"
            value={step.expectedPrevHash}
            mono
            copyable
            tone={step.expectedPrevHash === event.prev_hash ? 'ok' : 'bad'}
          />
          <div className="pt-2">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold code mb-1">
              payload
            </div>
            <pre className="text-[11px] code bg-slate-950 rounded-lg p-3 overflow-x-auto text-slate-300">
              {JSON.stringify(event.payload, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

function KV({
  label,
  value,
  mono,
  tone,
  copyable,
}: {
  label: string;
  value: string;
  mono?: boolean;
  tone?: 'ok' | 'bad';
  copyable?: boolean;
}) {
  const valueClass = tone === 'ok' ? 'text-emerald-300' : tone === 'bad' ? 'text-rose-300' : 'text-slate-200';
  return (
    <div className="grid grid-cols-[160px_1fr] gap-3 items-baseline">
      <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold code">
        {label}
      </div>
      <div className={`text-xs ${mono ? 'code break-all' : ''} ${valueClass} flex items-start gap-2`}>
        <span className="flex-1 min-w-0">{value}</span>
        {copyable && <CopyButton value={value} />}
      </div>
    </div>
  );
}
