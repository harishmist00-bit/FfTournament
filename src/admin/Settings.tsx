import { Panel } from '@/components/ui/Panel';
import { AdminTitle } from '@/components/ui/AdminBits';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { KILL_POINT, PLACEMENT_POINTS } from '@/utils/scoring';

export default function AdminSettings() {
  useDocumentTitle('Tournament settings');
  return (
    <>
      <AdminTitle title="Settings" />
      <Panel innerClassName="p-6">
        <h2 className="mb-1 font-title text-xl text-white">Scoring system</h2>
        <p className="mb-4 text-dim">Applied to every match result. Each kill is worth {KILL_POINT} point. Editing these values will be handled by the Django settings API.</p>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-5">{Object.entries(PLACEMENT_POINTS).map(([p, v]) => <li key={p} className="border border-neon/25 bg-deep p-3 text-center"><span className="block text-xs text-dim">Rank {p}</span><span className="font-hud text-xl font-bold text-neon">{v}</span></li>)}</ul>
      </Panel>
    </>
  );
}
