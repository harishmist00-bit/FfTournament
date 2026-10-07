import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { AsyncView, EmptyState, SkeletonTable } from '@/components/ui/States';
import { useToast } from '@/components/ui/Toast';
import { AdminTitle, IconBtn, TableShell } from '@/components/ui/AdminBits';
import { useAsync } from '@/hooks/useAsync';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { deleteTournament, getTournaments } from '@/services/tournamentService';
import type { Tournament } from '@/types';
import { formatDay, formatINR } from '@/utils/format';
import { getErrorMessage } from '@/utils/errors';

export default function AdminTournaments() {
  useDocumentTitle('Manage tournaments');
  const s = useAsync(getTournaments, []);
  const nav = useNavigate();
  const [del, setDel] = useState<Tournament | null>(null);
  const { toast, notify } = useToast();
  const remove = async () => {
    if (!del) return;
    try { await deleteTournament(del.id); notify(`Deleted ${del.name}`); setDel(null); s.reload(); } catch (e) { notify(getErrorMessage(e), 'error'); }
  };
  return (
    <>
      <AdminTitle title="Tournaments" action={<Button to="/admin/tournaments/create"><Plus size={16} /> Create tournament</Button>} />
      <AsyncView state={s} skeleton={<SkeletonTable />} isEmpty={d => !d.length} empty={<EmptyState message="No tournaments yet. Create the first one." />}>
        {d => <TableShell><table className="w-full min-w-[760px]"><thead><tr className="border-b border-neon/25">{['Name', 'Status', 'Teams', 'Prize', 'Start date', 'Actions'].map(h => <th key={h} className="th">{h}</th>)}</tr></thead>
          <tbody>{d.map(t => <tr key={t.id} className="border-b border-neon/10 hover:bg-neon/5"><td className="td font-display font-bold">{t.name}</td><td className="td"><StatusBadge status={t.status} /></td><td className="td">{t.teamCount}/{t.maxTeams}</td><td className="td">{formatINR(t.prizePool)}</td><td className="td">{formatDay(t.startDate)}</td>
            <td className="td"><div className="flex gap-2"><Link to={`/tournaments/${t.slug}`} aria-label={`View ${t.name}`} className="grid h-8 w-8 place-items-center border border-neon/30 hover:border-neon hover:text-neon"><Eye size={16} /></Link><IconBtn label={`Edit ${t.name}`} onClick={() => nav(`/admin/tournaments/${t.id}/edit`)}><Edit size={16} /></IconBtn><IconBtn danger label={`Delete ${t.name}`} onClick={() => setDel(t)}><Trash2 size={16} /></IconBtn></div></td></tr>)}</tbody></table></TableShell>}
      </AsyncView>
      <Modal open={!!del} title="Delete tournament" onClose={() => setDel(null)}>
        <p className="mb-5 text-dim">Delete <strong className="text-white">{del?.name}</strong>? This cannot be undone.</p>
        <div className="flex justify-end gap-3"><Button variant="ghost" onClick={() => setDel(null)}>Cancel</Button><Button variant="danger" onClick={remove}>Delete</Button></div>
      </Modal>
      {toast}
    </>
  );
}
