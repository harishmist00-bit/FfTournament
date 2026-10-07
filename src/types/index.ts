export type MatchStatus = 'live' | 'upcoming' | 'completed';
export type TournamentStatus = MatchStatus;
export type GameMode = 'Squad' | 'Duo' | 'Solo';
export type RegistrationStatus = 'pending' | 'approved' | 'rejected';
export type Role = 'user' | 'admin';
export type NewsCategory = 'Tournament' | 'Announcement' | 'Update' | 'Community';
export type Form = 'up' | 'down' | 'same';

export interface Tournament {
  id: number;
  slug: string;
  name: string;
  description: string;
  status: TournamentStatus;
  prizePool: number;
  maxTeams: number;
  teamCount: number;
  mode: GameMode;
  startDate: string; // ISO
  endDate: string;
  regStart: string;
  regEnd: string;
  format: string;
  rules: string[];
  prizeDistribution: { place: string; amount: number }[];
  color: string; // accent colour used for generated logo
}

export interface Team {
  id: number;
  name: string;
  tag: string;
  region: string;
  captainId: number;
  playerIds: number[];
  color: string;
  points: number;
  wins: number;
  matches: number;
  tournamentIds: number[];
}

export interface Player {
  id: number;
  ign: string;
  realName: string;
  teamId: number;
  role: 'Captain' | 'Rusher' | 'Sniper' | 'Support' | 'IGL' | 'Substitute';
  country: string;
  matches: number;
  kills: number;
  wins: number;
  avgKills: number;
  avgPlacement: number;
  points: number;
}

export interface MatchResult {
  teamId: number;
  placement: number;
  kills: number;
  placementPoints: number;
  killPoints: number;
  totalPoints: number;
}

export interface Match {
  id: number;
  code: string;
  tournamentId: number;
  round: string;
  matchNumber: number;
  date: string; // ISO date
  time: string; // HH:mm
  map: string;
  teamIds: number[];
  roomId: string;
  roomPassword: string;
  status: MatchStatus;
  results: MatchResult[];
}

export interface Standing {
  id: number;
  tournamentId: number;
  teamId: number;
  group: string;
  rank: number;
  matches: number;
  wins: number;
  kills: number;
  placementPoints: number;
  killPoints: number;
  points: number;
  form: Form;
}

export interface NewsItem {
  id: number;
  slug: string;
  title: string;
  category: NewsCategory;
  date: string;
  excerpt: string;
  body: string[];
  color: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
  teamId?: number;
}

export interface Registration {
  id: number;
  teamId: number;
  tournamentId: number;
  date: string;
  status: RegistrationStatus;
}

export interface AuthTokens { access: string; refresh: string }
export interface LoginPayload { email: string; password: string }
export interface RegisterPayload { username: string; email: string; password: string }
export type TournamentInput = Omit<Tournament, 'id' | 'teamCount'>;
export type MatchInput = Omit<Match, 'id' | 'results' | 'code'>;
export interface ResultInput { matchId: number; entries: { teamId: number; placement: number; kills: number }[] }
