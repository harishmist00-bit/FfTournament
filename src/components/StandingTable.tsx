import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Minus } from 'lucide-react';
import { TeamLogo } from './ui/TeamLogo';
import type { Form, Standing, Team } from '@/types';

const RANK_STYLE = ['bg-neon text-void', 'bg-neon2/80 text-void', 'bg-lime/70 text-void'];

export const RankBadge = ({ rank }: { rank: number }) => (
  <span className={`inline-grid h-7 w-7 place-items-center font-hud text-sm font-bold ${rank <= 3 ? RANK_STYLE[rank - 1] : 'bg-deep text-mist'}`}>{rank}</span>
);

export const FormIcon = ({ form }: { form: Form }) =>
  form === 'up' ? <ChevronUp className="text-neon" size={20} aria-label="Rising" /> :
  form === 'down' ? <ChevronDown className="text-red-500" size={20} aria-label="Falling" /> :
  <Minus className="text-dim" size={18} aria-label="No change" />;

interface Props { rows: Standing[]; teams: Record<number, Team>; compact?: boolean }

export function StandingTable({ rows, teams, compact }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full text-sm sm:text-base ${compact ? 'min-w-[420px]' : 'min-w-[860px]'}`}>
        <caption className="sr-only">Tournament standings</caption>
        <thead>
          <tr className="border-b border-neon/25">
            <th className="th w-14">{compact ? '#' : 'Rank'}</th><th className="th">Team</th><th className="th text-center">{compact ? 'M' : 'Matches'}</th>
            {!compact && <th className="th text-center">Wins</th>}<th className="th text-center">Kills</th>
            {!compact && <><th className="th text-center">Placement</th><th className="th text-center">Kill pts</th></>}
            <th className="th text-center">{compact ? 'Pts' : 'Total pts'}</th><th className="th text-center">Form</th>
          </tr>
        </thead>
        <tbody data-rows>
          {rows.map(s => {
            const t = teams[s.teamId];
            return (
              <tr key={s.id} className={`border-b border-neon/10 transition hover:bg-neon/10 ${s.rank === 1 ? 'bg-neon/10 shadow-[inset_3px_0_0_#39FF14]' : s.rank <= 3 && !compact ? 'bg-neon/5' : ''}`}>
                <td className="td"><RankBadge rank={s.rank} /></td>
                <td className="td">
                  {t && <Link to={`/teams/${t.id}`} className="flex items-center gap-2 font-display font-bold uppercase text-white hover:text-neon"><TeamLogo tag={t.tag} color={t.color} size={28} name={t.name} />{t.name}</Link>}
                </td>
                <td className="td text-center">{s.matches}</td>
                {!compact && <td className="td text-center">{s.wins}</td>}
                <td className="td text-center">{s.kills}</td>
                {!compact && <><td className="td text-center">{s.placementPoints}</td><td className="td text-center">{s.killPoints}</td></>}
                <td className="td text-center font-hud font-bold text-neon">{s.points}</td>
                <td className="td"><span className="flex justify-center"><FormIcon form={s.form} /></span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
