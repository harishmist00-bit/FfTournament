import { Link } from 'react-router-dom';
import { BrandLogo } from './BrandLogo';
import { SOCIALS } from './Navbar';

const COLS: { title: string; links: [string, string][] }[] = [
  { title: 'Quick Links', links: [['Home', '/'], ['Tournaments', '/tournaments'], ['Teams', '/teams'], ['Matches', '/matches'], ['Standings', '/standings'], ['News', '/news']] },
  { title: 'Tournaments', links: [['Upcoming', '/tournaments?status=upcoming'], ['Live', '/tournaments?status=live'], ['Completed', '/tournaments?status=completed'], ['Rules', '/about#rules']] },
  { title: 'Legal', links: [['Privacy Policy', '/about#privacy'], ['Terms', '/about#terms'], ['Contact', '/about#contact']] },
];

export function Footer() {
  return (
    <footer className="relative z-10 mt-20 border-t border-neon/40 bg-void/90">
      <div className="container-x grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <BrandLogo size="lg" />
          <p className="mt-4 font-title text-2xl leading-tight text-white">Play. Compete. <span className="text-neon">Win.</span></p>
          <p className="mt-2 max-w-sm text-dim">The tournament home for Free Fire squads across India.</p>
        </div>
        {COLS.map(c => (
          <nav key={c.title} aria-label={c.title}>
            <h2 className="mb-3 font-display text-base font-bold uppercase tracking-wider text-white">{c.title}</h2>
            <ul className="space-y-2">{c.links.map(([l, to]) => <li key={l}><Link to={to} className="text-dim transition hover:text-neon">{l}</Link></li>)}</ul>
          </nav>
        ))}
        <div>
          <h2 className="mb-3 font-display text-base font-bold uppercase tracking-wider text-white">Community</h2>
          <ul className="space-y-2">{SOCIALS.map(s => <li key={s.label}><a href={s.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-dim hover:text-neon">{s.icon}{s.label}</a></li>)}</ul>
        </div>
      </div>
      <div className="border-t border-neon/20 py-5">
        <div className="container-x flex flex-col justify-between gap-2 text-sm text-dim sm:flex-row">
          <p>© 2026 FF Battle Arena. All rights reserved.</p>
          <p>Built for the Free Fire community. Not affiliated with Garena.</p>
        </div>
      </div>
    </footer>
  );
}
