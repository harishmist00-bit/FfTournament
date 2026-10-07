import { NavLink } from 'react-router-dom';
import { Bell, ClipboardCheck, LayoutDashboard, Newspaper, Settings, Shield, Swords, Table2, Trophy, Users, UserSquare2, X, type LucideIcon } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const ADMIN_NAV: { to: string; label: string; icon: LucideIcon; end?: boolean }[] = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/tournaments', label: 'Tournaments', icon: Trophy },
  { to: '/admin/teams', label: 'Teams', icon: Shield },
  { to: '/admin/players', label: 'Players', icon: Users },
  { to: '/admin/registrations', label: 'Registrations', icon: ClipboardCheck },
  { to: '/admin/matches', label: 'Matches', icon: Swords },
  { to: '/admin/results', label: 'Results', icon: UserSquare2 },
  { to: '/admin/standings', label: 'Standings', icon: Table2 },
  { to: '/admin/news', label: 'News', icon: Newspaper },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];
void Bell;

export function AdminSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-void/70 lg:hidden" onClick={onClose} aria-hidden />}
      <aside aria-label="Admin" className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-neon/30 bg-deep transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center justify-between border-b border-neon/20 px-4"><BrandLogo /><button className="text-dim lg:hidden" onClick={onClose} aria-label="Close sidebar"><X /></button></div>
        <nav className="space-y-1 p-3">
          {ADMIN_NAV.map(n => (
            <NavLink key={n.to} to={n.to} end={n.end} onClick={onClose}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 font-display font-bold uppercase tracking-wide transition ${isActive ? 'bg-neon/15 text-neon shadow-[inset_3px_0_0_#39FF14]' : 'text-mist hover:bg-neon/5 hover:text-neon'}`}>
              <n.icon size={18} aria-hidden />{n.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
