import { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '@/components/ui/SectionTitle';
import { FilterBar, Pagination, SearchBar } from '@/components/ui/Controls';
import { AsyncView, EmptyState, SkeletonCard } from '@/components/ui/States';
import { PlayerCard } from '@/components/PlayerCard';
import { useAsync } from '@/hooks/useAsync';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getPlayers } from '@/services/playerService';
import { getTeams } from '@/services/teamService';

const ROLES = ['All', 'Captain', 'IGL', 'Rusher', 'Sniper', 'Support', 'Substitute'] as const;
const PER = 12;

export default function Players() {
  useDocumentTitle('Players', 'Player profiles and stats from FF Battle Arena tournaments.');
  const state = useAsync(() => Promise.all([getPlayers(), getTeams()]), []);
  const [q, setQ] = useState('');
  const [role, setRole] = useState<(typeof ROLES)[number]>('All');
  const [page, setPage] = useState(1);
  useEffect(() => setPage(1), [q, role]);
  const list = useMemo(() => (state.data?.[0] ?? []).filter(p => (role === 'All' || p.role === role) && p.ign.toLowerCase().includes(q.toLowerCase())).sort((a, b) => b.kills - a.kills), [state.data, q, role]);
  const teams = Object.fromEntries((state.data?.[1] ?? []).map(t => [t.id, t]));
  return (
    <>
      <PageHeader title="Players" accent="Index" subtitle="Search every registered player and compare kills and averages." />
      <div className="container-x py-10">
        <div className="mb-8 space-y-4"><SearchBar value={q} onChange={setQ} placeholder="Search by in-game name" /><FilterBar label="Filter by role" options={ROLES} value={role} onChange={setRole} /></div>
        <AsyncView state={{ ...state, data: state.data && list }} isEmpty={d => !d.length} empty={<EmptyState title="No players found" message="Check the spelling or choose another role." />}
          skeleton={<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[1, 2, 3].map(i => <SkeletonCard key={i} />)}</div>}>
          {d => (<>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{d.slice((page - 1) * PER, page * PER).map(p => <PlayerCard key={p.id} player={p} team={teams[p.teamId]} />)}</div>
            <Pagination page={page} pageCount={Math.ceil(d.length / PER)} onChange={setPage} />
          </>)}
        </AsyncView>
      </div>
    </>
  );
}
