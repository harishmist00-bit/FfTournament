import { useState, type FormEvent } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FormField } from '@/components/ui/FormField';
import { SelectField } from '@/components/ui/Controls';
import { AsyncView, SkeletonTable } from '@/components/ui/States';
import { useToast } from '@/components/ui/Toast';
import { AdminTitle, IconBtn, TableShell } from '@/components/ui/AdminBits';
import { useAsync } from '@/hooks/useAsync';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { createNews, deleteNews, getNews } from '@/services/newsService';
import type { NewsCategory } from '@/types';
import { formatLongDate } from '@/utils/format';
import { getErrorMessage } from '@/utils/errors';

const CATS: NewsCategory[] = ['Tournament', 'Announcement', 'Update', 'Community'];

export default function AdminNews() {
  useDocumentTitle('Manage news');
  const s = useAsync(getNews, []);
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ title: '', excerpt: '', category: 'Tournament' as NewsCategory });
  const [err, setErr] = useState('');
  const { toast, notify } = useToast();
  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (f.title.trim().length < 5 || f.excerpt.trim().length < 10) { setErr('Title (5+ characters) and summary (10+ characters) are required.'); return; }
    try { await createNews({ ...f, date: new Date().toISOString().slice(0, 10) }); notify('Article published'); setOpen(false); setF({ title: '', excerpt: '', category: 'Tournament' }); s.reload(); } catch (x) { setErr(getErrorMessage(x)); }
  };
  return (
    <>
      <AdminTitle title="News" action={<Button onClick={() => { setErr(''); setOpen(true); }}><Plus size={16} /> New article</Button>} />
      <AsyncView state={s} skeleton={<SkeletonTable />}>
        {d => <TableShell><table className="w-full min-w-[640px]"><thead><tr className="border-b border-neon/25">{['Title', 'Category', 'Date', 'Actions'].map(h => <th key={h} className="th">{h}</th>)}</tr></thead>
          <tbody>{d.map(n => <tr key={n.id} className="border-b border-neon/10 hover:bg-neon/5"><td className="td font-display font-bold">{n.title}</td><td className="td text-neon">{n.category}</td><td className="td">{formatLongDate(n.date)}</td><td className="td"><IconBtn danger label={`Delete ${n.title}`} onClick={async () => { await deleteNews(n.id); notify('Article deleted'); s.reload(); }}><Trash2 size={16} /></IconBtn></td></tr>)}</tbody></table></TableShell>}
      </AsyncView>
      <Modal open={open} title="New article" onClose={() => setOpen(false)}>
        <form onSubmit={save} noValidate className="space-y-4">
          {err && <p role="alert" className="text-red-400">{err}</p>}
          <FormField label="Title" value={f.title} onChange={e => setF({ ...f, title: e.target.value })} />
          <SelectField label="Category" value={f.category} onChange={v => setF({ ...f, category: v as NewsCategory })} options={CATS.map(c => ({ value: c, label: c }))} />
          <div><label htmlFor="ex" className="mb-1 block text-sm uppercase tracking-wider text-dim">Summary</label><textarea id="ex" rows={3} className="input-hud" value={f.excerpt} onChange={e => setF({ ...f, excerpt: e.target.value })} /></div>
          <div className="flex justify-end gap-3"><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit">Publish</Button></div>
        </form>
      </Modal>
      {toast}
    </>
  );
}
