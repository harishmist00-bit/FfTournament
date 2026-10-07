import { mock } from './api';
import { players } from '@/data/db';
import type { Player } from '@/types';
import { ApiError } from '@/utils/errors';

// Django: GET /api/players/
export const getPlayers = (): Promise<Player[]> => mock(() => players);

// Django: GET /api/players/:id/
export const getPlayer = (id: number): Promise<Player> =>
  mock(() => {
    const p = players.find(x => x.id === id);
    if (!p) throw new ApiError('Player not found.', 404);
    return p;
  });

// Django: GET /api/players/?team=:teamId
export const getPlayersByTeam = (teamId: number): Promise<Player[]> => mock(() => players.filter(p => p.teamId === teamId));

// Django: DELETE /api/players/:id/
export const deletePlayer = (id: number): Promise<void> =>
  mock(() => {
    const i = players.findIndex(p => p.id === id);
    if (i >= 0) players.splice(i, 1);
  }, 250);
