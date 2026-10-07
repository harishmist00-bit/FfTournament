import { useState, type FormEvent } from 'react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FormField } from '@/components/ui/FormField';
import { SelectField } from '@/components/ui/Controls';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { AsyncView, SkeletonTable } from '@/components/ui/States';
import { useToast } from '@/components/ui/Toast';
import { AdminTitle, IconBtn, TableShell } from '@/components/ui/AdminBits';
import { useAsync } from '@/hooks/useAsync';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { createMatch, deleteMatch, getMatches, updateMatch } from '@/services/matchService';
import { getTournaments } from '@/services/tournamentService';
import type { Match, MatchInput } from '@/types';
import { getErrorMessage } from '@/utils/errors';
import { formatDay, formatTime } from '@/utils/format';

const MAPS = ['Bermuda', 'Purgatory', 'Kalahari', 'Alpine', 'Nexterra'];
const blank = (tid: number): MatchInput => ({ tournamentId: tid, round: 'Group Stage', matchNumber: 1, date: '', time: '19:00', map: 'Bermuda', teamIds: [], roomId: '', roomPassword: '', status: 'upcoming' });

export default function AdminMatches() {
  useDocumentTitle('Manage matches');
  const s = useAsync(() => Promise.all([getMatches(), getTournaments()]), []);
  const [editing, setEditing] = useState<Match | 'new' | null>(null);
  const [f, setF] = useState<MatchInput>(blank(1));
  const [err, setErr] = useState('');
  const { toast, notify } = useToast();
  const open = (m: Match | 'new') => { setEditing(m); setErr(''); if (m === 'new') setF(blank(s.data?.[1][0]?.id ?? 1)); else { const { id: _i, results: _r, code: _c, ...rest } = m; setF(rest); } };
  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!f.date || !f.time || !f.roomId.trim() || !f.roomPassword.trim()) { setErr('Date, time, room ID and room password are required.'); return; }
    try { editing === 'new' ? await createMatch(f) : await updateMatch((editing as Match).id, f); notify('Match saved'); setEditing(null); s.reload(); } catch (x) { setErr(getErrorMessage(x)); }
  };
  return (
    <>
      <AdminTitle title="Matches" action={<Button onClick={() => open('new')}><Plus size={16} /> New match</Button>} />
      <AsyncView state={s} skeleton={<SkeletonTable />}>
        {([matches, tournaments]) => (
          <TableShell><table className="w-full min-w-[820px]"><thead><tr className="border-b border-neon/25">{['Match', 'Tournament', 'Round', 'Date', 'Map', 'Room ID', 'Status', 'Actions'].map(h => <th key={h} className="th">{h}</th>)}</tr></thead>
            <tbody>{matches.map(m => <tr key={m.id} className="border-b border-neon/10 hover:bg-neon/5"><td className="td font-hud font-bold">{m.code}</td><td className="td text-dim">{tournaments.find(t => t.id === m.tournamentId)?.name}</td><td className="td">{m.round}</td><td className="td whitespace-nowrap">{formatDay(m.date)} {formatTime(m.time)}</td><td className="td">{m.map}</td><td className="td font-hud">{m.roomId}</td><td className="td"><StatusBadge status={m.status} /></td>
              <td className="td"><div className="flex gap-2"><IconBtn label={`Edit ${m.code}`} onClick={() => open(m)}><Edit size={16} /></IconBtn><IconBtn danger label={`Delete ${m.code}`} onClick={async () => { await deleteMatch(m.id); notify('Match deleted'); s.reload(); }}><Trash2 size={16} /></IconBtn></div></td></tr>)}</tbody></table></TableShell>
        )}
      </AsyncView>
      <Modal open={!!editing} title={editing === 'new' ? 'New match' : 'Edit match'} onClose={() => setEditing(null)}>
        <form onSubmit={save} noValidate className="grid gap-3 sm:grid-cols-2">
          {err && <p role="alert" className="text-red-400 sm:col-span-2">{err}</p>}
          <div className="sm:col-span-2"><SelectField label="Tournament" value={String(f.tournamentId)} onChange={v => setF({ ...f, tournamentId: Number(v) })} options={(s.data?.[1] ?? []).map(t => ({ value: String(t.id), label: t.name }))} /></div>
          <FormField label="Round" value={f.round} onChange={e => setF({ ...f, round: e.target.value })} />
          <FormField label="Match number" type="number" value={f.matchNumber} onChange={e => setF({ ...f, matchNumber: Number(e.target.value) })} />
          <FormField label="Date" type="date" value={f.date} onChange={e => setF({ ...f, date: e.target.value })} />
          <FormField label="Time" type="time" value={f.time} onChange={e => setF({ ...f, time: e.target.value })} />
          <SelectField label="Map" value={f.map} onChange={v => setF({ ...f, map: v })} options={MAPS.map(m => ({ value: m, label: m }))} />
          <SelectField label="Status" value={f.status} onChange={v => setF({ ...f, status: v as MatchInput['status'] })} options={['upcoming', 'live', 'completed'].map(x => ({ value: x, label: x }))} />
          <FormField label="Room ID" value={f.roomId} onChange={e => setF({ ...f, roomId: e.target.value })} />
          <FormField label="Room password" value={f.roomPassword} onChange={e => setF({ ...f, roomPassword: e.target.value })} />
          <div className="flex justify-end gap-3 sm:col-span-2"><Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button><Button type="submit">Save match</Button></div>
        </form>
      </Modal>
      {toast}
    </>
  );
}
