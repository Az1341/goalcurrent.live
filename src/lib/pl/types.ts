import {
  PL_LEAGUE_ID,
  PL_LEAGUE_NAME,
  PL_SEASON,
} from "@/lib/pl/constants";

export type PlStandingsSource = "api-football" | "fallback";

export type PlFixtureStatus =
  | "UPCOMING"
  | "LIVE"
  | "FT"
  | "POSTPONED"
  | "CANCELLED";

export type PlFixtureRow = {
  fixtureId: number;
  kickoffUtc: string;
  matchweek: number | null;
  round: string | null;
  venue: string | null;
  homeTeamId: number;
  homeTeamName: string;
  homeTeamLogo: string | null;
  awayTeamId: number;
  awayTeamName: string;
  awayTeamLogo: string | null;
  status: PlFixtureStatus;
  statusShort: string;
  elapsed: number | null;
  homeScore: number | null;
  awayScore: number | null;
  broadcaster: string;
};

export type PlFixturesApiResponse = {
  configured: boolean;
  league: typeof PL_LEAGUE_NAME;
  leagueId: typeof PL_LEAGUE_ID;
  season: typeof PL_SEASON;
  fixtures: PlFixtureRow[];
  source: PlStandingsSource;
  fetchedAt: string;
  error?: string;
};

export type PlStandingRow = {
  rank: number;
  teamId: number;
  teamName: string;
  teamLogo: string | null;
  played: number;
  win: number;
  draw: number;
  lose: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  form: string | null;
  status: string | null;
  description: string | null;
};

export type PlStandingsApiResponse = {
  configured: boolean;
  league: typeof PL_LEAGUE_NAME;
  leagueId: typeof PL_LEAGUE_ID;
  season: typeof PL_SEASON;
  standings: PlStandingRow[];
  source: PlStandingsSource;
  fetchedAt: string;
  error?: string;
};

export type PlTeamRow = {
  teamId: number;
  name: string;
  logo: string | null;
  founded: number | null;
  venueName: string | null;
  venueCity: string | null;
};

export type PlTeamsApiResponse = {
  configured: boolean;
  league: typeof PL_LEAGUE_NAME;
  leagueId: typeof PL_LEAGUE_ID;
  season: typeof PL_SEASON;
  teams: PlTeamRow[];
  source: PlStandingsSource;
  fetchedAt: string;
  error?: string;
};

export type PlPlayerStatRow = {
  playerId: number;
  name: string;
  photo: string | null;
  position: string | null;
  teamId: number | null;
  teamName: string | null;
  teamLogo: string | null;
  appearances: number | null;
  value: number | null;
};

export type PlPlayersApiResponse = {
  configured: boolean;
  league: typeof PL_LEAGUE_NAME;
  leagueId: typeof PL_LEAGUE_ID;
  season: typeof PL_SEASON;
  players: PlPlayerStatRow[];
  source: PlStandingsSource;
  fetchedAt: string;
  error?: string;
};

export type PlPlayerLeaderboardApiResponse = {
  configured: boolean;
  league: typeof PL_LEAGUE_NAME;
  leagueId: typeof PL_LEAGUE_ID;
  season: typeof PL_SEASON;
  leaders: PlPlayerStatRow[];
  source: PlStandingsSource;
  fetchedAt: string;
  error?: string;
};

export type PlStatisticsBundle = {
  topScorers: PlPlayerStatRow[];
  topAssists: PlPlayerStatRow[];
  cleanSheets: PlPlayerStatRow[];
  discipline: PlPlayerStatRow[];
};

export type PlStatisticsApiResponse = {
  configured: boolean;
  league: typeof PL_LEAGUE_NAME;
  leagueId: typeof PL_LEAGUE_ID;
  season: typeof PL_SEASON;
  statistics: PlStatisticsBundle;
  source: PlStandingsSource;
  fetchedAt: string;
  error?: string;
};

export type PlLiveApiResponse = {
  configured: boolean;
  league: typeof PL_LEAGUE_NAME;
  leagueId: typeof PL_LEAGUE_ID;
  season: typeof PL_SEASON;
  fixtures: PlFixtureRow[];
  source: PlStandingsSource;
  fetchedAt: string;
  error?: string;
};

export type PlTransferRow = {
  playerId: number;
  playerName: string;
  photo: string | null;
  fromTeam: string | null;
  toTeam: string | null;
  type: string | null;
  date: string | null;
};

export type PlTransfersApiResponse = {
  configured: boolean;
  league: typeof PL_LEAGUE_NAME;
  leagueId: typeof PL_LEAGUE_ID;
  season: typeof PL_SEASON;
  transfers: PlTransferRow[];
  supported: boolean;
  source: PlStandingsSource;
  fetchedAt: string;
  error?: string;
};
