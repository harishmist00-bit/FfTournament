import { Link } from 'react-router-dom';
import { Clock, Map as MapIcon } from 'lucide-react';
import { Panel } from './ui/Panel';
import { StatusBadge } from './ui/StatusBadge';
import { TeamLogo } from './ui/TeamLogo';
import type { Match, Team, Tournament } from '@/types';
import { formatDay, formatTime } from '@/utils/format';

interface Ctx { teams: Record<number, Team>; tournaments: Record<number, Tournament> }

const pair = (m: Match, teams: Record<number, Team>) => [teams[m.teamIds[0]], teams[m.teamIds[1]]] as const;

export function MatchCard({ match, teams, tournaments }: { match: Match } & Ctx) {
  const [a, b] = pair(match, teams);
  return (
    <Link to={`/matches/${match.id}`} className="block h-full" aria-label={`Match ${match.code}`}>
      <Panel hover className="h-full" innerClassName="p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-hud text-sm font-bold text-neon">{match.code}</span><StatusBadge status={match.status} />
        </div>
        <p className="mb-3 truncate text-sm uppercase tracking-wider text-dim">{tournaments[match.tournamentId]?.name} · {match.round}</p>
        <div className="flex items-center justify-between gap-2">
          {a && <div className="flex min-w-0 flex-1 flex-col items-center text-center"><TeamLogo tag={a.tag} color={a.color} size={48} name={a.name} /><span className="mt-1 w-full truncate font-display text-sm font-bold text-white">{a.name}</span></div>}
          <span className="font-title text-neon">vs</span>
          {b && <div className="flex min-w-0 flex-1 flex-col items-center text-center"><TeamLogo tag={b.tag} color={b.color} size={48} name={b.name} /><span className="mt-1 w-full truncate font-display text-sm font-bold text-white">{b.name}</span></div>}
        </div>
        <p className="mt-2 text-center text-xs text-dim">+ {match.teamIds.length - 2} more squads</p>
        <div className="mt-4 flex items-center justify-between border-t border-neon/20 pt-3 text-sm text-mist">
          <span className="inline-flex items-center gap-1"><MapIcon size={14} className="text-neon" aria-hidden />{match.map}</span>
          <span className="inline-flex items-center gap-1"><Clock size={14} className="text-neon" aria-hidden />{formatDay(match.date)} · {formatTime(match.time)}</span>
        </div>
      </Panel>
    </Link>
  );
}

export function MatchTable({ matches, teams, tournaments }: { matches: Match[] } & Ctx) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] text-sm sm:text-base">
        <caption className="sr-only">Match schedule</caption>
        <thead><tr className="border-b border-neon/25"><th className="th">Match</th><th className="th">Tournament</th><th className="th">Teams</th><th className="th">Map</th><th className="th">Time</th><th className="th">Status</th></tr></thead>
        <tbody data-rows>
          {matches.map(m => {
            const [a, b] = pair(m, teams);
            return (
              <tr key={m.id} className="border-b border-neon/10 transition hover:bg-neon/5">
                <td className="td font-hud font-bold"><Link to={`/matches/${m.id}`} className="hover:text-neon">{m.code}</Link></td>
                <td className="td text-neon2">{tournaments[m.tournamentId]?.name}</td>
                <td className="td">
                  <span className="flex items-center gap-2 font-display font-semibold">
                    {a && <TeamLogo tag={a.tag} color={a.color} size={24} name={a.name} />}{a?.name}
                    <span className="text-xs text-neon">vs</span>
                    {b && <TeamLogo tag={b.tag} color={b.color} size={24} name={b.name} />}{b?.name}
                  </span>
                </td>
                <td className="td text-dim">{m.map}</td>
                <td className="td whitespace-nowrap">{formatTime(m.time)}</td>
                <td className="td"><StatusBadge status={m.status} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
