import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/components/ui/SectionTitle';
import { FilterBar, SearchBar, SelectField } from '@/components/ui/Controls';
import { AsyncView, EmptyState, SkeletonCard } from '@/components/ui/States';
import { TournamentCard } from '@/components/TournamentCard';
import { useAsync } from '@/hooks/useAsync';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getTournaments } from '@/services/tournamentService';

const STATUSES = ['All', 'Live', 'Upcoming', 'Completed'] as const;
type St = (typeof STATUSES)[number];

export default function Tournaments() {
  useDocumentTitle('Tournaments', 'Browse live, upcoming and completed Free Fire tournaments on FF Battle Arena.');
  const [params, setParams] = useSearchParams();
  const initial = STATUSES.find(s => s.toLowerCase() === params.get('status')) ?? 'All';
  const [status, setStatus] = useState<St>(initial);
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('newest');
  const state = useAsync(getTournaments, []);

  const list = useMemo(() => {
    const all = state.data ?? [];
    return all
      .filter(t => (status === 'All' || t.status === status.toLowerCase()) && t.name.toLowerCase().includes(q.toLowerCase()))
      .sort((a, b) => sort === 'prize' ? b.prizePool - a.prizePool : sort === 'date' ? a.startDate.localeCompare(b.startDate) : b.startDate.localeCompare(a.startDate));
  }, [state.data, status, q, sort]);

  return (
    <>
      <PageHeader title="Tournaments" accent="Arena" subtitle="Find your next battle. Filter by status, search by name and sort by prize or date." />
      <div className="container-x py-10">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <FilterBar label="Filter by status" options={STATUSES} value={status} onChange={s => { setStatus(s); setParams(s === 'All' ? {} : { status: s.toLowerCase() }); }} />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <SearchBar value={q} onChange={setQ} placeholder="Search tournament" />
            <SelectField label="Sort by" value={sort} onChange={setSort} options={[{ value: 'newest', label: 'Newest' }, { value: 'prize', label: 'Prize pool' }, { value: 'date', label: 'Date' }]} />
          </div>
        </div>
        <AsyncView state={{ ...state, data: state.data && list }} isEmpty={d => d.length === 0}
          empty={<EmptyState title="No tournaments found" message="Try a different status or clear your search." />}
          skeleton={<div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{[1, 2, 3].map(i => <SkeletonCard key={i} />)}</div>}>
          {d => <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{d.map(t => <TournamentCard key={t.id} t={t} />)}</div>}
        </AsyncView>
      </div>
    </>
  );
}
