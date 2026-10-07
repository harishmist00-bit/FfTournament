import type { Match, MatchResult, NewsItem, Player, Registration, Standing, Team, Tournament, User } from '@/types';
import { totalPoints, placementPoints, killPoints } from '@/utils/scoring';

const COLORS = ['#39FF14', '#FF3B3B', '#2BD9FF', '#FFC400', '#B36BFF', '#00E676', '#FF7A1A', '#4D8DFF', '#FF4FA3', '#B7FF00'];

/* ---------- Teams ---------- */
const TEAM_DEFS: [string, string, string][] = [
  ['Team Hotshot', 'HOT', 'Tamil Nadu'], ['House of Blood', 'HOB', 'Karnataka'], ['Team TG', 'TG', 'Tamil Nadu'],
  ['Team EG', 'EG', 'Kerala'], ['No Chance ES', 'NC', 'Maharashtra'], ['Revengers', 'REV', 'Telangana'],
  ['Demons Pride', 'DMP', 'Tamil Nadu'], ['Infinity PK', 'INF', 'Andhra Pradesh'], ['Dragon Esports', 'DRG', 'Assam'],
  ['Night Raiders', 'NRD', 'Delhi'], ['Warrior X', 'WRX', 'Punjab'], ['Hunters', 'HNT', 'Tamil Nadu'],
  ['Shadows', 'SHD', 'Kerala'], ['Team X', 'TX', 'Gujarat'], ['Legends', 'LGD', 'West Bengal'],
  ['Tamilan Esports', 'TMZ', 'Tamil Nadu'], ['Vellore Boys', 'VLB', 'Tamil Nadu'], ['Kongu Kings', 'KGK', 'Tamil Nadu'],
  ['Madurai Mavericks', 'MDM', 'Tamil Nadu'], ['Chennai Chargers', 'CHC', 'Tamil Nadu'],
];
const BASE_POINTS = [204, 173, 158, 125, 124, 115, 97, 96, 92, 88, 83, 79, 74, 70, 66, 61, 55, 50, 44, 38];

/* ---------- Players ---------- */
const IGN_A = ['Shadow', 'Viper', 'Blaze', 'Ghost', 'Rogue', 'Nova', 'Titan', 'Cobra', 'Falcon', 'Raven', 'Storm', 'Ronin', 'Saber', 'Zephyr', 'Hydra', 'Phantom', 'Bolt', 'Ember', 'Rex', 'Onyx'];
const IGN_B = ['FF', 'XD', 'OP', 'Kai', 'Zero', 'Prime', 'Edge', 'Wolf', 'Fury', 'Pro'];
const ROLES: Player['role'][] = ['Captain', 'IGL', 'Rusher', 'Sniper', 'Support'];

export const teams: Team[] = TEAM_DEFS.map(([name, tag, region], i) => ({
  id: i + 1, name, tag, region, captainId: i * 5 + 1,
  playerIds: [1, 2, 3, 4, 5].map(k => i * 5 + k),
  color: COLORS[i % COLORS.length], points: BASE_POINTS[i], wins: Math.max(1, 6 - Math.floor(i / 3)), matches: 12,
  tournamentIds: [1, 2 + (i % 3)].filter((v, idx, a) => a.indexOf(v) === idx),
}));

export const players: Player[] = teams.flatMap((t, ti) =>
  [1, 2, 3, 4, 5].map((k, ki) => {
    const id = ti * 5 + k;
    const matches = 40 + ((id * 7) % 30);
    const kills = Math.round(matches * (1.6 + ((id * 13) % 20) / 10));
    return {
      id, ign: `${IGN_A[(id * 3) % IGN_A.length]}${IGN_B[(id * 7) % IGN_B.length]}`, realName: 'Verified Player',
      teamId: t.id, role: ki === 4 && ti % 2 === 0 ? 'Substitute' : ROLES[ki], country: 'India',
      matches, kills, wins: Math.round(matches * 0.18), avgKills: +(kills / matches).toFixed(2),
      avgPlacement: +(3 + ((id * 11) % 70) / 10).toFixed(1), points: Math.round(kills * 1.0 + matches * 2.2),
    } as Player;
  }),
);

/* ---------- Tournaments ---------- */
const std = (prize: number) => [
  { place: '1st', amount: Math.round(prize * 0.5) }, { place: '2nd', amount: Math.round(prize * 0.3) }, { place: '3rd', amount: Math.round(prize * 0.2) },
];
const RULES = [
  'Squads of four players plus one optional substitute.',
  'Teams must join the custom room 10 minutes before the start time.',
  'Emulators and third-party tools are strictly prohibited.',
  'Placement points: 12, 9, 8, 7, 6, 5, 4, 3, 2, 1. Each kill adds 1 point.',
  'Organizer decisions on disputes are final.',
];
const T: [string, string, Tournament['status'], number, number, number, Tournament['mode'], string, string, string, string][] = [
  ['FF Battle Cup 2026', 'ff-battle-cup-2026', 'live', 50000, 32, 32, 'Squad', '2026-10-20', '2026-10-25', '2026-09-20', '2026-10-15'],
  ['Coimbatore Open', 'coimbatore-open', 'upcoming', 25000, 16, 16, 'Squad', '2026-11-01', '2026-11-05', '2026-10-05', '2026-10-28'],
  ['Tamil Nadu Championship', 'tamil-nadu-championship', 'upcoming', 100000, 64, 48, 'Squad', '2026-11-10', '2026-11-15', '2026-10-10', '2026-11-05'],
  ['Friendly War', 'friendly-war', 'upcoming', 15000, 24, 24, 'Squad', '2026-11-20', '2026-11-22', '2026-10-12', '2026-11-15'],
  ['Southern Showdown', 'southern-showdown', 'live', 75000, 48, 48, 'Squad', '2026-10-05', '2026-10-12', '2026-09-01', '2026-10-01'],
  ['Madurai Duo Rush', 'madurai-duo-rush', 'upcoming', 10000, 32, 20, 'Duo', '2026-12-02', '2026-12-04', '2026-10-20', '2026-11-28'],
  ['Kongu Clash', 'kongu-clash', 'completed', 30000, 24, 24, 'Squad', '2026-08-10', '2026-08-14', '2026-07-10', '2026-08-05'],
  ['Chennai Night Series', 'chennai-night-series', 'completed', 40000, 32, 32, 'Squad', '2026-07-15', '2026-07-20', '2026-06-15', '2026-07-10'],
  ['Lone Wolf Solo Cup', 'lone-wolf-solo-cup', 'completed', 8000, 100, 100, 'Solo', '2026-06-05', '2026-06-06', '2026-05-10', '2026-06-01'],
  ['Monsoon Masters', 'monsoon-masters', 'completed', 60000, 40, 40, 'Squad', '2026-05-12', '2026-05-18', '2026-04-10', '2026-05-08'],
];
export const tournaments: Tournament[] = T.map(([name, slug, status, prizePool, maxTeams, teamCount, mode, startDate, endDate, regStart, regEnd], i) => ({
  id: i + 1, slug, name, status, prizePool, maxTeams, teamCount, mode, startDate, endDate, regStart, regEnd,
  description: `${name} is a ${mode.toLowerCase()} Free Fire tournament with a ${prizePool.toLocaleString('en-IN')} rupee prize pool. ${maxTeams} entries battle across multiple maps for ranking points and the championship trophy.`,
  format: `${maxTeams > 32 ? 'Group stage into grand finals' : 'Round-robin league into grand finals'}, played on Bermuda, Purgatory and Kalahari. Points are totalled across all matches.`,
  rules: RULES, prizeDistribution: std(prizePool), color: COLORS[(i * 3) % COLORS.length],
}));

/* ---------- Matches ---------- */
const MAPS = ['Bermuda', 'Purgatory', 'Kalahari', 'Alpine', 'Nexterra'];
const TIMES = ['19:00', '20:15', '18:30', '21:00', '22:30'];
const matchStatus = (i: number): Match['status'] => (i < 8 ? 'completed' : i === 8 ? 'live' : 'upcoming');
export const matches: Match[] = Array.from({ length: 24 }, (_, i) => {
  const tId = i < 8 ? 1 : i % 3 === 0 ? 2 : i % 3 === 1 ? 3 : 5;
  const start = i % 4;
  const teamIds = Array.from({ length: 12 }, (_, k) => ((start * 3 + k) % 20) + 1);
  const status = matchStatus(i);
  const day = 20 + Math.floor(i / 5);
  const m: Match = {
    id: i + 1, code: `M${String(i + 1).padStart(2, '0')}`, tournamentId: tId,
    round: i < 12 ? 'Group Stage' : 'Grand Finals', matchNumber: i + 1,
    date: `2026-10-${String(Math.min(day, 30)).padStart(2, '0')}`, time: TIMES[i % 5], map: MAPS[i % 5], teamIds,
    roomId: String(5200000 + i * 137), roomPassword: `FF${(1000 + i * 73) % 10000}`, status, results: [],
  };
  if (status === 'completed') {
    m.results = teamIds.map((teamId, k): MatchResult => {
      const placement = ((k + i) % 12) + 1;
      const kills = Math.max(0, 8 - placement + ((teamId + i) % 3));
      return { teamId, placement, kills, placementPoints: placementPoints(placement), killPoints: killPoints(kills), totalPoints: totalPoints(placement, kills) };
    }).sort((a, b) => a.placement - b.placement);
  }
  return m;
});

/* ---------- Standings (tournament 1, two groups) ---------- */
const KILLS = [103, 95, 76, 49, 53, 51, 31, 43, 40, 38, 35, 33, 30, 28, 25, 22, 20, 18, 15, 12];
const FORMS: Standing['form'][] = ['up', 'up', 'same', 'down', 'up', 'up', 'down', 'same'];
export const standings: Standing[] = teams.map((t, i) => ({
  id: i + 1, tournamentId: 1, teamId: t.id, group: i % 2 === 0 ? 'A' : 'B', rank: i + 1, matches: 12,
  wins: t.wins, kills: KILLS[i], killPoints: KILLS[i], placementPoints: t.points - KILLS[i], points: t.points, form: FORMS[i % FORMS.length],
}));

/* ---------- News ---------- */
const N: [string, NewsItem['category'], string, string][] = [
  ['FF Battle Cup 2026 Registration Open', 'Tournament', '2026-10-18', 'Get ready for the biggest Free Fire tournament of the year. Squad slots are filling fast.'],
  ['New Map Added to Custom Rooms', 'Announcement', '2026-10-16', 'A brand new battleground is now live in custom rooms and arrives in tournament rotation next month.'],
  ['Tournament Rules and Prize Pool Updated', 'Update', '2026-10-14', 'Check the latest scoring table, prize pool details and important guidelines before you register.'],
  ['Team TG Wins Coimbatore Open', 'Community', '2026-10-12', 'Team TG takes the crown at Coimbatore Open after a dominant final day performance.'],
  ['Tamil Nadu Championship Slots Announced', 'Tournament', '2026-10-10', 'Sixty-four squads will fight for a one lakh rupee prize pool across six match days.'],
  ['Anti-Cheat Policy Strengthened', 'Announcement', '2026-10-08', 'All rooms now use stricter verification. Read what changes for players and team captains.'],
  ['Season Ranking Points Explained', 'Update', '2026-10-06', 'How placement points and kill points combine to decide your season standing.'],
  ['Community Scrims Every Friday', 'Community', '2026-10-04', 'Open scrims for registered teams start this Friday on our Discord server.'],
  ['Friendly War Trailer Released', 'Tournament', '2026-10-02', 'Twenty-four teams, three days, one champion. Watch the Friendly War announcement trailer.'],
  ['Caster Applications Now Open', 'Community', '2026-10-01', 'Want to commentate on upcoming broadcasts? Apply to join the FF Battle Arena caster pool.'],
];
export const news: NewsItem[] = N.map(([title, category, date, excerpt], i) => ({
  id: i + 1, slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''), title, category, date, excerpt,
  body: [excerpt, 'Organizers confirmed that all announcements will be mirrored on the official Discord server and match-day broadcasts.', 'Team captains should review the updated rulebook before submitting their registration.'],
  color: COLORS[(i * 2) % COLORS.length],
}));

/* ---------- Users & registrations ---------- */
export const users: User[] = [
  { id: 1, username: 'ArenaAdmin', email: 'admin@ffbattlearena.gg', role: 'admin' },
  { id: 2, username: 'ShadowFF', email: 'player@ffbattlearena.gg', role: 'user', teamId: 3 },
];
export const registrations: Registration[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1, teamId: i + 9, tournamentId: [2, 3, 4][i % 3], date: `2026-10-${String(1 + i).padStart(2, '0')}`,
  status: (i % 4 === 0 ? 'approved' : i % 5 === 0 ? 'rejected' : 'pending') as Registration['status'],
}));
