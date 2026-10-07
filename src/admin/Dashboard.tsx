import { Link } from 'react-router-dom';
import { Shield, Swords, Trophy, Users } from 'lucide-react';
import { Panel } from '@/components/ui/Panel';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { AsyncView, SkeletonTable } from '@/components/ui/States';
import { AdminTitle, BarChart } from '@/components/ui/AdminBits';
import { useAsync } from '@/hooks/useAsync';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getTournaments, getRegistrations } from '@/services/tournamentService';
import { getTeams } from '@/services/teamService';
import { getPlayers } from '@/services/playerService';
import { getMatches } from '@/services/matchService';
import { formatDay, formatTime } from '@/utils/format';

export default function Dashboard() {
  useDocumentTitle('Admin dashboard');
  const s = useAsync(() => Promise.all([getTournaments(), getTeams(), getPlayers(), getMatches(), getRegistrations()]), []);
  return (
    <>
      <AdminTitle title="Dashboard" />
      <AsyncView state={s} skeleton={<SkeletonTable rows={8} />}>
        {([tournaments, teams, players, matches, regs]) => {
          const stats = [[Trophy, 'Total tournaments', tournaments.length], [Shield, 'Total teams', teams.length], [Users, 'Total players', players.length], [Swords, 'Total matches', matches.length]] as const;
          const tm = Object.fromEntries(teams.map(t => [t.id, t])), trm = Object.fromEntries(tournaments.map(t => [t.id, t]));
          return (<>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(([I, l, v]) => <Panel key={l} innerClassName="flex items-center gap-4 p-5"><I className="text-neon" /><div><p className="font-hud text-3xl font-black text-white">{v}</p><p className="text-sm uppercase tracking-wider text-dim">{l}</p></div></Panel>)}</div>
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              <BarChart title="Tournament registrations" data={tournaments.slice(0, 6).map(t => ({ label: t.name.split(' ')[0].slice(0, 7), value: t.teamCount }))} />
              <BarChart title="Match activity" data={(['live', 'upcoming', 'completed'] as const).map(st => ({ label: st, value: matches.filter(m => m.status === st).length }))} />
              <BarChart title="Team statistics (wins)" data={[...teams].sort((a, b) => b.wins - a.wins).slice(0, 6).map(t => ({ label: t.tag, value: t.wins }))} />
            </div>
            <div className="mt-6 grid gap-4 xl:grid-cols-2">
              <Panel innerClassName="p-4"><h2 className="mb-2 font-display text-lg font-bold uppercase text-white">Recent registrations</h2>
                <table className="w-full"><tbody>{regs.slice(0, 5).map(r => <tr key={r.id} className="border-b border-neon/10"><td className="td font-bold">{tm[r.teamId]?.name}</td><td className="td text-dim">{trm[r.tournamentId]?.name}</td><td className="td"><StatusBadge status={r.status} /></td></tr>)}</tbody></table>
                <Link to="/admin/registrations" className="mt-2 inline-block text-sm text-neon hover:underline">Review all registrations</Link></Panel>
              <Panel innerClassName="p-4"><h2 className="mb-2 font-display text-lg font-bold uppercase text-white">Upcoming matches</h2>
                <table className="w-full"><tbody>{matches.filter(m => m.status !== 'completed').slice(0, 5).map(m => <tr key={m.id} className="border-b border-neon/10"><td className="td font-hud">{m.code}</td><td className="td text-dim">{trm[m.tournamentId]?.name}</td><td className="td whitespace-nowrap">{formatDay(m.date)} {formatTime(m.time)}</td><td className="td"><StatusBadge status={m.status} /></td></tr>)}</tbody></table></Panel>
            </div>
          </>);
        }}
      </AsyncView>
    </>
  );
}
