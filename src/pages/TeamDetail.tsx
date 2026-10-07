import { useParams } from 'react-router-dom';
import { Panel } from '@/components/ui/Panel';
import { TeamLogo } from '@/components/ui/TeamLogo';
import { AsyncView, SkeletonTable } from '@/components/ui/States';
import { PlayerCard } from '@/components/PlayerCard';
import { useAsync } from '@/hooks/useAsync';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getTeam, getTeams } from '@/services/teamService';
import { getPlayersByTeam } from '@/services/playerService';

export default function TeamDetail() {
  const { id = '' } = useParams();
  const state = useAsync(() => Promise.all([getTeam(Number(id)), getPlayersByTeam(Number(id)), getTeams()]), [id]);
  useDocumentTitle(state.data?.[0].name ?? 'Team');
  return (
    <div className="container-x pb-8 pt-32">
      <AsyncView state={state} skeleton={<SkeletonTable rows={8} />}>
        {([team, players, all]) => {
          const rank = [...all].sort((a, b) => b.points - a.points).findIndex(t => t.id === team.id) + 1;
          const stats: [string, string | number][] = [['Rank', `#${rank}`], ['Points', team.points], ['Wins', team.wins], ['Matches', team.matches]];
          const captain = players.find(p => p.id === team.captainId);
          const rest = players.filter(p => p.id !== team.captainId);
          return (
            <>
              <Panel innerClassName="flex flex-col items-center gap-6 p-6 sm:flex-row sm:p-10">
                <TeamLogo tag={team.tag} color={team.color} size={128} name={team.name} />
                <div className="text-center sm:text-left">
                  <h1 className="font-title text-4xl text-white sm:text-6xl">{team.name}</h1>
                  <p className="mt-1 text-lg text-dim">{team.region}, India</p>
                </div>
              </Panel>
              <dl className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                {stats.map(([k, v]) => <Panel key={k} innerClassName="p-5 text-center"><dd className="font-hud text-3xl font-black text-neon">{v}</dd><dt className="text-sm uppercase tracking-widest text-dim">{k}</dt></Panel>)}
              </dl>
              <h2 className="mb-4 mt-10 font-title text-2xl text-white">Roster</h2>
              {players.length ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {captain && <PlayerCard player={{ ...captain, role: 'Captain' }} team={team} />}
                  {rest.map(p => <PlayerCard key={p.id} player={p} team={team} />)}
                </div>
              ) : <p className="text-dim">This team has not added players yet.</p>}
            </>
          );
        }}
      </AsyncView>
    </div>
  );
}
