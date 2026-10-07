import { mock } from './api';
import { matches, standings, teams } from '@/data/db';
import type { Match, MatchInput, MatchResult, ResultInput, Standing } from '@/types';
import { ApiError } from '@/utils/errors';
import { killPoints, placementPoints, totalPoints } from '@/utils/scoring';

// Django: GET /api/matches/
export const getMatches = (): Promise<Match[]> => mock(() => matches);

// Django: GET /api/matches/:id/
export const getMatch = (id: number): Promise<Match> =>
  mock(() => {
    const m = matches.find(x => x.id === id);
    if (!m) throw new ApiError('Match not found.', 404);
    return m;
  });

// Django: POST /api/matches/
export const createMatch = (input: MatchInput): Promise<Match> =>
  mock(() => {
    const id = Math.max(0, ...matches.map(m => m.id)) + 1;
    const m: Match = { ...input, id, code: `M${String(id).padStart(2, '0')}`, results: [] };
    matches.push(m);
    return m;
  });

// Django: PUT /api/matches/:id/
export const updateMatch = (id: number, input: MatchInput): Promise<Match> =>
  mock(() => {
    const m = matches.find(x => x.id === id);
    if (!m) throw new ApiError('Match not found.', 404);
    Object.assign(m, input);
    return m;
  });

// Django: DELETE /api/matches/:id/
export const deleteMatch = (id: number): Promise<void> =>
  mock(() => {
    const i = matches.findIndex(m => m.id === id);
    if (i >= 0) matches.splice(i, 1);
  }, 250);

/** Adds (+1) or removes (-1) one match's results to/from the tournament standings. */
function applyToStandings(tournamentId: number, results: MatchResult[], sign: 1 | -1): void {
  for (const r of results) {
    let s: Standing | undefined = standings.find(x => x.tournamentId === tournamentId && x.teamId === r.teamId);
    if (!s) {
      s = { id: standings.length + 1, tournamentId, teamId: r.teamId, group: 'A', rank: 0, matches: 0, wins: 0, kills: 0, placementPoints: 0, killPoints: 0, points: 0, form: 'same' };
      standings.push(s);
    }
    s.matches += sign;
    s.wins += r.placement === 1 ? sign : 0;
    s.kills += r.kills * sign;
    s.placementPoints += r.placementPoints * sign;
    s.killPoints += r.killPoints * sign;
    s.points += r.totalPoints * sign;
    if (sign === 1) s.form = r.placement <= 6 ? 'up' : 'down';
  }
  standings
    .filter(s => s.tournamentId === tournamentId)
    .sort((a, b) => b.points - a.points || b.kills - a.kills)
    .forEach((s, i) => { s.rank = i + 1; });
}

// Django: POST /api/results/   (server computes points + updates standings in one transaction)
export const submitResults = (input: ResultInput): Promise<Match> =>
  mock(() => {
    const m = matches.find(x => x.id === input.matchId);
    if (!m) throw new ApiError('Match not found.', 404);
    const placements = input.entries.map(e => e.placement);
    if (new Set(placements).size !== placements.length) throw new ApiError('Each team needs a unique placement.');
    if (input.entries.some(e => e.placement < 1 || e.kills < 0)) throw new ApiError('Placement must be 1 or higher and kills cannot be negative.');
    applyToStandings(m.tournamentId, m.results, -1); // re-submission replaces earlier results
    m.results = input.entries
      .map(e => ({
        teamId: e.teamId, placement: e.placement, kills: e.kills,
        placementPoints: placementPoints(e.placement), killPoints: killPoints(e.kills), totalPoints: totalPoints(e.placement, e.kills),
      }))
      .sort((a, b) => a.placement - b.placement);
    m.status = 'completed';
    applyToStandings(m.tournamentId, m.results, 1);
    for (const r of m.results) {
      const t = teams.find(x => x.id === r.teamId);
      if (t) t.points = standings.filter(s => s.teamId === t.id).reduce((a, s) => a + s.points, 0);
    }
    return m;
  }, 500);
