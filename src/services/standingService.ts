import { mock } from './api';
import { standings } from '@/data/db';
import type { Standing } from '@/types';

// Django: GET /api/standings/?tournament=:id&group=:g
export const getStandings = (tournamentId?: number, group?: string): Promise<Standing[]> =>
  mock(() =>
    standings
      .filter(s => (tournamentId ? s.tournamentId === tournamentId : true) && (group && group !== 'All' ? s.group === group : true))
      .sort((a, b) => b.points - a.points || b.kills - a.kills)
      .map((s, i) => ({ ...s, rank: i + 1 })),
  );
