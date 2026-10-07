import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, Swords, Trophy, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { Modal } from '@/components/ui/Modal';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TournamentLogo } from '@/components/ui/TeamLogo';
import { AsyncView, EmptyState, SkeletonTable } from '@/components/ui/States';
import { useToast } from '@/components/ui/Toast';
import { NewsArt } from '@/components/NewsCard';
import { TeamCard } from '@/components/TeamCard';
import { MatchCard } from '@/components/MatchCard';
import { StandingTable } from '@/components/StandingTable';
import { useAsync } from '@/hooks/useAsync';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useAuth } from '@/context/AuthContext';
import { getTournament, registerTeam } from '@/services/tournamentService';
import { getMatches } from '@/services/matchService';
import { getStandings } from '@/services/standingService';
import { getTeams } from '@/services/teamService';
import { formatINR, formatLongDate, formatRange } from '@/utils/format';
import { getErrorMessage } from '@/utils/errors';

const TABS = ['Overview', 'Teams', 'Matches', 'Standings', 'Rules'] as const;

export default function TournamentDetail() {
  const { slug = '' } = useParams();
  const state = useAsync(() => getTournament(slug), [slug]);
  useDocumentTitle(state.data?.name ?? 'Tournament');
  return (
    <div className="pt-24">
      <div className="container-x py-8">
        <AsyncView state={state} skeleton={<SkeletonTable rows={8} />}>{t => <Body tId={t.id} />}</AsyncView>
      </div>
    </div>
  );

  function Body({ tId }: { tId: number }) {
    const t = state.data!;
    const [tab, setTab] = useState<(typeof TABS)[number]>('Overview');
    const [open, setOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    const { user } = useAuth();
    const nav = useNavigate();
    const { toast, notify } = useToast();
    const extra = useAsync(() => Promise.all([getTeams(), getMatches(), getStandings(tId)]), [tId]);
    const canRegister = t.status === 'upcoming' && t.teamCount < t.maxTeams;
    const myTeamId = user?.teamId ?? 1;

    const confirm = async () => {
      setBusy(true);
      try { await registerTeam(myTeamId, t.id); notify('Registration sent. An admin will review it shortly.'); setOpen(false); }
      catch (e) { notify(getErrorMessage(e), 'error'); }
      finally { setBusy(false); }
    };

    return (
      <>
        <Panel innerClassName="overflow-hidden">
          <div className="relative h-40 sm:h-56"><NewsArt color={t.color} className="h-full w-full" /><div className="absolute inset-0 bg-gradient-to-t from-panel to-transparent" /></div>
          <div className="relative -mt-14 flex flex-col gap-5 p-5 sm:flex-row sm:items-end sm:p-8">
            <TournamentLogo name={t.name} color={t.color} size={104} />
            <div className="flex-1">
              <StatusBadge status={t.status} />
              <h1 className="mt-2 font-title text-3xl text-white sm:text-5xl">{t.name}</h1>
              <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-mist">
                <li className="flex items-center gap-1.5"><Trophy size={16} className="text-neon" aria-hidden />{formatINR(t.prizePool)}</li>
                <li className="flex items-center gap-1.5"><Calendar size={16} className="text-neon" aria-hidden />{formatRange(t.startDate, t.endDate)}</li>
                <li className="flex items-center gap-1.5"><Users size={16} className="text-neon" aria-hidden />{t.teamCount}/{t.maxTeams} teams</li>
                <li className="flex items-center gap-1.5"><Swords size={16} className="text-neon" aria-hidden />{t.mode}</li>
              </ul>
            </div>
            <Button disabled={!canRegister} onClick={() => (user ? setOpen(true) : nav('/login', { state: { from: `/tournaments/${t.slug}` } }))}>
              {canRegister ? 'Register team' : t.status === 'upcoming' ? 'Slots full' : 'Registration closed'}
            </Button>
          </div>
        </Panel>

        <div role="tablist" aria-label="Tournament sections" className="mt-8 flex gap-1 overflow-x-auto border-b border-neon/30">
          {TABS.map(x => (
            <button key={x} role="tab" aria-selected={tab === x} onClick={() => setTab(x)}
              className={`whitespace-nowrap px-5 py-3 font-display text-sm font-bold uppercase tracking-wider transition ${tab === x ? 'border-b-2 border-neon text-neon' : 'text-mist hover:text-neon'}`}>{x}</button>
          ))}
        </div>

        <div role="tabpanel" className="py-8">
          {tab === 'Overview' && (
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <Panel innerClassName="p-6"><h2 className="mb-2 font-title text-xl text-white">About</h2><p className="text-dim">{t.description}</p></Panel>
                <Panel innerClassName="p-6"><h2 className="mb-2 font-title text-xl text-white">Format</h2><p className="text-dim">{t.format}</p></Panel>
                <Panel innerClassName="p-6"><h2 className="mb-3 font-title text-xl text-white">Rules</h2><ol className="list-decimal space-y-1 pl-5 text-dim">{t.rules.map(r => <li key={r}>{r}</li>)}</ol></Panel>
              </div>
              <div className="space-y-6">
                <Panel innerClassName="p-6"><h2 className="mb-3 font-title text-xl text-white">Prize distribution</h2>
                  <ul className="space-y-2">{t.prizeDistribution.map(p => <li key={p.place} className="flex justify-between border-b border-neon/15 pb-2"><span>{p.place} place</span><span className="font-hud font-bold text-neon">{formatINR(p.amount)}</span></li>)}</ul></Panel>
                <Panel innerClassName="p-6"><h2 className="mb-3 font-title text-xl text-white">Schedule</h2>
                  <dl className="space-y-2 text-sm">
                    {[['Registration opens', t.regStart], ['Registration closes', t.regEnd], ['Tournament starts', t.startDate], ['Tournament ends', t.endDate]].map(([k, v]) => <div key={k} className="flex justify-between gap-2"><dt className="text-dim">{k}</dt><dd className="text-white">{formatLongDate(v)}</dd></div>)}
                  </dl></Panel>
              </div>
            </div>
          )}
          {tab === 'Rules' && <Panel innerClassName="p-6"><ol className="list-decimal space-y-2 pl-5 text-lg text-mist">{t.rules.map(r => <li key={r}>{r}</li>)}</ol></Panel>}
          {(tab === 'Teams' || tab === 'Matches' || tab === 'Standings') && (
            <AsyncView state={extra} skeleton={<SkeletonTable />}>
              {([teams, matches, standings]) => {
                const tMap = Object.fromEntries(teams.map(x => [x.id, x]));
                if (tab === 'Teams') {
                  const list = teams.filter(x => x.tournamentIds.includes(t.id));
                  return list.length ? <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{list.map(x => <TeamCard key={x.id} team={x} />)}</div> : <EmptyState message="No teams have been approved yet." />;
                }
                if (tab === 'Matches') {
                  const list = matches.filter(m => m.tournamentId === t.id);
                  return list.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map(m => <MatchCard key={m.id} match={m} teams={tMap} tournaments={{ [t.id]: t }} />)}</div> : <EmptyState message="The match schedule will be published soon." />;
                }
                return standings.length ? <Panel innerClassName="p-4"><StandingTable rows={standings} teams={tMap} /></Panel> : <EmptyState message="Standings appear after the first match is completed." />;
              }}
            </AsyncView>
          )}
        </div>
        <Modal open={open} title="Register your team" onClose={() => setOpen(false)}>
          <p className="mb-5 text-dim">Register your squad for <strong className="text-white">{t.name}</strong>. Entry is confirmed once an organizer approves it.</p>
          <div className="flex justify-end gap-3"><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={confirm} disabled={busy}>{busy ? 'Sending' : 'Confirm registration'}</Button></div>
        </Modal>
        {toast}
      </>
    );
  }
}
