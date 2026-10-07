import { useMemo } from 'react';
import { useAsync } from './useAsync';
import { getTeams } from '@/services/teamService';
import { getTournaments } from '@/services/tournamentService';
import type { Team, Tournament } from '@/types';

export interface Lookups { teams: Record<number, Team>; tournaments: Record<number, Tournament>; ready: boolean }

/** Team + tournament lookup maps so cards can resolve ids to names/logos. */
export function useLookups(): Lookups & { error: string | null; reload: () => void } {
  const s = useAsync(() => Promise.all([getTeams(), getTournaments()]), []);
  const maps = useMemo(() => ({
    teams: Object.fromEntries((s.data?.[0] ?? []).map(t => [t.id, t])) as Record<number, Team>,
    tournaments: Object.fromEntries((s.data?.[1] ?? []).map(t => [t.id, t])) as Record<number, Tournament>,
  }), [s.data]);
  return { ...maps, ready: !!s.data, error: s.error, reload: s.reload };
}
