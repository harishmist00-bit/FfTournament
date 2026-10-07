import type { InputHTMLAttributes, ReactNode } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> { label: string; error?: string; hint?: ReactNode }

export function FormField({ label, error, hint, id, ...rest }: Props) {
  const fid = id ?? `f-${label.toLowerCase().replace(/\W+/g, '-')}`;
  return (
    <div>
      <label htmlFor={fid} className="mb-1 block text-sm uppercase tracking-wider text-dim">{label}</label>
      <input id={fid} aria-invalid={!!error} aria-describedby={error ? `${fid}-err` : undefined} className={`input-hud ${error ? '!border-red-500' : ''}`} {...rest} />
      {error && <p id={`${fid}-err`} role="alert" className="mt-1 text-sm text-red-400">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-dim">{hint}</p>}
    </div>
  );
}
