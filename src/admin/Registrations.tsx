import { Check, X } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { AsyncView, EmptyState, SkeletonTable } from '@/components/ui/States';
import { useToast } from '@/components/ui/Toast';
import { AdminTitle, IconBtn, TableShell } from '@/components/ui/AdminBits';
import { useAsync } from '@/hooks/useAsync';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getRegistrations, getTournaments, updateRegistrationStatus } from '@/services/tournamentService';
import { getTeams } from '@/services/teamService';
import { getPlayers } from '@/services/playerService';
import type { RegistrationStatus } from '@/types';
import { getErrorMessage } from '@/utils/errors';
import { formatLongDate } from '@/utils/format';

export default function AdminRegistrations() {
  useDocumentTitle('Registrations');
  const s = useAsync(() => Promise.all([getRegistrations(), getTeams(), getTournaments(), getPlayers()]), []);
  const { toast, notify } = useToast();
  const set = async (id: number, st: RegistrationStatus) => { try { await updateRegistrationStatus(id, st); notify(`Registration ${st}`); s.reload(); } catch (e) { notify(getErrorMessage(e), 'error'); } };
  return (
    <>
      <AdminTitle title="Registrations" />
      <AsyncView state={s} skeleton={<SkeletonTable />} isEmpty={d => !d[0].length} empty={<EmptyState message="No registrations to review." />}>
        {([regs, teams, tournaments, players]) => (
          <TableShell><table className="w-full min-w-[820px]"><thead><tr className="border-b border-neon/25">{['Team', 'Tournament', 'Captain', 'Players', 'Date', 'Status', 'Actions'].map(h => <th key={h} className="th">{h}</th>)}</tr></thead>
            <tbody>{regs.map(r => { const t = teams.find(x => x.id === r.teamId); const cap = players.find(p => p.id === t?.captainId); return (
              <tr key={r.id} className="border-b border-neon/10 hover:bg-neon/5"><td className="td font-display font-bold">{t?.name}</td><td className="td text-dim">{tournaments.find(x => x.id === r.tournamentId)?.name}</td><td className="td">{cap?.ign}</td><td className="td">{t?.playerIds.length}</td><td className="td">{formatLongDate(r.date)}</td><td className="td"><StatusBadge status={r.status} /></td>
                <td className="td"><div className="flex gap-2"><IconBtn label="Approve registration" onClick={() => set(r.id, 'approved')}><Check size={16} /></IconBtn><IconBtn danger label="Reject registration" onClick={() => set(r.id, 'rejected')}><X size={16} /></IconBtn></div></td></tr>); })}</tbody></table></TableShell>
        )}
      </AsyncView>
      {toast}
    </>
  );
}
