import {
  API_FOOTBALL_BASE_URL,
  PL_LEAGUE_ID,
  PL_LEAGUE_NAME,
  PL_SEASON,
  PL_SEASON_START_ISO,
} from "@/lib/pl/constants";
import type {
  PlStandingRow,
  PlStandingsApiResponse,
  PlStandingsSource,
} from "@/lib/pl/types";

type ApiFootballStandingsEntry = {
  rank: number;
  team: {
    id: number;
    name: string;
    logo: string;
  };
  points: number;
  goalsDiff: number;
  form: string | null;
  status: string | null;
  description: string | null;
  all: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: {
      for: number;
      against: number;
    };
  };
};

type ApiFootballStandingsResponse = {
  errors?: Record<string, string>;
  results?: number;
  response?: Array<{
    league?: {
      standings?: ApiFootballStandingsEntry[][];
    };
  }>;
};

function getApiKey(): string | undefined {
  return process.env.API_FOOTBALL_KEY?.trim() || undefined;
}

export function isPlApiConfigured(): boolean {
  return Boolean(getApiKey());
}

function isSeasonStarted(now: Date = new Date()): boolean {
  return now >= new Date(PL_SEASON_START_ISO);
}

function baseResponse(
  source: PlStandingsSource,
  overrides: Partial<PlStandingsApiResponse> = {},
): PlStandingsApiResponse {
  return {
    configured: isPlApiConfigured(),
    league: PL_LEAGUE_NAME,
    leagueId: PL_LEAGUE_ID,
    season: PL_SEASON,
    standings: [],
    source,
    fetchedAt: new Date().toISOString(),
    ...overrides,
  };
}

function isAuthError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("token") ||
    lower.includes("key") ||
    lower.includes("missing application key") ||
    lower.includes("application key missing")
  );
}

function isQuotaError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("ratelimit") ||
    lower.includes("too many requests") ||
    lower.includes("request limit") ||
    lower.includes("429")
  );
}

function normalizeStanding(entry: ApiFootballStandingsEntry): PlStandingRow {
  return {
    rank: entry.rank,
    teamId: entry.team.id,
    teamName: entry.team.name,
    teamLogo: entry.team.logo || null,
    played: entry.all.played,
    win: entry.all.win,
    draw: entry.all.draw,
    lose: entry.all.lose,
    goalsFor: entry.all.goals.for,
    goalsAgainst: entry.all.goals.against,
    goalDiff: entry.goalsDiff,
    points: entry.points,
    form: entry.form,
    status: entry.status,
    description: entry.description,
  };
}

function mapStandings(payload: ApiFootballStandingsResponse): PlStandingRow[] {
  const groups = payload.response?.[0]?.league?.standings;
  if (!groups?.length) {
    return [];
  }

  return groups.flat().map(normalizeStanding);
}

async function fetchStandingsFromApi(): Promise<PlStandingsApiResponse> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return baseResponse("fallback", { configured: false });
  }

  const path =
    `/standings?league=${PL_LEAGUE_ID}&season=${PL_SEASON}`;
  const res = await fetch(`${API_FOOTBALL_BASE_URL}${path}`, {
    headers: { "x-apisports-key": apiKey },
    next: { revalidate: 0 },
  });

  if (res.status === 429) {
    return baseResponse("fallback", {
      configured: true,
      error: "API rate limit reached. Please retry shortly.",
    });
  }

  if (res.status === 401 || res.status === 403) {
    return baseResponse("fallback", {
      configured: true,
      error: "API key rejected. Check API_FOOTBALL_KEY.",
    });
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`api-sports ${res.status}: ${text.slice(0, 200)}`);
  }

  const payload = (await res.json()) as ApiFootballStandingsResponse;

  if (payload.errors && Object.keys(payload.errors).length > 0) {
    const errorText = JSON.stringify(payload.errors);
    if (isAuthError(errorText)) {
      return baseResponse("fallback", {
        configured: true,
        error: "API key invalid or missing permissions.",
      });
    }
    return baseResponse("fallback", {
      configured: true,
      error: errorText,
    });
  }

  const standings = mapStandings(payload);

  if (!standings.length || payload.results === 0) {
    const message = isSeasonStarted()
      ? "Standings are not yet available for this matchweek."
      : "The 2026/27 Premier League season standings are not yet available.";

    return baseResponse("fallback", {
      configured: true,
      error: message,
    });
  }

  return baseResponse("api-football", {
    configured: true,
    standings,
  });
}

export async function fetchPlStandings(): Promise<PlStandingsApiResponse> {
  if (!isPlApiConfigured()) {
    return baseResponse("fallback", { configured: false });
  }

  try {
    return await fetchStandingsFromApi();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    if (isQuotaError(message)) {
      return baseResponse("fallback", {
        configured: true,
        error: "API rate limit reached. Please retry shortly.",
      });
    }

    throw error;
  }
}

export function plStandingsCacheControl(
  body: PlStandingsApiResponse,
): string {
  if (!body.configured) {
    return "no-store";
  }

  if (body.standings.length > 0 && body.source === "api-football") {
    return "s-maxage=300, stale-while-revalidate=60";
  }

  return "s-maxage=3600, stale-while-revalidate=300";
}
