import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/ui/SectionTitle';
import { FilterBar, SelectField } from '@/components/ui/Controls';
import { AsyncView, EmptyState, SkeletonCard } from '@/components/ui/States';
import { MatchCard } from '@/components/MatchCard';
import { useAsync } from '@/hooks/useAsync';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useLookups } from '@/hooks/useLookups';
import { getMatches } from '@/services/matchService';
import { formatLongDate } from '@/utils/format';

const STATUSES = ['All', 'Live', 'Upcoming', 'Completed'] as const;

export default function Matches() {
  useDocumentTitle('Matches', 'Live, upcoming and completed Free Fire tournament matches.');
  const state = useAsync(getMatches, []);
  const lk = useLookups();
  const [status, setStatus] = useState<(typeof STATUSES)[number]>('All');
  const [tournament, setTournament] = useState('all');
  const [date, setDate] = useState('all');
  const [map, setMap] = useState('all');
  const all = state.data ?? [];
  const list = useMemo(() => all.filter(m =>
    (status === 'All' || m.status === status.toLowerCase()) && (tournament === 'all' || String(m.tournamentId) === tournament) &&
    (date === 'all' || m.date === date) && (map === 'all' || m.map === map)), [all, status, tournament, date, map]);
  const opt = (vals: string[], fmt: (v: string) => string = v => v) => [{ value: 'all', label: 'All' }, ...Array.from(new Set(vals)).sort().map(v => ({ value: v, label: fmt(v) }))];
  return (
    <>
      <PageHeader title="Match" accent="Center" subtitle="Follow every lobby from room open to final placements." />
      <div className="container-x py-10">
        <div className="mb-8 space-y-4">
          <FilterBar label="Filter by status" options={STATUSES} value={status} onChange={setStatus} />
          <div className="grid gap-3 sm:grid-cols-3">
            <SelectField label="Tournament" value={tournament} onChange={setTournament} options={opt(all.map(m => String(m.tournamentId)), v => lk.tournaments[Number(v)]?.name ?? v)} />
            <SelectField label="Date" value={date} onChange={setDate} options={opt(all.map(m => m.date), formatLongDate)} />
            <SelectField label="Map" value={map} onChange={setMap} options={opt(all.map(m => m.map))} />
          </div>
        </div>
        <AsyncView state={{ ...state, data: state.data && lk.ready ? list : null, loading: state.loading || !lk.ready }} isEmpty={d => !d.length}
          empty={<EmptyState title="No matches found" message="No matches fit these filters. Reset one of them to see more." />}
          skeleton={<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[1, 2, 3].map(i => <SkeletonCard key={i} />)}</div>}>
          {d => <div data-stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{d.map(m => <MatchCard key={m.id} match={m} teams={lk.teams} tournaments={lk.tournaments} />)}</div>}
        </AsyncView>
      </div>
    </>
  );
}
