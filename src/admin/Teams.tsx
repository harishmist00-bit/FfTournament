import { useState, type FormEvent } from 'react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FormField } from '@/components/ui/FormField';
import { AsyncView, SkeletonTable } from '@/components/ui/States';
import { useToast } from '@/components/ui/Toast';
import { AdminTitle, IconBtn, TableShell } from '@/components/ui/AdminBits';
import { TeamLogo } from '@/components/ui/TeamLogo';
import { useAsync } from '@/hooks/useAsync';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { createTeam, deleteTeam, getTeams, updateTeam } from '@/services/teamService';
import { getPlayers } from '@/services/playerService';
import { getTournaments } from '@/services/tournamentService';
import type { Team } from '@/types';
import { getErrorMessage } from '@/utils/errors';

export default function AdminTeams() {
  useDocumentTitle('Manage teams');
  const s = useAsync(() => Promise.all([getTeams(), getPlayers(), getTournaments()]), []);
  const [editing, setEditing] = useState<Team | 'new' | null>(null);
  const [form, setForm] = useState({ name: '', tag: '', region: '' });
  const [err, setErr] = useState('');
  const { toast, notify } = useToast();
  const openForm = (t: Team | 'new') => { setEditing(t); setErr(''); setForm(t === 'new' ? { name: '', tag: '', region: '' } : { name: t.name, tag: t.tag, region: t.region }); };
  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 3 || form.tag.trim().length < 2 || !form.region.trim()) { setErr('Name (3+), tag (2+) and region are required.'); return; }
    try { editing === 'new' ? await createTeam(form) : await updateTeam((editing as Team).id, form); notify('Team saved'); setEditing(null); s.reload(); } catch (x) { setErr(getErrorMessage(x)); }
  };
  const remove = async (t: Team) => { try { await deleteTeam(t.id); notify(`Deleted ${t.name}`); s.reload(); } catch (x) { notify(getErrorMessage(x), 'error'); } };
  return (
    <>
      <AdminTitle title="Teams" action={<Button onClick={() => openForm('new')}><Plus size={16} /> New team</Button>} />
      <AsyncView state={s} skeleton={<SkeletonTable />}>
        {([teams, players, tournaments]) => (
          <TableShell><table className="w-full min-w-[760px]"><thead><tr className="border-b border-neon/25">{['Team', 'Captain', 'Players', 'Tournament', 'Status', 'Actions'].map(h => <th key={h} className="th">{h}</th>)}</tr></thead>
            <tbody>{teams.map(t => { const cap = players.find(p => p.id === t.captainId); const tr = tournaments.find(x => t.tournamentIds.includes(x.id)); return (
              <tr key={t.id} className="border-b border-neon/10 hover:bg-neon/5"><td className="td"><span className="flex items-center gap-2 font-display font-bold"><TeamLogo tag={t.tag} color={t.color} size={28} name={t.name} />{t.name}</span></td><td className="td">{cap?.ign ?? 'Unassigned'}</td><td className="td">{t.playerIds.length}</td><td className="td text-dim">{tr?.name ?? 'None'}</td><td className="td text-neon">{t.tournamentIds.length ? 'Active' : 'Idle'}</td>
                <td className="td"><div className="flex gap-2"><IconBtn label={`Edit ${t.name}`} onClick={() => openForm(t)}><Edit size={16} /></IconBtn><IconBtn danger label={`Delete ${t.name}`} onClick={() => remove(t)}><Trash2 size={16} /></IconBtn></div></td></tr>); })}</tbody></table></TableShell>
        )}
      </AsyncView>
      <Modal open={!!editing} title={editing === 'new' ? 'New team' : 'Edit team'} onClose={() => setEditing(null)}>
        <form onSubmit={save} noValidate className="space-y-4">
          {err && <p role="alert" className="text-red-400">{err}</p>}
          <FormField label="Team name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <div className="grid gap-4 sm:grid-cols-2"><FormField label="Tag" maxLength={4} value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value.toUpperCase() })} /><FormField label="Region" value={form.region} onChange={e => setForm({ ...form, region: e.target.value })} /></div>
          <div className="flex justify-end gap-3"><Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button><Button type="submit">Save team</Button></div>
        </form>
      </Modal>
      {toast}
    </>
  );
}
