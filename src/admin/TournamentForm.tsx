import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { FormField } from '@/components/ui/FormField';
import { SelectField } from '@/components/ui/Controls';
import { AdminTitle } from '@/components/ui/AdminBits';
import { LoadingSpinner } from '@/components/ui/States';
import { useToast } from '@/components/ui/Toast';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { createTournament, getTournaments, updateTournament } from '@/services/tournamentService';
import type { GameMode, TournamentInput, TournamentStatus } from '@/types';
import { getErrorMessage } from '@/utils/errors';
import { slugify } from '@/utils/format';

const EMPTY: TournamentInput = {
  name: '', slug: '', description: '', status: 'upcoming', prizePool: 10000, maxTeams: 16, mode: 'Squad', startDate: '', endDate: '', regStart: '', regEnd: '',
  format: 'Round-robin league into grand finals.', rules: ['Squads of four players plus one optional substitute.'], prizeDistribution: [{ place: '1st', amount: 5000 }, { place: '2nd', amount: 3000 }, { place: '3rd', amount: 2000 }], color: '#39FF14',
};

export default function TournamentForm() {
  const { id } = useParams();
  const editing = !!id;
  useDocumentTitle(editing ? 'Edit tournament' : 'Create tournament');
  const nav = useNavigate();
  const [f, setF] = useState<TournamentInput>(EMPTY);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(editing);
  const [busy, setBusy] = useState(false);
  const { toast, notify } = useToast();

  useEffect(() => {
    if (!id) return;
    getTournaments().then(all => { const t = all.find(x => x.id === Number(id)); if (t) { const { id: _i, teamCount: _c, ...rest } = t; setF(rest); } }).catch(e => notify(getErrorMessage(e), 'error')).finally(() => setLoading(false));
  }, [id]); // eslint-disable-line

  const text = (k: keyof TournamentInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF(p => ({ ...p, [k]: e.target.value, ...(k === 'name' && !editing ? { slug: slugify(e.target.value) } : {}) }));
  const num = (k: 'prizePool' | 'maxTeams') => (e: React.ChangeEvent<HTMLInputElement>) => setF(p => ({ ...p, [k]: Number(e.target.value) }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const v: Record<string, string> = {};
    if (f.name.trim().length < 3) v.name = 'Name must be at least 3 characters.';
    if (!f.slug) v.slug = 'Slug is required.';
    if (f.maxTeams < 2) v.maxTeams = 'At least 2 teams.';
    if (f.prizePool < 0) v.prizePool = 'Prize cannot be negative.';
    (['regStart', 'regEnd', 'startDate', 'endDate'] as const).forEach(k => { if (!f[k]) v[k] = 'Required.'; });
    if (f.startDate && f.endDate && f.endDate < f.startDate) v.endDate = 'End date must be after start date.';
    setErrs(v);
    if (Object.keys(v).length) return;
    setBusy(true);
    try { if (editing) await updateTournament(Number(id), f); else await createTournament(f); nav('/admin/tournaments'); }
    catch (x) { notify(getErrorMessage(x), 'error'); } finally { setBusy(false); }
  };
  if (loading) return <LoadingSpinner />;
  return (
    <>
      <AdminTitle title={editing ? 'Edit tournament' : 'Create tournament'} />
      <Panel innerClassName="p-6">
        <form onSubmit={submit} noValidate className="grid gap-4 md:grid-cols-2">
          <FormField label="Name" value={f.name} onChange={text('name')} error={errs.name} />
          <FormField label="Slug" value={f.slug} onChange={text('slug')} error={errs.slug} />
          <div className="md:col-span-2"><label htmlFor="desc" className="mb-1 block text-sm uppercase tracking-wider text-dim">Description</label><textarea id="desc" rows={3} className="input-hud" value={f.description} onChange={text('description')} /></div>
          <FormField label="Logo URL" placeholder="Upload handled by backend later" disabled />
          <FormField label="Banner URL" placeholder="Upload handled by backend later" disabled />
          <FormField label="Prize pool (INR)" type="number" value={f.prizePool} onChange={num('prizePool')} error={errs.prizePool} />
          <FormField label="Max teams" type="number" value={f.maxTeams} onChange={num('maxTeams')} error={errs.maxTeams} />
          <FormField label="Registration start" type="date" value={f.regStart} onChange={text('regStart')} error={errs.regStart} />
          <FormField label="Registration end" type="date" value={f.regEnd} onChange={text('regEnd')} error={errs.regEnd} />
          <FormField label="Tournament start" type="date" value={f.startDate} onChange={text('startDate')} error={errs.startDate} />
          <FormField label="Tournament end" type="date" value={f.endDate} onChange={text('endDate')} error={errs.endDate} />
          <SelectField label="Game mode" value={f.mode} onChange={v => setF(p => ({ ...p, mode: v as GameMode }))} options={['Squad', 'Duo', 'Solo'].map(x => ({ value: x, label: x }))} />
          <SelectField label="Status" value={f.status} onChange={v => setF(p => ({ ...p, status: v as TournamentStatus }))} options={['upcoming', 'live', 'completed'].map(x => ({ value: x, label: x }))} />
          <div className="flex gap-3 md:col-span-2"><Button type="submit" disabled={busy}>{busy ? 'Saving' : editing ? 'Save changes' : 'Create tournament'}</Button><Button variant="ghost" onClick={() => nav('/admin/tournaments')}>Cancel</Button></div>
        </form>
      </Panel>
      {toast}
    </>
  );
}
