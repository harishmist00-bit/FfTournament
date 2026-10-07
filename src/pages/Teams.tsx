import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/ui/SectionTitle';
import { SearchBar, SelectField } from '@/components/ui/Controls';
import { AsyncView, EmptyState, SkeletonCard } from '@/components/ui/States';
import { TeamCard } from '@/components/TeamCard';
import { useAsync } from '@/hooks/useAsync';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getTeams } from '@/services/teamService';

export default function Teams() {
  useDocumentTitle('Teams', 'Meet the squads competing in FF Battle Arena tournaments.');
  const state = useAsync(getTeams, []);
  const [q, setQ] = useState('');
  const [region, setRegion] = useState('All');
  const regions = useMemo(() => ['All', ...Array.from(new Set((state.data ?? []).map(t => t.region))).sort()], [state.data]);
  const list = useMemo(() => (state.data ?? []).filter(t => (region === 'All' || t.region === region) && t.name.toLowerCase().includes(q.toLowerCase())).sort((a, b) => b.points - a.points), [state.data, q, region]);
  return (
    <>
      <PageHeader title="Teams" accent="Roster" subtitle="Every squad on the ladder, ranked by points." />
      <div className="container-x py-10">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end">
          <SearchBar value={q} onChange={setQ} placeholder="Search team" />
          <SelectField label="Region" value={region} onChange={setRegion} options={regions.map(r => ({ value: r, label: r }))} />
        </div>
        <AsyncView state={{ ...state, data: state.data && list }} isEmpty={d => !d.length} empty={<EmptyState title="No teams found" message="Try another region or search term." />}
          skeleton={<div className="grid grid-cols-2 gap-4 md:grid-cols-4">{[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}</div>}>
          {d => <div data-stagger className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{d.map(t => <TeamCard key={t.id} team={t} rank={[...(state.data ?? [])].sort((a, b) => b.points - a.points).findIndex(x => x.id === t.id) + 1} />)}</div>}
        </AsyncView>
      </div>
    </>
  );
}
