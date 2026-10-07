import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

type Variant = 'primary' | 'outline' | 'ghost' | 'danger';
interface Props {
  children: ReactNode;
  variant?: Variant;
  size?: 'sm' | 'md';
  to?: string;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  arrow?: boolean;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
  dataHero?: string;
}

const OUTER: Record<Variant, string> = {
  primary: 'bg-neon text-void hover:bg-lime hover:shadow-neon',
  outline: 'bg-neon/60 hover:bg-neon text-mist',
  ghost: 'bg-transparent text-neon hover:bg-neon/10',
  danger: 'bg-red-500/70 hover:bg-red-400 text-mist',
};

export function Button({ children, variant = 'primary', size = 'md', to, href, onClick, type = 'button', arrow, disabled, className = '', ariaLabel, dataHero }: Props) {
  const pad = size === 'sm' ? 'px-4 py-1.5 text-sm' : 'px-6 py-3 text-base';
  const inner = variant === 'outline' || variant === 'danger'
    ? `clip-cut-sm inline-flex items-center justify-center gap-2 ${variant === 'danger' ? 'bg-void/90' : 'bg-void/90'} ${pad}`
    : `inline-flex items-center justify-center gap-2 ${pad}`;
  const outerCls = `clip-cut-sm ${variant === 'outline' || variant === 'danger' ? 'p-px' : ''} inline-block font-display font-bold uppercase tracking-wider transition duration-200 disabled:opacity-50 disabled:pointer-events-none ${OUTER[variant]} ${className}`;
  const content = (
    <span className={inner}>
      {children}
      {arrow && <ArrowRight size={18} className="arrow-nudge" aria-hidden />}
    </span>
  );
  if (to) return <Link to={to} className={outerCls} aria-label={ariaLabel} data-hero={dataHero}>{content}</Link>;
  if (href) return <a href={href} target="_blank" rel="noreferrer" className={outerCls} aria-label={ariaLabel}>{content}</a>;
  return <button type={type} onClick={onClick} disabled={disabled} className={outerCls} aria-label={ariaLabel} data-hero={dataHero}>{content}</button>;
}
