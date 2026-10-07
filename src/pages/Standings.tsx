import { useState } from 'react';
import { PageHeader } from '@/components/ui/SectionTitle';
import { Panel } from '@/components/ui/Panel';
import { SelectField } from '@/components/ui/Controls';
import { AsyncView, EmptyState, SkeletonTable } from '@/components/ui/States';
import { StandingTable } from '@/components/StandingTable';
import { useAsync } from '@/hooks/useAsync';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useLookups } from '@/hooks/useLookups';
import { getStandings } from '@/services/standingService';

export default function Standings() {
  useDocumentTitle('Standings', 'Full tournament standings with placement points, kill points and form.');
  const lk = useLookups();
  const [tid, setTid] = useState('1');
  const [group, setGroup] = useState('All');
  const state = useAsync(() => getStandings(Number(tid), group), [tid, group]);
  return (
    <>
      <PageHeader title="Tournament" accent="Standings" subtitle="Placement points plus kill points decide the table." />
      <div className="container-x py-10">
        <div className="mb-6 grid gap-3 sm:max-w-xl sm:grid-cols-2">
          <SelectField label="Tournament" value={tid} onChange={setTid} options={Object.values(lk.tournaments).map(t => ({ value: String(t.id), label: t.name }))} />
          <SelectField label="Group" value={group} onChange={setGroup} options={['All', 'A', 'B'].map(g => ({ value: g, label: g === 'All' ? 'All groups' : `Group ${g}` }))} />
        </div>
        <Panel innerClassName="p-4">
          <AsyncView state={{ ...state, loading: state.loading || !lk.ready }} isEmpty={d => !d.length} skeleton={<SkeletonTable rows={10} />}
            empty={<EmptyState title="No standings yet" message="This tournament has no completed matches. Standings appear after the first result is entered." />}>
            {d => <StandingTable rows={d} teams={lk.teams} />}
          </AsyncView>
        </Panel>
      </div>
    </>
  );
}
