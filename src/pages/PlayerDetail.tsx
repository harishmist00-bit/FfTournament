import { Link, useParams } from 'react-router-dom';
import { Panel } from '@/components/ui/Panel';
import { AsyncView, SkeletonTable } from '@/components/ui/States';
import { PlayerAvatar } from '@/components/PlayerCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useAsync } from '@/hooks/useAsync';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getPlayer } from '@/services/playerService';
import { getTeam } from '@/services/teamService';
import { getMatches } from '@/services/matchService';
import { formatDay } from '@/utils/format';

export default function PlayerDetail() {
  const { id = '' } = useParams();
  const state = useAsync(async () => {
    const p = await getPlayer(Number(id));
    const [team, matches] = await Promise.all([getTeam(p.teamId), getMatches()]);
    return { p, team, matches: matches.filter(m => m.teamIds.includes(p.teamId) && m.status === 'completed').slice(-5).reverse() };
  }, [id]);
  useDocumentTitle(state.data?.p.ign ?? 'Player');
  return (
    <div className="container-x pb-8 pt-32">
      <AsyncView state={state} skeleton={<SkeletonTable rows={8} />}>
        {({ p, team, matches }) => {
          const stats: [string, string | number][] = [['Matches', p.matches], ['Kills', p.kills], ['Wins', p.wins], ['Avg kills', p.avgKills], ['Avg placement', p.avgPlacement], ['Total points', p.points]];
          return (<>
            <Panel innerClassName="flex flex-col items-center gap-6 p-6 sm:flex-row sm:p-10">
              <PlayerAvatar ign={p.ign} color={team.color} size={128} />
              <div className="text-center sm:text-left">
                <h1 className="font-title text-4xl text-white sm:text-6xl">{p.ign}</h1>
                <p className="text-dim">{p.realName} · {p.country}</p>
                <p className="mt-2 text-lg"><span className="text-neon">{p.role}</span> at <Link className="font-bold hover:text-neon" to={`/teams/${team.id}`}>{team.name}</Link></p>
              </div>
            </Panel>
            <dl className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {stats.map(([k, v]) => <Panel key={k} innerClassName="p-4 text-center"><dd className="font-hud text-2xl font-black text-neon">{v}</dd><dt className="text-xs uppercase tracking-widest text-dim">{k}</dt></Panel>)}
            </dl>
            <h2 className="mb-4 mt-10 font-title text-2xl text-white">Recent matches</h2>
            <Panel innerClassName="p-2">
              {matches.length ? (
                <table className="w-full"><thead><tr className="border-b border-neon/25"><th className="th">Match</th><th className="th">Date</th><th className="th">Placement</th><th className="th">Kills</th><th className="th">Status</th></tr></thead>
                  <tbody>{matches.map(m => { const r = m.results.find(x => x.teamId === team.id); return (
                    <tr key={m.id} className="border-b border-neon/10"><td className="td"><Link to={`/matches/${m.id}`} className="font-hud hover:text-neon">{m.code}</Link></td><td className="td">{formatDay(m.date)}</td><td className="td">#{r?.placement ?? '-'}</td><td className="td">{r?.kills ?? '-'}</td><td className="td"><StatusBadge status={m.status} /></td></tr>); })}</tbody></table>
              ) : <p className="p-6 text-dim">No completed matches yet.</p>}
            </Panel>
          </>);
        }}
      </AsyncView>
    </div>
  );
}
