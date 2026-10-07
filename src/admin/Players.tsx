import { useMemo, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { AsyncView, SkeletonTable } from '@/components/ui/States';
import { Pagination, SearchBar } from '@/components/ui/Controls';
import { useToast } from '@/components/ui/Toast';
import { AdminTitle, IconBtn, TableShell } from '@/components/ui/AdminBits';
import { useAsync } from '@/hooks/useAsync';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { deletePlayer, getPlayers } from '@/services/playerService';
import { getTeams } from '@/services/teamService';

const PER = 12;
export default function AdminPlayers() {
  useDocumentTitle('Manage players');
  const s = useAsync(() => Promise.all([getPlayers(), getTeams()]), []);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const { toast, notify } = useToast();
  const list = useMemo(() => (s.data?.[0] ?? []).filter(p => p.ign.toLowerCase().includes(q.toLowerCase())), [s.data, q]);
  const teams = Object.fromEntries((s.data?.[1] ?? []).map(t => [t.id, t]));
  return (
    <>
      <AdminTitle title="Players" action={<SearchBar value={q} onChange={v => { setQ(v); setPage(1); }} placeholder="Search player" />} />
      <AsyncView state={s} skeleton={<SkeletonTable />}>
        {() => (<>
          <TableShell><table className="w-full min-w-[640px]"><thead><tr className="border-b border-neon/25">{['IGN', 'Team', 'Role', 'Matches', 'Kills', 'Actions'].map(h => <th key={h} className="th">{h}</th>)}</tr></thead>
            <tbody>{list.slice((page - 1) * PER, page * PER).map(p => <tr key={p.id} className="border-b border-neon/10 hover:bg-neon/5"><td className="td font-display font-bold">{p.ign}</td><td className="td text-dim">{teams[p.teamId]?.name}</td><td className="td text-neon">{p.role}</td><td className="td">{p.matches}</td><td className="td">{p.kills}</td>
              <td className="td"><IconBtn danger label={`Remove ${p.ign}`} onClick={async () => { await deletePlayer(p.id); notify(`Removed ${p.ign}`); s.reload(); }}><Trash2 size={16} /></IconBtn></td></tr>)}</tbody></table></TableShell>
          <Pagination page={page} pageCount={Math.ceil(list.length / PER)} onChange={setPage} />
        </>)}
      </AsyncView>
      {toast}
    </>
  );
}
