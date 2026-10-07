import { api, mock } from './api';
import { tournaments, registrations, teams } from '@/data/db';
import type { Registration, RegistrationStatus, Tournament, TournamentInput } from '@/types';
import { ApiError } from '@/utils/errors';

// Django: GET /api/tournaments/
export const getTournaments = (): Promise<Tournament[]> => mock(() => tournaments);

// Django: GET /api/tournaments/:slug/
export const getTournament = (slug: string): Promise<Tournament> =>
  mock(() => {
    const t = tournaments.find(x => x.slug === slug);
    if (!t) throw new ApiError('Tournament not found.', 404);
    return t;
  });

// Django: POST /api/tournaments/
export const createTournament = (input: TournamentInput): Promise<Tournament> =>
  mock(() => {
    if (tournaments.some(t => t.slug === input.slug)) throw new ApiError('That slug is already in use.');
    const t: Tournament = { ...input, id: Math.max(0, ...tournaments.map(x => x.id)) + 1, teamCount: 0 };
    tournaments.unshift(t);
    return t;
  });

// Django: PUT /api/tournaments/:id/
export const updateTournament = (id: number, input: TournamentInput): Promise<Tournament> =>
  mock(() => {
    const i = tournaments.findIndex(t => t.id === id);
    if (i < 0) throw new ApiError('Tournament not found.', 404);
    tournaments[i] = { ...tournaments[i], ...input };
    return tournaments[i];
  });

// Django: DELETE /api/tournaments/:id/
export const deleteTournament = (id: number): Promise<void> =>
  mock(() => {
    const i = tournaments.findIndex(t => t.id === id);
    if (i >= 0) tournaments.splice(i, 1);
  }, 300);

// Django: GET /api/registrations/
export const getRegistrations = (): Promise<Registration[]> => mock(() => registrations);

// Django: PATCH /api/registrations/:id/  { status }
export const updateRegistrationStatus = (id: number, status: RegistrationStatus): Promise<Registration> =>
  mock(() => {
    const r = registrations.find(x => x.id === id);
    if (!r) throw new ApiError('Registration not found.', 404);
    r.status = status;
    const t = tournaments.find(x => x.id === r.tournamentId);
    const team = teams.find(x => x.id === r.teamId);
    if (status === 'approved' && t && team && !team.tournamentIds.includes(t.id)) {
      team.tournamentIds.push(t.id);
      t.teamCount = Math.min(t.maxTeams, t.teamCount + 1);
    }
    return r;
  }, 250);

// Django: POST /api/registrations/
export const registerTeam = (teamId: number, tournamentId: number): Promise<Registration> =>
  mock(() => {
    if (registrations.some(r => r.teamId === teamId && r.tournamentId === tournamentId)) throw new ApiError('This team is already registered.');
    const r: Registration = { id: registrations.length + 1, teamId, tournamentId, date: new Date().toISOString().slice(0, 10), status: 'pending' };
    registrations.push(r);
    return r;
  });

void api; // keeps the import visible for the Django swap
