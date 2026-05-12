import { useMemo, useState } from 'react';
import { Github, FileJson, Eye, Info, Sparkles, Network, Cpu } from 'lucide-react';

import { detectSpec, SPECS, specInfo, type SpecKey } from './detect';
import { EXAMPLES, AEO_EXAMPLE } from './examples';

import { AeoRenderer } from './renderers/AeoRenderer';
import { PromptProvenanceRenderer } from './renderers/PromptProvenanceRenderer';
import { AgentCardRenderer } from './renderers/AgentCardRenderer';
import { AiEvidenceRenderer } from './renderers/AiEvidenceRenderer';
import { McpToolCardRenderer } from './renderers/McpToolCardRenderer';
import { RawJsonRenderer } from './renderers/RawJsonRenderer';

import { ArchitectureView } from './views/Architecture';
import { ToolsView } from './views/Tools';

type View = 'visualize' | 'editor' | 'architecture' | 'tools' | 'about';

const accentBadge: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-800 border-blue-200',
  emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  violet: 'bg-violet-100 text-violet-800 border-violet-200',
  amber: 'bg-amber-100 text-amber-800 border-amber-200',
  rose: 'bg-rose-100 text-rose-800 border-rose-200',
};

const VALID_VIEWS: View[] = ['visualize', 'editor', 'architecture', 'tools', 'about'];

function pickInitialView(): View {
  if (typeof window === 'undefined') return 'visualize';
  const p = new URLSearchParams(window.location.search).get('view');
  if (p && (VALID_VIEWS as string[]).includes(p)) return p as View;
  return 'visualize';
}

export default function App() {
  const [view, setView] = useState<View>(pickInitialView);
  const [jsonInput, setJsonInput] = useState<string>(JSON.stringify(AEO_EXAMPLE, null, 2));
  const [parseError, setParseError] = useState<string | null>(null);

  const parsed = useMemo<unknown>(() => {
    try {
      const value = JSON.parse(jsonInput);
      setParseError(null);
      return value;
    } catch (err) {
      setParseError(err instanceof Error ? err.message : 'JSON parse error');
      return null;
    }
  }, [jsonInput]);

  const detected = useMemo<SpecKey>(() => detectSpec(parsed), [parsed]);
  const info = specInfo(detected);

  function loadExample(key: Exclude<SpecKey, 'unknown'>) {
    setJsonInput(JSON.stringify(EXAMPLES[key], null, 2));
    setView('visualize');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md">
              <Sparkles size={22} />
            </div>
            <div>
              <h1 className="font-bold text-base leading-tight">Kinetic Gain Protocol Suite</h1>
              <p className="text-[10px] tracking-widest uppercase text-slate-500 code">Unified Visualizer</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <NavBtn icon={Eye} label="Visualize" active={view === 'visualize'} onClick={() => setView('visualize')} />
            <NavBtn icon={FileJson} label="Editor" active={view === 'editor'} onClick={() => setView('editor')} />
            <NavBtn icon={Network} label="Architecture" active={view === 'architecture'} onClick={() => setView('architecture')} />
            <NavBtn icon={Cpu} label="Tools" active={view === 'tools'} onClick={() => setView('tools')} />
            <NavBtn icon={Info} label="About" active={view === 'about'} onClick={() => setView('about')} />
          </div>
          <a
            href="https://github.com/mizcausevic-dev"
            target="_blank"
            rel="noreferrer"
            className="p-2 text-slate-600 hover:text-slate-900"
            aria-label="GitHub"
          >
            <Github size={20} />
          </a>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {view === 'visualize' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="text-sm text-slate-500">Detected spec:</div>
              {info ? (
                <span className={`px-3 py-1 rounded-full border text-sm font-medium ${accentBadge[info.accent] ?? ''}`}>
                  {info.displayName} v{(parsed as Record<string, string>)[info.versionField]}
                </span>
              ) : parseError ? (
                <span className="px-3 py-1 rounded-full border bg-red-50 text-red-700 border-red-200 text-sm">
                  invalid JSON
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full border bg-slate-100 text-slate-600 border-slate-200 text-sm">
                  unknown — no <code className="code">*_version</code> field detected
                </span>
              )}
              {info && (
                <a
                  href={info.specRepo}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-slate-500 hover:text-slate-900 underline underline-offset-2"
                >
                  view spec ↗
                </a>
              )}
            </div>

            {parseError ? (
              <ErrorCard message={parseError} />
            ) : detected === 'aeo' ? (
              <AeoRenderer doc={parsed as never} />
            ) : detected === 'prompt-provenance' ? (
              <PromptProvenanceRenderer doc={parsed as never} />
            ) : detected === 'agent-card' ? (
              <AgentCardRenderer doc={parsed as never} />
            ) : detected === 'ai-evidence' ? (
              <AiEvidenceRenderer doc={parsed as never} />
            ) : detected === 'mcp-tool-card' ? (
              <McpToolCardRenderer doc={parsed as never} />
            ) : (
              <RawJsonRenderer doc={parsed} />
            )}
          </div>
        )}

        {view === 'editor' && (
          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <span className="text-xs uppercase tracking-widest text-slate-500 code">JSON document</span>
                  {parseError && <span className="text-xs text-red-600">{parseError}</span>}
                </div>
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="w-full h-[600px] bg-white p-4 font-mono text-sm leading-relaxed focus:outline-none resize-none code"
                  spellCheck={false}
                />
              </div>
            </div>
            <aside className="lg:col-span-4 space-y-3">
              <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Load example</h2>
              {Object.values(SPECS).map((s) => (
                <button
                  key={s.key}
                  onClick={() => loadExample(s.key)}
                  className={`w-full text-left px-4 py-3 rounded-xl border ${accentBadge[s.accent]} hover:scale-[1.01] transition-transform`}
                >
                  <div className="font-semibold text-sm">{s.displayName}</div>
                  <div className="text-xs opacity-70 code mt-1">{s.versionField}</div>
                </button>
              ))}
              <p className="text-xs text-slate-500 pt-2">
                The visualizer detects the spec automatically by inspecting the top-level <code className="code">*_version</code> field.
              </p>
            </aside>
          </div>
        )}

        {view === 'architecture' && <ArchitectureView />}
        {view === 'tools' && <ToolsView />}
        {view === 'about' && <AboutView />}
      </main>

      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 text-xs text-slate-500 flex flex-wrap items-center gap-3">
          <span>Built for the <strong className="text-slate-700">Kinetic Gain Protocol Suite</strong>.</span>
          <span>·</span>
          <a className="hover:text-slate-900" href="https://www.linkedin.com/in/mirzacausevic/" target="_blank" rel="noreferrer">LinkedIn</a>
          <a className="hover:text-slate-900" href="https://kineticgain.com" target="_blank" rel="noreferrer">Kinetic Gain</a>
          <a className="hover:text-slate-900" href="https://medium.com/@mizcausevic/" target="_blank" rel="noreferrer">Medium</a>
          <a className="hover:text-slate-900" href="https://mizcausevic.com/skills/" target="_blank" rel="noreferrer">Skills</a>
        </div>
      </footer>
    </div>
  );
}

function NavBtn({ icon: Icon, label, active, onClick }: { icon: typeof Eye; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
        active ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
      }`}
    >
      <Icon size={16} /> {label}
    </button>
  );
}

function ErrorCard({ message }: { message: string }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
      <h3 className="font-semibold text-red-800 mb-1">Could not parse JSON</h3>
      <p className="text-sm text-red-700 code">{message}</p>
      <p className="text-sm text-red-700 mt-3">Switch to the <strong>Editor</strong> tab and fix the document, or load a canonical example.</p>
    </div>
  );
}

function AboutView() {
  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">One visualizer. Five specs.</h1>
        <p className="text-slate-600 leading-relaxed">
          The Kinetic Gain Protocol Suite is a family of open JSON specifications for the answer-engine era:
          entity declaration, prompt lineage, agent capability disclosure, citation evidence, and MCP tool disclosure.
          This visualizer accepts a document for any of the five and dispatches to the right renderer based on the
          top-level <code className="code">*_version</code> field.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {Object.values(SPECS).map((s) => (
          <a
            key={s.key}
            href={s.specRepo}
            target="_blank"
            rel="noreferrer"
            className={`block px-4 py-4 rounded-2xl border ${accentBadge[s.accent]} hover:scale-[1.01] transition-transform`}
          >
            <div className="font-semibold text-base">{s.displayName}</div>
            <div className="text-xs code opacity-70 mt-1">detect via <strong>{s.versionField}</strong></div>
            <div className="text-xs mt-2 underline opacity-80">view specification ↗</div>
          </a>
        ))}
      </div>

      <div className="bg-slate-900 text-slate-100 rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-2">Detection model</h2>
        <p className="text-sm text-slate-300 mb-3">
          Auto-detection is trivial: each spec carries a stable top-level version field. The visualizer reads
          that field, picks the renderer, and degrades to a raw-JSON view if the document doesn't match any
          known spec.
        </p>
        <pre className="text-xs code bg-slate-950 rounded-lg p-3 overflow-x-auto">
{`{
  "aeo_version":          "0.1"   →  AEO Protocol
  "provenance_version":   "0.1"   →  Prompt Provenance
  "agent_card_version":   "0.1"   →  Agent Cards
  "evidence_version":     "0.1"   →  AI Evidence Format
  "tool_card_version":    "0.1"   →  MCP Tool Cards
}`}
        </pre>
      </div>
    </div>
  );
}
