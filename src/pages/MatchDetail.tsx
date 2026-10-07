import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, Clock, Copy, KeyRound, Map as MapIcon } from 'lucide-react';
import { Panel } from '@/components/ui/Panel';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TeamLogo } from '@/components/ui/TeamLogo';
import { AsyncView, SkeletonTable } from '@/components/ui/States';
import { useToast } from '@/components/ui/Toast';
import { RankBadge } from '@/components/StandingTable';
import { useAsync } from '@/hooks/useAsync';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getMatch } from '@/services/matchService';
import { getTeams } from '@/services/teamService';
import { getTournaments } from '@/services/tournamentService';
import { formatLongDate, formatTime } from '@/utils/format';

export default function MatchDetail() {
  const { id = '' } = useParams();
  const state = useAsync(() => Promise.all([getMatch(Number(id)), getTeams(), getTournaments()]), [id]);
  const { toast, notify } = useToast();
  const [shown, setShown] = useState(false);
  useDocumentTitle(state.data ? `Match ${state.data[0].code}` : 'Match');
  const copy = async (label: string, value: string) => {
    try { await navigator.clipboard.writeText(value); notify(`${label} copied`); } catch { notify('Copy is blocked by your browser. Select the text manually.', 'error'); }
  };
  return (
    <div className="container-x pb-8 pt-32">
      <AsyncView state={state} skeleton={<SkeletonTable rows={8} />}>
        {([m, teams, tournaments]) => {
          const tm = Object.fromEntries(teams.map(t => [t.id, t]));
          const tour = tournaments.find(t => t.id === m.tournamentId);
          const info: [React.ReactNode, string][] = [[<Calendar key="d" size={18} />, formatLongDate(m.date)], [<Clock key="c" size={18} />, formatTime(m.time)], [<MapIcon key="m" size={18} />, m.map]];
          return (<>
            <Panel innerClassName="p-6 sm:p-10">
              <div className="flex flex-wrap items-center gap-3"><span className="font-hud text-2xl font-black text-neon">{m.code}</span><StatusBadge status={m.status} /></div>
              <h1 className="mt-2 font-title text-3xl text-white sm:text-5xl">{tour ? <Link to={`/tournaments/${tour.slug}`} className="hover:text-neon">{tour.name}</Link> : 'Match'}</h1>
              <p className="mt-1 text-dim">{m.round} · Match {m.matchNumber}</p>
              <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-2">{info.map(([i, t]) => <li key={t} className="flex items-center gap-2 text-lg"><span className="text-neon">{i}</span>{t}</li>)}</ul>
            </Panel>

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              <Panel className="lg:col-span-1" innerClassName="p-6">
                <h2 className="mb-4 flex items-center gap-2 font-title text-xl text-white"><KeyRound className="text-neon" size={20} /> Room details</h2>
                {m.status === 'completed' ? <p className="text-dim">This room is closed.</p> : (
                  <div className="space-y-4">
                    {([['Room ID', m.roomId], ['Password', m.roomPassword]] as const).map(([k, v]) => (
                      <div key={k} className="border border-neon/30 bg-deep p-3">
                        <p className="text-xs uppercase tracking-widest text-dim">{k}</p>
                        <p className="my-1 font-hud text-2xl font-bold tracking-widest text-neon">{shown || k === 'Room ID' ? v : '••••••'}</p>
                        <Button size="sm" variant="outline" onClick={() => copy(k, v)} ariaLabel={`Copy ${k}`}><Copy size={14} /> Copy {k === 'Room ID' ? 'room ID' : 'password'}</Button>
                      </div>
                    ))}
                    <button onClick={() => setShown(s => !s)} className="text-sm text-neon underline">{shown ? 'Hide password' : 'Reveal password'}</button>
                  </div>
                )}
              </Panel>
              <Panel className="lg:col-span-2" innerClassName="p-4">
                <h2 className="mb-3 px-2 pt-2 font-title text-xl text-white">{m.results.length ? 'Results' : 'Participating teams'}</h2>
                {m.results.length ? (
                  <div className="overflow-x-auto"><table className="w-full min-w-[480px]"><thead><tr className="border-b border-neon/25"><th className="th">#</th><th className="th">Team</th><th className="th text-center">Kills</th><th className="th text-center">Place pts</th><th className="th text-center">Total</th></tr></thead>
                    <tbody>{m.results.map(r => <tr key={r.teamId} className="border-b border-neon/10"><td className="td"><RankBadge rank={r.placement} /></td><td className="td"><Link to={`/teams/${r.teamId}`} className="flex items-center gap-2 font-bold hover:text-neon"><TeamLogo tag={tm[r.teamId].tag} color={tm[r.teamId].color} size={26} name={tm[r.teamId].name} />{tm[r.teamId].name}</Link></td><td className="td text-center">{r.kills}</td><td className="td text-center">{r.placementPoints}</td><td className="td text-center font-hud font-bold text-neon">{r.totalPoints}</td></tr>)}</tbody></table></div>
                ) : (
                  <ul className="grid gap-2 p-2 sm:grid-cols-2">{m.teamIds.map(tid => <li key={tid}><Link to={`/teams/${tid}`} className="flex items-center gap-3 border border-neon/15 p-2 hover:border-neon"><TeamLogo tag={tm[tid].tag} color={tm[tid].color} size={32} name={tm[tid].name} /><span className="font-display font-bold">{tm[tid].name}</span></Link></li>)}</ul>
                )}
              </Panel>
            </div>
            {toast}
          </>);
        }}
      </AsyncView>
    </div>
  );
}
