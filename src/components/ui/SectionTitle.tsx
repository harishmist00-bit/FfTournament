import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';

interface Props { title: string; accent?: string; subtitle?: string; to?: string; linkLabel?: string; icon?: ReactNode }

export function SectionTitle({ title, accent, subtitle, to, linkLabel, icon }: Props) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4" data-reveal>
      <div className="flex items-center gap-3">
        <span className="text-neon" aria-hidden>{icon}</span>
        <div>
          <h2 className="font-title text-2xl sm:text-3xl text-white">{title} {accent && <span className="text-neon">{accent}</span>}</h2>
          {subtitle && <p className="mt-0.5 text-dim">{subtitle}</p>}
        </div>
      </div>
      {to && (
        <Link to={to} className="group hidden shrink-0 items-center gap-2 text-sm text-mist hover:text-neon sm:inline-flex">
          {linkLabel}<ArrowRight size={16} className="transition group-hover:translate-x-1" aria-hidden />
        </Link>
      )}
    </div>
  );
}

export function PageHeader({ title, accent, subtitle }: { title: string; accent?: string; subtitle?: string }) {
  return (
    <header className="relative overflow-hidden border-b border-neon/30 pt-32 pb-10 sm:pt-40 sm:pb-14">
      <div className="grid-bg absolute inset-0 opacity-60" aria-hidden />
      <div className="absolute -right-24 top-0 h-full w-72 -skew-x-12 bg-neon/10" aria-hidden />
      <div className="container-x relative">
        <h1 className="font-title text-4xl text-white sm:text-6xl">{title} {accent && <span className="text-neon">{accent}</span>}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-lg text-dim">{subtitle}</p>}
      </div>
    </header>
  );
}
