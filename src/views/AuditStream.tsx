import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Hash,
  RotateCcw,
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

  if (!events || !result) {
    return (
      <div className="text-sm text-slate-400">Computing canonical hashes…</div>
    );
  }

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
        </div>
        {result.reason && (
          <div className="flex items-start gap-2 text-sm text-amber-200 bg-amber-500/5 border border-amber-500/30 rounded-lg p-3">
            <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
            <span>{result.reason}</span>
          </div>
        )}
      </section>

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
            <strong className="text-slate-100">No backend.</strong> Verification runs in-browser
            via <code className="code">crypto.subtle.digest('SHA-256', …)</code>. There is no
            server call. The chain you're inspecting is the chain you're verifying.
          </li>
        </ul>
      </section>
    </div>
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
          <KV label="prev_hash" value={event.prev_hash} mono />
          <KV label="reported hash" value={event.hash} mono />
          <KV
            label="recomputed hash"
            value={step.recomputedHash}
            mono
            tone={
              step.recomputedHash === event.hash
                ? 'ok'
                : 'bad'
            }
          />
          <KV
            label="expected prev_hash"
            value={step.expectedPrevHash}
            mono
            tone={
              step.expectedPrevHash === event.prev_hash
                ? 'ok'
                : 'bad'
            }
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
}: {
  label: string;
  value: string;
  mono?: boolean;
  tone?: 'ok' | 'bad';
}) {
  const valueClass = tone === 'ok' ? 'text-emerald-300' : tone === 'bad' ? 'text-rose-300' : 'text-slate-200';
  return (
    <div className="grid grid-cols-[160px_1fr] gap-3 items-baseline">
      <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold code">
        {label}
      </div>
      <div className={`text-xs ${mono ? 'code break-all' : ''} ${valueClass}`}>{value}</div>
    </div>
  );
}
