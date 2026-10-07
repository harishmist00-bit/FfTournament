import { Link } from 'react-router-dom';
import { Crown } from 'lucide-react';
import { Panel } from './ui/Panel';
import { TeamLogo } from './ui/TeamLogo';
import type { Team } from '@/types';

export function TeamCard({ team, rank }: { team: Team; rank?: number }) {
  return (
    <Link to={`/teams/${team.id}`} className="group block h-full" aria-label={`${team.name}, ${team.points} points`}>
      <Panel hover className="h-full" innerClassName="relative flex flex-col items-center px-4 pb-5 pt-8 text-center">
        {rank && <span className="absolute left-3 top-2 inline-flex items-center gap-1 font-hud text-xs font-bold text-neon">{rank === 1 && <Crown size={14} aria-hidden />}#{rank}</span>}
        <div className="transition-transform duration-300 group-hover:scale-110"><TeamLogo tag={team.tag} color={team.color} size={84} name={team.name} /></div>
        <h3 className="mt-3 font-title text-lg text-white">{team.name}</h3>
        <p className="text-xs text-dim">{team.region}</p>
        <p className="mt-2 font-hud text-2xl font-black text-neon">{team.points}<span className="ml-1 text-xs text-neon/70">PTS</span></p>
        <p className="text-sm uppercase tracking-wider text-dim">{team.matches} Matches</p>
      </Panel>
    </Link>
  );
}
