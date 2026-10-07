import { Bell, LogOut, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SearchBar } from './ui/Controls';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export function AdminHeader({ onMenu }: { onMenu: () => void }) {
  const { user, logout } = useAuth();
  const [q, setQ] = useState('');
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-neon/30 bg-void/90 px-4 backdrop-blur">
      <button className="text-neon lg:hidden" onClick={onMenu} aria-label="Open sidebar"><Menu /></button>
      <div className="hidden flex-1 sm:block"><SearchBar value={q} onChange={setQ} placeholder="Search admin" /></div>
      <div className="ml-auto flex items-center gap-4">
        <button aria-label="Notifications, 3 unread" className="relative text-mist hover:text-neon"><Bell size={20} /><span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-neon text-[10px] font-bold text-void">3</span></button>
        <Link to="/" className="hidden text-sm text-dim hover:text-neon sm:block">View site</Link>
        <span className="font-display font-bold text-neon">{user?.username}</span>
        <button onClick={logout} aria-label="Log out" className="text-dim hover:text-neon"><LogOut size={18} /></button>
      </div>
    </header>
  );
}
