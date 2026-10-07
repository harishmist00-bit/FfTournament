import { mock } from './api';
import { teams, players } from '@/data/db';
import type { Team } from '@/types';
import { ApiError } from '@/utils/errors';

// Django: GET /api/teams/
export const getTeams = (): Promise<Team[]> => mock(() => teams);

// Django: GET /api/teams/:id/
export const getTeam = (id: number): Promise<Team> =>
  mock(() => {
    const t = teams.find(x => x.id === id);
    if (!t) throw new ApiError('Team not found.', 404);
    return t;
  });

// Django: POST /api/teams/
export const createTeam = (input: Pick<Team, 'name' | 'tag' | 'region'>): Promise<Team> =>
  mock(() => {
    if (teams.some(t => t.name.toLowerCase() === input.name.toLowerCase())) throw new ApiError('A team with that name already exists.');
    const id = Math.max(0, ...teams.map(t => t.id)) + 1;
    const team: Team = { id, ...input, captainId: 0, playerIds: [], color: '#39FF14', points: 0, wins: 0, matches: 0, tournamentIds: [] };
    teams.push(team);
    return team;
  });

// Django: PUT /api/teams/:id/
export const updateTeam = (id: number, input: Pick<Team, 'name' | 'tag' | 'region'>): Promise<Team> =>
  mock(() => {
    const t = teams.find(x => x.id === id);
    if (!t) throw new ApiError('Team not found.', 404);
    Object.assign(t, input);
    return t;
  });

// Django: DELETE /api/teams/:id/
export const deleteTeam = (id: number): Promise<void> =>
  mock(() => {
    const i = teams.findIndex(t => t.id === id);
    if (i >= 0) teams.splice(i, 1);
  }, 250);

void players;
