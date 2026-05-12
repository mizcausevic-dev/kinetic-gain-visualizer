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
        ? 'bg-amber-50 border-amber-200'
        : 'bg-white border-slate-200';
  return (
    <section className={`rounded-2xl border p-6 shadow-sm ${toneClass}`}>
      {title && (
        <header className="mb-4">
          <h3 className={`text-lg font-semibold ${tone === 'authority' ? 'text-slate-100' : 'text-slate-900'}`}>{title}</h3>
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
      <div className={`col-span-2 text-sm text-slate-800 ${mono ? 'code break-all' : ''}`}>{value ?? <span className="text-slate-400">—</span>}</div>
    </div>
  );
}

export function Pill({ children, tone = 'slate' }: { children: ReactNode; tone?: 'slate' | 'green' | 'amber' | 'red' | 'blue' | 'violet' | 'rose' }) {
  const styles: Record<string, string> = {
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-800 border-amber-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    violet: 'bg-violet-50 text-violet-700 border-violet-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
  };
  return <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${styles[tone]}`}>{children}</span>;
}

export function LinkList({ items }: { items: string[] }) {
  if (!items || items.length === 0) return <span className="text-slate-400 text-sm">—</span>;
  return (
    <ul className="space-y-1">
      {items.map((u) => (
        <li key={u} className="code text-sm break-all">
          <a className="text-blue-600 hover:underline" href={u} target="_blank" rel="noreferrer">
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
          <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-xs code">
            {typeof v === 'object' ? JSON.stringify(v) : String(v)}
          </span>
        ))}
      </div>
    );
  }
  return (
    <pre className="text-xs code bg-slate-50 rounded p-2 overflow-x-auto border border-slate-200">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}
