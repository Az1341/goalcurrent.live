import {
  PL_LEAGUE_ID,
  PL_LEAGUE_NAME,
  PL_SEASON,
} from "@/lib/pl/constants";

export type PlStandingsSource = "api-football" | "fallback";

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
