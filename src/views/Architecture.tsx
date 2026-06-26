import { ExternalLink, Hexagon, Network, Server } from 'lucide-react';

import { MCP_SERVER_REPO, PROTOCOLS, TOTAL_TOOL_COUNT } from '../protocol-data';

const accentRing: Record<string, string> = {
  blue: 'border-blue-300 hover:border-blue-500',
  emerald: 'border-emerald-300 hover:border-emerald-500',
  violet: 'border-violet-300 hover:border-violet-500',
  amber: 'border-amber-300 hover:border-amber-500',
  rose: 'border-rose-300 hover:border-rose-500',
  teal: 'border-teal-300 hover:border-teal-500',
  indigo: 'border-indigo-300 hover:border-indigo-500',
  fuchsia: 'border-fuchsia-300 hover:border-fuchsia-500',
  cyan: 'border-cyan-300 hover:border-cyan-500',
  red: 'border-red-300 hover:border-red-500',
  purple: 'border-purple-300 hover:border-purple-500',
};

const accentDot: Record<string, string> = {
  blue: 'bg-blue-500/100',
  emerald: 'bg-emerald-500/100',
  violet: 'bg-violet-500/100',
  amber: 'bg-amber-500/100',
  rose: 'bg-rose-500/100',
  teal: 'bg-teal-500',
  indigo: 'bg-indigo-500',
  fuchsia: 'bg-fuchsia-500',
  cyan: 'bg-cyan-500',
  red: 'bg-red-500/100',
  purple: 'bg-purple-500',
};

const accentText: Record<string, string> = {
  blue: 'text-blue-300',
  emerald: 'text-emerald-300',
  violet: 'text-violet-300',
  amber: 'text-amber-300',
  rose: 'text-rose-300',
  teal: 'text-teal-700',
  indigo: 'text-indigo-700',
  fuchsia: 'text-fuchsia-700',
  cyan: 'text-cyan-700',
  red: 'text-red-300',
  purple: 'text-purple-700',
};

export function ArchitectureView() {
  return (
    <div className="space-y-10">
      <header className="space-y-3 max-w-3xl">
        <div className="text-xs uppercase tracking-widest text-slate-500 font-semibold code">
          Infrastructure layer
        </div>
        <h1 className="text-3xl font-bold tracking-tight">One server, eleven specs.</h1>
        <p className="text-slate-400 leading-relaxed">
          The Kinetic Gain Protocol Suite multiplexes eleven independent JSON specifications into a single
          runtime: <a className="text-blue-400 underline underline-offset-2 hover:text-blue-300 code" href={MCP_SERVER_REPO} target="_blank" rel="noreferrer">mcp-kinetic-gain</a>.
          Five core specs cover entity, prompt, agent, evidence, and tool disclosure; an EdTech trio
          (Tutor Cards · Student AI Disclosure · Classroom AI AUP) closes the vendor / district / student
          loop; a HealthTech extension (Clinical AI Disclosure) extends the pattern into regulated clinical
          contexts; and two cross-cutting specs frame the procurement loop, vendor-side <strong>AI Incident
          Card</strong> and buyer-side <strong>AI Procurement Decision Card</strong>. Total surface:{' '}
          <strong>{TOTAL_TOOL_COUNT} tools</strong>.
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 items-stretch">
        {/* Hub */}
        <div className="lg:col-span-5">
          <div className="h-full rounded-3xl bg-slate-900 text-slate-100 p-8 shadow-lg flex flex-col">
            <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-4">
              <Server size={12} /> Core
            </div>
            <h2 className="text-2xl font-bold mb-1 tracking-tight">mcp-kinetic-gain</h2>
            <p className="text-xs text-slate-400 code">v0.8.0 · stdio MCP server</p>

            <div className="my-8 flex items-center justify-center flex-1">
              <div className="relative w-44 h-44">
                {/* Outer rotating ring */}
                <div className="absolute inset-0 rounded-full border border-emerald-500/20" />
                <div className="absolute inset-3 rounded-full border border-dashed border-slate-700" />
                {/* Inner badge */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-28 h-28 rounded-full bg-emerald-500/100/10 border border-emerald-500/40 flex items-center justify-center">
                    <Hexagon className="text-emerald-400" size={48} />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 grid grid-cols-3 gap-3 text-center text-xs">
              <div>
                <div className="text-2xl font-bold text-emerald-400">{PROTOCOLS.length}</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">Specs</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-400">{TOTAL_TOOL_COUNT}</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">Tools</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-400">1</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">Config entry</div>
              </div>
            </div>
          </div>
        </div>

        {/* Spokes */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500 font-semibold">
            <Network size={14} /> Protocol stack
          </div>
          {PROTOCOLS.map((p) => (
            <a
              key={p.key}
              href={p.specRepo}
              target="_blank"
              rel="noreferrer"
              className={`block group bg-slate-900/60 border-2 ${accentRing[p.accent]} rounded-2xl p-5 transition-all hover:shadow-md`}
            >
              <div className="flex items-start gap-4">
                <div className={`mt-1 w-3 h-3 rounded-full ${accentDot[p.accent]} flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-3 mb-1">
                    <h3 className={`font-semibold text-base ${accentText[p.accent]}`}>{p.displayName}</h3>
                    <span className="text-xs text-slate-500 code whitespace-nowrap">
                      {p.toolCount} {p.toolCount === 1 ? 'tool' : 'tools'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2 code">{p.fullName}</p>
                  <p className="text-sm text-slate-300 leading-relaxed mb-3">{p.shortBlurb}</p>
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 code">
                      detect: <strong>{p.versionField}</strong>
                    </span>
                    {p.wellKnownPath ? (
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 code">
                        well-known: <strong>{p.wellKnownPath}</strong>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-500 code italic">
                        parse-only (no fixed location)
                      </span>
                    )}
                  </div>
                </div>
                <ExternalLink
                  size={16}
                  className="text-slate-400 group-hover:text-white transition-colors mt-1"
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
