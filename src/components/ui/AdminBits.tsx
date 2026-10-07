import type { ReactNode } from 'react';
import { Panel } from './Panel';

export function AdminTitle({ title, action }: { title: string; action?: ReactNode }) {
  return <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><h1 className="font-title text-3xl text-white">{title}</h1>{action}</div>;
}
export const TableShell = ({ children }: { children: ReactNode }) => <Panel innerClassName="overflow-x-auto p-2">{children}</Panel>;

export function BarChart({ data, title }: { data: { label: string; value: number }[]; title: string }) {
  const max = Math.max(1, ...data.map(d => d.value));
  return (
    <Panel innerClassName="p-5">
      <h3 className="mb-4 font-display text-lg font-bold uppercase text-white">{title}</h3>
      <svg viewBox={`0 0 ${data.length * 56} 160`} role="img" aria-label={title} className="h-40 w-full">
        {data.map((d, i) => { const h = (d.value / max) * 110; return (
          <g key={d.label}><rect x={i * 56 + 10} y={130 - h} width="34" height={h} fill="#39FF14" opacity=".85" /><text x={i * 56 + 27} y={124 - h} textAnchor="middle" fontSize="11" fill="#E7FFF2">{d.value}</text><text x={i * 56 + 27} y="150" textAnchor="middle" fontSize="10" fill="#A8B8B1">{d.label}</text></g>); })}
      </svg>
    </Panel>
  );
}
export const IconBtn = ({ label, onClick, danger, children }: { label: string; onClick: () => void; danger?: boolean; children: ReactNode }) => (
  <button onClick={onClick} aria-label={label} title={label} className={`grid h-8 w-8 place-items-center border border-neon/30 transition ${danger ? 'hover:border-red-500 hover:text-red-400' : 'hover:border-neon hover:text-neon'}`}>{children}</button>
);
