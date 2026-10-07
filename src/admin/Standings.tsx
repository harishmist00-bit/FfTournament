import { useState } from 'react';
import { Panel } from '@/components/ui/Panel';
import { SelectField } from '@/components/ui/Controls';
import { AsyncView, EmptyState, SkeletonTable } from '@/components/ui/States';
import { StandingTable } from '@/components/StandingTable';
import { AdminTitle } from '@/components/ui/AdminBits';
import { useAsync } from '@/hooks/useAsync';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useLookups } from '@/hooks/useLookups';
import { getStandings } from '@/services/standingService';

export default function AdminStandings() {
  useDocumentTitle('Manage standings');
  const lk = useLookups();
  const [tid, setTid] = useState('1');
  const s = useAsync(() => getStandings(Number(tid)), [tid]);
  return (
    <>
      <AdminTitle title="Standings" />
      <p className="mb-4 text-dim">Standings are calculated from saved match results. Enter results to change them.</p>
      <div className="mb-6 max-w-sm"><SelectField label="Tournament" value={tid} onChange={setTid} options={Object.values(lk.tournaments).map(t => ({ value: String(t.id), label: t.name }))} /></div>
      <Panel innerClassName="p-4"><AsyncView state={{ ...s, loading: s.loading || !lk.ready }} skeleton={<SkeletonTable />} isEmpty={d => !d.length} empty={<EmptyState message="No results entered for this tournament yet." />}>{d => <StandingTable rows={d} teams={lk.teams} />}</AsyncView></Panel>
    </>
  );
}
