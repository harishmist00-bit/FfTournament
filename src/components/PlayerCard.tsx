import { Link } from 'react-router-dom';
import { Crosshair } from 'lucide-react';
import { Panel } from './ui/Panel';
import type { Player, Team } from '@/types';

export function PlayerAvatar({ ign, color = '#39FF14', size = 64 }: { ign: string; color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label={`${ign} avatar`} className="shrink-0">
      <rect width="64" height="64" fill="#061412" /><rect x="1" y="1" width="62" height="62" fill="none" stroke={color} strokeOpacity=".6" />
      <circle cx="32" cy="24" r="11" fill={color} opacity=".85" /><path d="M10 64q0-22 22-22t22 22z" fill={color} opacity=".55" />
      <path d="M21 23h22v4H21z" fill="#030909" />
    </svg>
  );
}

export function PlayerCard({ player, team }: { player: Player; team?: Team }) {
  return (
    <Link to={`/players/${player.id}`} aria-label={`${player.ign}, ${player.role}`} className="block h-full">
      <Panel hover className="h-full" innerClassName="flex items-center gap-4 p-4">
        <PlayerAvatar ign={player.ign} color={team?.color} />
        <div className="min-w-0">
          <h3 className="truncate font-title text-lg text-white">{player.ign}</h3>
          <p className="text-sm uppercase tracking-wider text-neon">{player.role}</p>
          <p className="truncate text-sm text-dim">{team?.name ?? 'Free agent'}</p>
          <p className="mt-1 flex items-center gap-1 text-sm text-mist"><Crosshair size={14} className="text-neon" aria-hidden />{player.kills} kills · {player.avgKills} avg</p>
        </div>
      </Panel>
    </Link>
  );
}
