import { useMemo, useState } from 'react';
import { ChevronDown, Cpu, Search, X } from 'lucide-react';

import { PROTOCOLS, TOOLS, type ToolSpec, type ProtocolAccent } from '../protocol-data';

const accentBadge: Record<ProtocolAccent, string> = {
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  violet: 'bg-violet-50 text-violet-700 border-violet-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  rose: 'bg-rose-50 text-rose-700 border-rose-200',
  teal: 'bg-teal-50 text-teal-700 border-teal-200',
  indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
};

const accentBorder: Record<ProtocolAccent, string> = {
  blue: 'border-blue-300',
  emerald: 'border-emerald-300',
  violet: 'border-violet-300',
  amber: 'border-amber-300',
  rose: 'border-rose-300',
  teal: 'border-teal-300',
  indigo: 'border-indigo-300',
};

const accentLeft: Record<ProtocolAccent, string> = {
  blue: 'border-l-blue-500',
  emerald: 'border-l-emerald-500',
  violet: 'border-l-violet-500',
  amber: 'border-l-amber-500',
  rose: 'border-l-rose-500',
  teal: 'border-l-teal-500',
  indigo: 'border-l-indigo-500',
};

const protocolByKey = new Map(PROTOCOLS.map((p) => [p.key, p]));

export function ToolsView() {
  const [selectedProtocol, setSelectedProtocol] = useState<string | 'all'>('all');
  const [query, setQuery] = useState('');
  const [expandedTool, setExpandedTool] = useState<string | null>(null);

  const filteredTools = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TOOLS.filter((t) => {
      if (selectedProtocol !== 'all' && t.protocol !== selectedProtocol) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.inputs.some((i) => i.name.toLowerCase().includes(q))
      );
    });
  }, [selectedProtocol, query]);

  return (
    <div className="space-y-6">
      <header className="space-y-3 max-w-3xl">
        <div className="text-xs uppercase tracking-widest text-slate-500 font-semibold code">
          Tool catalog
        </div>
        <h1 className="text-3xl font-bold tracking-tight">All {TOOLS.length} tools, searchable.</h1>
        <p className="text-slate-600 leading-relaxed">
          Every tool exposed by <code className="code">mcp-kinetic-gain</code> across the seven Kinetic Gain
          Protocol Suite specs. Click a tool card to see its input parameters.
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="lg:col-span-3 space-y-4">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2 code">
              Protocol
            </div>
            <div className="flex flex-col">
              <SidebarBtn
                label="All tools"
                count={TOOLS.length}
                active={selectedProtocol === 'all'}
                onClick={() => setSelectedProtocol('all')}
              />
              {PROTOCOLS.map((p) => (
                <SidebarBtn
                  key={p.key}
                  label={p.displayName}
                  count={p.toolCount}
                  active={selectedProtocol === p.key}
                  accent={p.accent}
                  onClick={() => setSelectedProtocol(p.key)}
                />
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3 code">
              Per-spec coverage
            </div>
            <div className="space-y-3">
              {PROTOCOLS.map((p) => (
                <div key={p.key}>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-700">{p.displayName}</span>
                    <span className="text-slate-400 code">{p.toolCount}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${barColor(p.accent)}`}
                      style={{ width: `${(p.toolCount / 6) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="lg:col-span-9 space-y-4">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-white">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              placeholder="Filter tools by name, description, or parameter"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-slate-400"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-slate-400 hover:text-slate-700"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
            <span className="text-xs text-slate-500 code whitespace-nowrap">
              {filteredTools.length} {filteredTools.length === 1 ? 'match' : 'matches'}
            </span>
          </div>

          {filteredTools.length === 0 ? (
            <div className="py-16 text-center bg-white border border-dashed border-slate-300 rounded-xl">
              <p className="text-sm text-slate-500">
                No tools match <code className="code">{query}</code> in this protocol filter.
              </p>
              <button
                onClick={() => {
                  setQuery('');
                  setSelectedProtocol('all');
                }}
                className="mt-3 text-xs text-blue-600 hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {filteredTools.map((t) => (
                <ToolCard
                  key={t.name}
                  tool={t}
                  expanded={expandedTool === t.name}
                  onToggle={() => setExpandedTool((cur) => (cur === t.name ? null : t.name))}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SidebarBtn({
  label,
  count,
  active,
  accent,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  accent?: ProtocolAccent;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors border-l-2 ${
        active
          ? `bg-slate-100 text-slate-900 ${accent ? accentLeft[accent] : 'border-l-slate-900'}`
          : 'border-l-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <span className="font-medium">{label}</span>
      <span className="text-xs text-slate-400 code">{count}</span>
    </button>
  );
}

function ToolCard({ tool, expanded, onToggle }: { tool: ToolSpec; expanded: boolean; onToggle: () => void }) {
  const protocol = protocolByKey.get(tool.protocol);
  if (!protocol) return null;
  return (
    <div
      className={`bg-white rounded-xl border-2 ${accentBorder[protocol.accent]} hover:shadow-md transition-all cursor-pointer`}
      onClick={onToggle}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <Cpu size={14} className="text-slate-400 flex-shrink-0" />
            <h3 className="font-semibold code text-sm text-slate-900 truncate">{tool.name}</h3>
          </div>
          <ChevronDown
            size={16}
            className={`text-slate-400 flex-shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`}
          />
        </div>
        <p className="text-xs text-slate-600 leading-relaxed mb-3">{tool.description}</p>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border ${accentBadge[protocol.accent]}`}>
            {protocol.displayName}
          </span>
          <span className="text-[10px] text-slate-400 code">
            {tool.inputs.length} {tool.inputs.length === 1 ? 'param' : 'params'}
          </span>
        </div>

        {expanded && (
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2 code">
              Input parameters
            </div>
            <div className="space-y-2">
              {tool.inputs.map((i) => (
                <div key={i.name} className="text-xs">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className="font-semibold code text-slate-900">{i.name}</span>
                    <span className="text-[10px] text-slate-500 code">{i.type}</span>
                    {i.required ? (
                      <span className="text-[10px] text-rose-600 font-semibold">required</span>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">optional</span>
                    )}
                  </div>
                  <div className="text-slate-600 leading-relaxed pl-0.5">{i.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function barColor(accent: ProtocolAccent): string {
  switch (accent) {
    case 'blue':
      return 'bg-blue-500';
    case 'emerald':
      return 'bg-emerald-500';
    case 'violet':
      return 'bg-violet-500';
    case 'amber':
      return 'bg-amber-500';
    case 'rose':
      return 'bg-rose-500';
    case 'teal':
      return 'bg-teal-500';
    case 'indigo':
      return 'bg-indigo-500';
  }
}
