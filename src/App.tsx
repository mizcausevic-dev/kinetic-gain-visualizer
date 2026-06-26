import { useMemo, useState } from 'react';
import { Github, FileJson, Eye, Info, Sparkles, Network, Cpu, Activity } from 'lucide-react';

import { detectSpec, SPECS, specInfo, type SpecKey } from './detect';
import { EXAMPLES, AEO_EXAMPLE } from './examples';

import { AeoRenderer } from './renderers/AeoRenderer';
import { PromptProvenanceRenderer } from './renderers/PromptProvenanceRenderer';
import { AgentCardRenderer } from './renderers/AgentCardRenderer';
import { AiEvidenceRenderer } from './renderers/AiEvidenceRenderer';
import { McpToolCardRenderer } from './renderers/McpToolCardRenderer';
import { TutorCardRenderer } from './renderers/TutorCardRenderer';
import { DisclosureRenderer } from './renderers/DisclosureRenderer';
import { ClassroomAupRenderer } from './renderers/ClassroomAupRenderer';
import { ClinicalAiRenderer } from './renderers/ClinicalAiRenderer';
import { IncidentCardRenderer } from './renderers/IncidentCardRenderer';
import { DecisionCardRenderer } from './renderers/DecisionCardRenderer';
import { RawJsonRenderer } from './renderers/RawJsonRenderer';

import { ArchitectureView } from './views/Architecture';
import { ToolsView } from './views/Tools';
import { AuditStreamView } from './views/AuditStream';

type View = 'visualize' | 'editor' | 'architecture' | 'tools' | 'audit-stream' | 'about';

const accentBadge: Record<string, string> = {
  blue: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  emerald: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  violet: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
  amber: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  rose: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  teal: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
  indigo: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  fuchsia: 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30',
  cyan: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  red: 'bg-red-500/15 text-red-300 border-red-500/30',
  purple: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
};

const VALID_VIEWS: View[] = ['visualize', 'editor', 'architecture', 'tools', 'audit-stream', 'about'];

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
      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-900/40">
              <Sparkles size={22} />
            </div>
            <div>
              <h1 className="font-bold text-base leading-tight">Kinetic Gain Protocol Suite</h1>
              <p className="text-[10px] tracking-widest uppercase text-slate-500 code">Unified Visualizer</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-1 p-1 bg-slate-800 rounded-lg">
            <NavBtn icon={Eye} label="Visualize" active={view === 'visualize'} onClick={() => setView('visualize')} />
            <NavBtn icon={FileJson} label="Editor" active={view === 'editor'} onClick={() => setView('editor')} />
            <NavBtn icon={Network} label="Architecture" active={view === 'architecture'} onClick={() => setView('architecture')} />
            <NavBtn icon={Cpu} label="Tools" active={view === 'tools'} onClick={() => setView('tools')} />
            <NavBtn icon={Activity} label="Audit Stream" active={view === 'audit-stream'} onClick={() => setView('audit-stream')} />
            <NavBtn icon={Info} label="About" active={view === 'about'} onClick={() => setView('about')} />
          </div>
          <a
            href="https://github.com/mizcausevic-dev"
            target="_blank"
            rel="noreferrer"
            className="p-2 text-slate-400 hover:text-white"
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
                <span className="px-3 py-1 rounded-full border bg-red-500/10 text-red-300 border-red-500/30 text-sm">
                  invalid JSON
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full border bg-slate-800 text-slate-400 border-slate-800 text-sm">
                  unknown, no <code className="code">*_version</code> field detected
                </span>
              )}
              {info && (
                <a
                  href={info.specRepo}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-slate-500 hover:text-white underline underline-offset-2"
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
            ) : detected === 'tutor-card' ? (
              <TutorCardRenderer doc={parsed as never} />
            ) : detected === 'student-ai-disclosure' ? (
              <DisclosureRenderer doc={parsed as never} />
            ) : detected === 'classroom-aup' ? (
              <ClassroomAupRenderer doc={parsed as never} />
            ) : detected === 'clinical-ai' ? (
              <ClinicalAiRenderer doc={parsed as never} />
            ) : detected === 'ai-incident-card' ? (
              <IncidentCardRenderer doc={parsed as never} />
            ) : detected === 'decision-card' ? (
              <DecisionCardRenderer doc={parsed as never} />
            ) : (
              <RawJsonRenderer doc={parsed} />
            )}
          </div>
        )}

        {view === 'editor' && (
          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <div className="bg-slate-900/60 rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
                <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between bg-slate-950">
                  <span className="text-xs uppercase tracking-widest text-slate-500 code">JSON document</span>
                  {parseError && <span className="text-xs text-red-400">{parseError}</span>}
                </div>
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="w-full h-[600px] bg-slate-900/60 p-4 font-mono text-sm leading-relaxed focus:outline-none resize-none code"
                  spellCheck={false}
                />
              </div>
            </div>
            <aside className="lg:col-span-4 space-y-3">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Load example</h2>
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
        {view === 'audit-stream' && <AuditStreamView />}
        {view === 'about' && <AboutView />}
      </main>

      <footer className="border-t border-slate-800 bg-slate-900/60 py-6">
        <div className="max-w-7xl mx-auto px-4 text-xs text-slate-500 flex flex-wrap items-center gap-3">
          <span>Built for the <a className="hover:text-white" href="https://suite.kineticgain.com" target="_blank" rel="noreferrer"><strong className="text-slate-300">Kinetic Gain Protocol Suite</strong></a>.</span>
          <span>·</span>
          <a className="hover:text-white" href="https://www.linkedin.com/in/mirzacausevic/" target="_blank" rel="noreferrer">LinkedIn</a>
          <a className="hover:text-white" href="https://kineticgain.com" target="_blank" rel="noreferrer">Kinetic Gain</a>
          <a className="hover:text-white" href="https://medium.com/@mizcausevic/" target="_blank" rel="noreferrer">Medium</a>
          <a className="hover:text-white" href="https://mizcausevic.com/skills/" target="_blank" rel="noreferrer">Skills</a>
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
        active ? 'bg-slate-950 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
      }`}
    >
      <Icon size={16} /> {label}
    </button>
  );
}

function ErrorCard({ message }: { message: string }) {
  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
      <h3 className="font-semibold text-red-300 mb-1">Could not parse JSON</h3>
      <p className="text-sm text-red-300 code">{message}</p>
      <p className="text-sm text-red-300 mt-3">Switch to the <strong>Editor</strong> tab and fix the document, or load a canonical example.</p>
    </div>
  );
}

function AboutView() {
  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">One visualizer. Eleven specs.</h1>
        <p className="text-slate-400 leading-relaxed">
          The Kinetic Gain Protocol Suite is a family of open JSON specifications for the answer-engine era:
          five core specs (AEO entity declaration, Prompt Provenance, Agent Cards, AI Evidence Format, MCP Tool Cards),
          a three-spec EdTech trio (AI Tutor Cards, Student AI Disclosure, Classroom AI AUP), a HealthTech extension
          (Clinical AI Disclosure), and two cross-cutting specs, the vendor-side <strong>AI Incident Card</strong> and
          the buyer-side <strong>AI Procurement Decision Card</strong> (v0.2 adds a Skyflow-shaped{' '}
          <code className="code">data_vault_targets[]</code> field declaring which PII fields may be vaulted and which
          roles may detokenize). This visualizer accepts a document for any of the eleven and dispatches to the right
          renderer based on the top-level <code className="code">*_version</code> field.
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
  "aeo_version":              "0.1"   →  AEO Protocol
  "provenance_version":       "0.1"   →  Prompt Provenance
  "agent_card_version":       "0.1"   →  Agent Cards
  "evidence_version":         "0.1"   →  AI Evidence Format
  "tool_card_version":        "0.1"   →  MCP Tool Cards
  "tutor_card_version":       "0.1"   →  AI Tutor Cards
  "disclosure_version":       "0.1"   →  Student AI Disclosure
  "aup_version":              "0.1"   →  Classroom AI AUP
  "clinical_ai_version":      "0.1"   →  Clinical AI Disclosure
  "incident_card_version":    "0.1"   →  AI Incident Card
  "decision_card_version":    "0.2"   →  AI Procurement Decision Card
}`}
        </pre>
      </div>
    </div>
  );
}
