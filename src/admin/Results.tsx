import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { SelectField } from '@/components/ui/Controls';
import { AsyncView, SkeletonTable } from '@/components/ui/States';
import { useToast } from '@/components/ui/Toast';
import { TeamLogo } from '@/components/ui/TeamLogo';
import { AdminTitle } from '@/components/ui/AdminBits';
import { useAsync } from '@/hooks/useAsync';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getMatches, submitResults } from '@/services/matchService';
import { getTeams } from '@/services/teamService';
import { getErrorMessage } from '@/utils/errors';
import { killPoints, placementPoints, totalPoints } from '@/utils/scoring';

interface Row { teamId: number; placement: number; kills: number }

export default function AdminResults() {
  useDocumentTitle('Enter results');
  const s = useAsync(() => Promise.all([getMatches(), getTeams()]), []);
  const [matchId, setMatchId] = useState('');
  const [rows, setRows] = useState<Row[]>([]);
  const [busy, setBusy] = useState(false);
  const { toast, notify } = useToast();
  const matches = s.data?.[0] ?? [];
  const match = matches.find(m => String(m.id) === matchId);

  useEffect(() => {
    if (!match) { setRows([]); return; }
    setRows(match.teamIds.map((teamId, i) => {
      const r = match.results.find(x => x.teamId === teamId);
      return { teamId, placement: r?.placement ?? i + 1, kills: r?.kills ?? 0 };
    }));
  }, [matchId, s.data]); // eslint-disable-line

  const update = (i: number, k: 'placement' | 'kills', v: number) => setRows(r => r.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
  const dupes = new Set(rows.map(r => r.placement)).size !== rows.length;
  const save = async () => {
    setBusy(true);
    try { await submitResults({ matchId: Number(matchId), entries: rows }); notify('Results saved. Standings updated.'); s.reload(); }
    catch (e) { notify(getErrorMessage(e), 'error'); } finally { setBusy(false); }
  };
  return (
    <>
      <AdminTitle title="Match results" />
      <AsyncView state={s} skeleton={<SkeletonTable />}>
        {([ms, teams]) => {
          const tm = Object.fromEntries(teams.map(t => [t.id, t]));
          return (<>
            <div className="mb-6 max-w-md"><SelectField label="Match" value={matchId} onChange={setMatchId} options={[{ value: '', label: 'Select a match' }, ...ms.map(m => ({ value: String(m.id), label: `${m.code} · ${m.round} · ${m.status}` }))]} /></div>
            {match ? (
              <Panel innerClassName="p-3">
                <div className="overflow-x-auto"><table className="w-full min-w-[640px]"><thead><tr className="border-b border-neon/25"><th className="th">Team</th><th className="th">Placement</th><th className="th">Kills</th><th className="th text-center">Placement pts</th><th className="th text-center">Kill pts</th><th className="th text-center">Total</th></tr></thead>
                  <tbody>{rows.map((r, i) => (
                    <tr key={r.teamId} className="border-b border-neon/10"><td className="td"><span className="flex items-center gap-2 font-display font-bold"><TeamLogo tag={tm[r.teamId].tag} color={tm[r.teamId].color} size={26} name={tm[r.teamId].name} />{tm[r.teamId].name}</span></td>
                      <td className="td"><input aria-label={`${tm[r.teamId].name} placement`} type="number" min={1} max={12} className="input-hud !w-20 !py-1.5" value={r.placement} onChange={e => update(i, 'placement', Number(e.target.value))} /></td>
                      <td className="td"><input aria-label={`${tm[r.teamId].name} kills`} type="number" min={0} className="input-hud !w-20 !py-1.5" value={r.kills} onChange={e => update(i, 'kills', Number(e.target.value))} /></td>
                      <td className="td text-center">{placementPoints(r.placement)}</td><td className="td text-center">{killPoints(r.kills)}</td><td className="td text-center font-hud font-bold text-neon">{totalPoints(r.placement, r.kills)}</td></tr>))}</tbody></table></div>
                <div className="flex flex-wrap items-center gap-4 p-3">
                  <Button onClick={save} disabled={busy || dupes}>{busy ? 'Saving' : 'Save results'}</Button>
                  {dupes && <p role="alert" className="text-red-400">Each team needs a unique placement.</p>}
                  <p className="text-sm text-dim">Placement points + kill points = total points. Standings update on save.</p>
                </div>
              </Panel>
            ) : <p className="text-dim">Choose a match to enter placements and kills.</p>}
          </>);
        }}
      </AsyncView>
      {toast}
    </>
  );
}
