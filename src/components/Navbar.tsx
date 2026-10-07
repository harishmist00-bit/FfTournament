import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Instagram, LogOut, Menu, User as UserIcon, X, Youtube } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { DiscordIcon } from './ui/icons';
import { Button } from './ui/Button';
import { useAuth } from '@/context/AuthContext';
import { mobileMenu, navbarEntrance } from '@/animations/pageAnimations';

export const NAV = [
  { to: '/', label: 'Home' }, { to: '/tournaments', label: 'Tournaments' }, { to: '/teams', label: 'Teams' },
  { to: '/matches', label: 'Matches' }, { to: '/standings', label: 'Standings' }, { to: '/news', label: 'News' }, { to: '/about', label: 'About' },
];
export const SOCIALS = [
  { label: 'YouTube', href: 'https://youtube.com', icon: <Youtube size={20} /> },
  { label: 'Discord', href: 'https://discord.com', icon: <DiscordIcon /> },
  { label: 'Instagram', href: 'https://instagram.com', icon: <Instagram size={20} /> },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const bar = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => { if (bar.current) navbarEntrance(bar.current); }, []);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => { if (menu.current) mobileMenu(menu.current, open); }, [open]);

  const link = ({ isActive }: { isActive: boolean }) =>
    `relative py-2 font-display text-[15px] font-bold uppercase tracking-wider transition ${isActive ? 'text-neon after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:bg-neon after:shadow-neon' : 'text-mist hover:text-neon'}`;

  return (
    <header ref={bar} className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${scrolled || open ? 'border-neon/40 bg-void/85 backdrop-blur-md' : 'border-transparent bg-transparent'}`}>
      <div className="container-x flex h-[72px] items-center justify-between gap-4">
        <BrandLogo />
        <nav aria-label="Main" className="hidden items-center gap-6 xl:gap-8 lg:flex">
          {NAV.map(n => <NavLink key={n.to} to={n.to} end={n.to === '/'} className={link}>{n.label}</NavLink>)}
        </nav>
        <div className="hidden items-center gap-4 lg:flex">
          {SOCIALS.map(s => <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="text-mist transition hover:text-neon">{s.icon}</a>)}
          {user ? (
            <>
              <Link to={user.role === 'admin' ? '/admin' : '/profile'} className="inline-flex items-center gap-2 font-display text-sm font-bold uppercase text-neon"><UserIcon size={18} />{user.username}</Link>
              <button onClick={logout} aria-label="Log out" className="text-dim hover:text-neon"><LogOut size={18} /></button>
            </>
          ) : <Button to="/login" variant="outline" size="sm">Login</Button>}
        </div>
        <button className="text-neon lg:hidden" onClick={() => setOpen(o => !o)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'}>
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
      <div id="mobile-menu" ref={menu} className="invisible h-0 overflow-hidden lg:hidden">
        <nav aria-label="Mobile" className="container-x flex flex-col gap-1 pb-6">
          {NAV.map(n => <NavLink key={n.to} to={n.to} end={n.to === '/'} className={({ isActive }) => `border-b border-neon/15 py-3 font-display text-lg font-bold uppercase tracking-wider ${isActive ? 'text-neon' : 'text-mist'}`}>{n.label}</NavLink>)}
          <div className="mt-4 flex items-center gap-5">
            {SOCIALS.map(s => <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="text-mist hover:text-neon">{s.icon}</a>)}
          </div>
          <div className="mt-4">
            {user ? <Button variant="outline" onClick={logout}>Log out</Button> : <Button to="/login">Login</Button>}
          </div>
        </nav>
      </div>
    </header>
  );
}
