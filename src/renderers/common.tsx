// Shared building blocks for spec renderers.
import type { ReactNode } from 'react';

export function Card({
  title,
  subtitle,
  children,
  tone = 'default',
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  tone?: 'default' | 'authority' | 'warning';
}) {
  const toneClass =
    tone === 'authority'
      ? 'bg-slate-900 text-slate-100'
      : tone === 'warning'
        ? 'bg-amber-500/10 border-amber-500/30'
        : 'bg-slate-900/60 border-slate-800';
  return (
    <section className={`rounded-2xl border p-6 shadow-sm ${toneClass}`}>
      {title && (
        <header className="mb-4">
          <h3 className={`text-lg font-semibold ${tone === 'authority' ? 'text-slate-100' : 'text-white'}`}>{title}</h3>
          {subtitle && <p className={`text-xs uppercase tracking-widest mt-1 ${tone === 'authority' ? 'text-slate-400' : 'text-slate-500'}`}>{subtitle}</p>}
        </header>
      )}
      {children}
    </section>
  );
}

export function Field({ label, value, mono = false }: { label: string; value: ReactNode; mono?: boolean }) {
  return (
    <div className="grid grid-cols-3 gap-3 py-1.5">
      <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">{label}</div>
      <div className={`col-span-2 text-sm text-slate-200 ${mono ? 'code break-all' : ''}`}>{value ?? <span className="text-slate-400">—</span>}</div>
    </div>
  );
}

export function Pill({ children, tone = 'slate' }: { children: ReactNode; tone?: 'slate' | 'green' | 'amber' | 'red' | 'blue' | 'violet' | 'rose' }) {
  const styles: Record<string, string> = {
    slate: 'bg-slate-800 text-slate-300 border-slate-800',
    green: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    amber: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    red: 'bg-red-500/10 text-red-300 border-red-500/30',
    blue: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
    violet: 'bg-violet-500/10 text-violet-300 border-violet-500/30',
    rose: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
  };
  return <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${styles[tone]}`}>{children}</span>;
}

export function LinkList({ items }: { items: string[] }) {
  if (!items || items.length === 0) return <span className="text-slate-400 text-sm">—</span>;
  return (
    <ul className="space-y-1">
      {items.map((u) => (
        <li key={u} className="code text-sm break-all">
          <a className="text-blue-400 hover:underline" href={u} target="_blank" rel="noreferrer">
            {u}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function ValueRender({ value }: { value: unknown }) {
  if (value === null || value === undefined) return <span className="text-slate-400">—</span>;
  if (typeof value === 'string') return <span>{value}</span>;
  if (typeof value === 'number') return <span className="code">{value}</span>;
  if (typeof value === 'boolean') return <Pill tone={value ? 'green' : 'slate'}>{value ? 'true' : 'false'}</Pill>;
  if (Array.isArray(value)) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {value.map((v, i) => (
          <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-800 text-xs code">
            {typeof v === 'object' ? JSON.stringify(v) : String(v)}
          </span>
        ))}
      </div>
    );
  }
  return (
    <pre className="text-xs code bg-slate-950 rounded p-2 overflow-x-auto border border-slate-800">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}
