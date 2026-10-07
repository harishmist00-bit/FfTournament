import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

export function SearchBar({ value, onChange, placeholder = 'Search' }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="relative block w-full sm:max-w-xs">
      <span className="sr-only">{placeholder}</span>
      <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neon" aria-hidden />
      <input type="search" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="input-hud pl-10" />
    </label>
  );
}

interface FilterProps<T extends string> { options: readonly T[]; value: T; onChange: (v: T) => void; label: string }
export function FilterBar<T extends string>({ options, value, onChange, label }: FilterProps<T>) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map(o => (
        <button key={o} aria-pressed={o === value} onClick={() => onChange(o)}
          className={`clip-cut-sm border px-4 py-1.5 font-display text-sm font-bold uppercase tracking-wider transition ${o === value ? 'border-neon bg-neon text-void' : 'border-neon/40 text-mist hover:border-neon hover:text-neon'}`}>
          {o}
        </button>
      ))}
    </div>
  );
}

export function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <label className="block text-sm text-dim">
      <span className="mb-1 block uppercase tracking-wider">{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)} className="input-hud !py-2.5">
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

export function Pagination({ page, pageCount, onChange }: { page: number; pageCount: number; onChange: (p: number) => void }) {
  if (pageCount <= 1) return null;
  const btn = 'grid h-10 min-w-10 place-items-center border px-2 font-display font-bold transition';
  return (
    <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-2">
      <button className={`${btn} border-neon/40 hover:border-neon disabled:opacity-40`} disabled={page === 1} onClick={() => onChange(page - 1)} aria-label="Previous page"><ChevronLeft size={18} /></button>
      {Array.from({ length: pageCount }, (_, i) => i + 1).map(p => (
        <button key={p} onClick={() => onChange(p)} aria-current={p === page ? 'page' : undefined}
          className={`${btn} ${p === page ? 'border-neon bg-neon text-void' : 'border-neon/40 hover:border-neon'}`}>{p}</button>
      ))}
      <button className={`${btn} border-neon/40 hover:border-neon disabled:opacity-40`} disabled={page === pageCount} onClick={() => onChange(page + 1)} aria-label="Next page"><ChevronRight size={18} /></button>
    </nav>
  );
}
