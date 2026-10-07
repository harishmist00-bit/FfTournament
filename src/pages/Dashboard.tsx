import { useState, type FormEvent } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Panel } from '@/components/ui/Panel';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { AsyncView, EmptyState, SkeletonTable } from '@/components/ui/States';
import { useToast } from '@/components/ui/Toast';
import { MatchCard } from '@/components/MatchCard';
import { PlayerCard } from '@/components/PlayerCard';
import { TeamLogo } from '@/components/ui/TeamLogo';
import { PageHeader } from '@/components/ui/SectionTitle';
import { useAuth } from '@/context/AuthContext';
import { useAsync } from '@/hooks/useAsync';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getTeams, createTeam } from '@/services/teamService';
import { getPlayersByTeam } from '@/services/playerService';
import { getMatches } from '@/services/matchService';
import { getRegistrations, getTournaments } from '@/services/tournamentService';
import { formatLongDate } from '@/utils/format';
import { getErrorMessage } from '@/utils/errors';

const TABS = [['/profile', 'Profile'], ['/my-team', 'My team'], ['/my-tournaments', 'My tournaments'], ['/my-matches', 'My matches']];

function Frame({ title, children }: { title: string; children: React.ReactNode }) {
  useDocumentTitle(title);
  return (
    <>
      <PageHeader title={title} subtitle="Manage your team, entries and match schedule." />
      <div className="container-x py-8">
        <nav aria-label="Dashboard" className="mb-8 flex gap-2 overflow-x-auto">
          {TABS.map(([to, l]) => <NavLink key={to} to={to} className={({ isActive }) => `whitespace-nowrap border px-4 py-2 font-display text-sm font-bold uppercase ${isActive ? 'border-neon bg-neon text-void' : 'border-neon/40 text-mist hover:border-neon'}`}>{l}</NavLink>)}
        </nav>
        {children}
      </div>
    </>
  );
}

const useMine = () => {
  const { user } = useAuth();
  return useAsync(async () => {
    const [teams, matches, regs, tournaments] = await Promise.all([getTeams(), getMatches(), getRegistrations(), getTournaments()]);
    const team = teams.find(t => t.id === user?.teamId) ?? null;
    return { team, teams, matches: team ? matches.filter(m => m.teamIds.includes(team.id)) : [], regs: team ? regs.filter(r => r.teamId === team.id) : [], tournaments };
  }, [user?.teamId]);
};

export function Profile() {
  const { user } = useAuth();
  const s = useMine();
  return (
    <Frame title="Profile">
      <AsyncView state={s} skeleton={<SkeletonTable />}>
        {d => {
          const upcoming = d.matches.filter(m => m.status !== 'completed');
          const done = d.matches.filter(m => m.status === 'completed');
          const cards: [string, number | string, string][] = [['My teams', d.team ? 1 : 0, '/my-team'], ['Tournament registrations', d.regs.length, '/my-tournaments'], ['Upcoming matches', upcoming.length, '/my-matches'], ['Recent results', done.length, '/my-matches']];
          return (<>
            <Panel innerClassName="p-6"><p className="text-sm uppercase tracking-widest text-dim">Signed in as</p><h2 className="font-title text-3xl text-neon">{user?.username}</h2><p className="text-dim">{user?.email}</p></Panel>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{cards.map(([l, v, to]) => <Link key={l} to={to}><Panel hover innerClassName="p-5"><p className="font-hud text-4xl font-black text-white">{v}</p><p className="text-sm uppercase tracking-wider text-dim">{l}</p></Panel></Link>)}</div>
          </>);
        }}
      </AsyncView>
    </Frame>
  );
}

export function MyTeam() {
  const { user } = useAuth();
  const s = useAsync(async () => {
    const teams = await getTeams();
    const team = teams.find(t => t.id === user?.teamId) ?? null;
    return { team, players: team ? await getPlayersByTeam(team.id) : [] };
  }, [user?.teamId]);
  const [f, setF] = useState({ name: '', tag: '', region: '' });
  const [err, setErr] = useState('');
  const { toast, notify } = useToast();
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (f.name.trim().length < 3 || f.tag.trim().length < 2 || !f.region.trim()) { setErr('Enter a team name (3+ characters), a tag (2+ characters) and a region.'); return; }
    try { await createTeam({ name: f.name.trim(), tag: f.tag.trim().toUpperCase().slice(0, 4), region: f.region.trim() }); setErr(''); notify('Team created. Add players to complete your roster.'); }
    catch (x) { setErr(getErrorMessage(x)); }
  };
  return (
    <Frame title="My team">
      <AsyncView state={s} skeleton={<SkeletonTable />}>
        {({ team, players }) => team ? (<>
          <Panel innerClassName="flex items-center gap-5 p-6"><TeamLogo tag={team.tag} color={team.color} size={88} name={team.name} /><div><h2 className="font-title text-3xl text-white">{team.name}</h2><p className="text-dim">{team.region} · {team.points} pts</p></div></Panel>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{players.map(p => <PlayerCard key={p.id} player={p} team={team} />)}</div>
        </>) : (
          <Panel innerClassName="p-6 sm:p-8">
            <h2 className="mb-1 font-title text-2xl text-white">Create your team</h2><p className="mb-5 text-dim">You are not on a team yet. Create one to register for tournaments.</p>
            <form onSubmit={submit} noValidate className="grid max-w-xl gap-4">
              {err && <p role="alert" className="text-red-400">{err}</p>}
              <FormField label="Team name" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} />
              <div className="grid gap-4 sm:grid-cols-2"><FormField label="Tag" maxLength={4} value={f.tag} onChange={e => setF({ ...f, tag: e.target.value })} /><FormField label="Region" value={f.region} onChange={e => setF({ ...f, region: e.target.value })} /></div>
              <div><Button type="submit">Create team</Button></div>
            </form>
          </Panel>
        )}
      </AsyncView>
      {toast}
    </Frame>
  );
}

export function MyTournaments() {
  const s = useMine();
  return (
    <Frame title="My tournaments">
      <AsyncView state={s} skeleton={<SkeletonTable />} isEmpty={d => !d.regs.length} empty={<EmptyState title="No registrations" message="Your team has not entered any tournament yet." action={<Button to="/tournaments">Browse tournaments</Button>} />}>
        {d => <Panel innerClassName="p-2"><table className="w-full"><thead><tr className="border-b border-neon/25"><th className="th">Tournament</th><th className="th">Registered</th><th className="th">Status</th></tr></thead>
          <tbody>{d.regs.map(r => { const t = d.tournaments.find(x => x.id === r.tournamentId); return <tr key={r.id} className="border-b border-neon/10"><td className="td font-display font-bold">{t && <Link to={`/tournaments/${t.slug}`} className="hover:text-neon">{t.name}</Link>}</td><td className="td">{formatLongDate(r.date)}</td><td className="td"><StatusBadge status={r.status} /></td></tr>; })}</tbody></table></Panel>}
      </AsyncView>
    </Frame>
  );
}

export function MyMatches() {
  const s = useMine();
  return (
    <Frame title="My matches">
      <AsyncView state={s} skeleton={<SkeletonTable />} isEmpty={d => !d.matches.length} empty={<EmptyState title="No matches yet" message="Matches for your team will appear here once you join a tournament." />}>
        {d => { const tm = Object.fromEntries(d.teams.map(t => [t.id, t])); const trm = Object.fromEntries(d.tournaments.map(t => [t.id, t]));
          return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{d.matches.map(m => <MatchCard key={m.id} match={m} teams={tm} tournaments={trm} />)}</div>; }}
      </AsyncView>
    </Frame>
  );
}
