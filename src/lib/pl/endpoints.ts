import { PL_LEAGUE_ID, PL_SEASON } from "@/lib/pl/constants";
import { resolvePlBroadcasterFromLocale } from "@/lib/pl/pl-broadcasters";
import {
  apiFootballFetch,
  isQuotaError,
  plBaseEnvelope,
  plGenericCacheControl,
  type ApiFootballFetchResult,
} from "@/lib/pl/api-core";
import type {
  PlFixtureRow,
  PlFixtureStatus,
  PlLiveApiResponse,
  PlPlayerLeaderboardApiResponse,
  PlPlayerStatRow,
  PlPlayersApiResponse,
  PlStatisticsApiResponse,
  PlStatisticsBundle,
  PlTeamRow,
  PlTeamsApiResponse,
  PlTransferRow,
  PlTransfersApiResponse,
} from "@/lib/pl/types";

type ApiTeamItem = {
  team: {
    id: number;
    name: string;
    logo: string;
    founded: number | null;
  };
  venue?: {
    name?: string | null;
    city?: string | null;
  } | null;
};

type ApiPlayerLeaderItem = {
  player: {
    id: number;
    name: string;
    photo: string | null;
    position: string | null;
  };
  statistics: Array<{
    team: { id: number; name: string; logo: string };
    games?: { appearences?: number | null };
    goals?: {
      total?: number | null;
      assists?: number | null;
      saves?: number | null;
      conceded?: number | null;
    };
    cards?: {
      yellow?: number | null;
      red?: number | null;
    };
    penalty?: { saved?: number | null };
  }>;
};

type ApiFixtureItem = {
  fixture: {
    id: number;
    date: string;
    status: { short: string; elapsed: number | null };
    venue?: { name?: string | null; city?: string | null } | null;
  };
  league: { round?: string | null };
  teams: {
    home: { id: number; name: string; logo: string };
    away: { id: number; name: string; logo: string };
  };
  goals: { home: number | null; away: number | null };
};

function mapFetchError<T extends { configured: boolean; source: "api-football" | "fallback"; error?: string }>(
  base: T,
  result: Extract<ApiFootballFetchResult<unknown>, { ok: false }>,
): T {
  if (result.kind === "unconfigured") {
    return { ...base, configured: false, source: "fallback" };
  }
  return {
    ...base,
    configured: true,
    source: "fallback",
    error: result.message,
  };
}

function mapFixtureStatus(short: string): PlFixtureStatus {
  const code = short.trim().toUpperCase();
  if (code === "FT" || code === "AET" || code === "PEN") return "FT";
  if (
    code === "1H" ||
    code === "2H" ||
    code === "HT" ||
    code === "ET" ||
    code === "BT" ||
    code === "P" ||
    code === "INT" ||
    code === "LIVE"
  ) {
    return "LIVE";
  }
  if (code === "PST") return "POSTPONED";
  if (code === "CANC" || code === "ABD" || code === "AWD" || code === "WO") {
    return "CANCELLED";
  }
  return "UPCOMING";
}

function parseMatchweek(round: string | null | undefined): number | null {
  if (!round) return null;
  const match = round.match(/(\d+)\s*$/);
  if (!match) return null;
  const value = Number.parseInt(match[1], 10);
  return Number.isFinite(value) ? value : null;
}

function normalizeFixture(item: ApiFixtureItem, locale: string): PlFixtureRow {
  const status = mapFixtureStatus(item.fixture.status.short);
  const hasScore =
    status === "FT" || status === "LIVE"
      ? item.goals.home !== null && item.goals.away !== null
      : false;

  const venueParts = [item.fixture.venue?.name, item.fixture.venue?.city].filter(
    Boolean,
  );

  return {
    fixtureId: item.fixture.id,
    kickoffUtc: new Date(item.fixture.date).toISOString(),
    matchweek: parseMatchweek(item.league.round),
    round: item.league.round ?? null,
    venue: venueParts.length ? venueParts.join(", ") : null,
    homeTeamId: item.teams.home.id,
    homeTeamName: item.teams.home.name,
    homeTeamLogo: item.teams.home.logo || null,
    awayTeamId: item.teams.away.id,
    awayTeamName: item.teams.away.name,
    awayTeamLogo: item.teams.away.logo || null,
    status,
    statusShort: item.fixture.status.short,
    elapsed: item.fixture.status.elapsed,
    homeScore: hasScore ? item.goals.home : null,
    awayScore: hasScore ? item.goals.away : null,
    broadcaster: resolvePlBroadcasterFromLocale(locale),
  };
}

function normalizeTeam(item: ApiTeamItem): PlTeamRow {
  return {
    teamId: item.team.id,
    name: item.team.name,
    logo: item.team.logo || null,
    founded: item.team.founded,
    venueName: item.venue?.name ?? null,
    venueCity: item.venue?.city ?? null,
  };
}

function pickPrimaryStat(
  item: ApiPlayerLeaderItem,
): ApiPlayerLeaderItem["statistics"][number] | undefined {
  return item.statistics[0];
}

function normalizePlayerLeader(
  item: ApiPlayerLeaderItem,
  value: number | null,
): PlPlayerStatRow {
  const stat = pickPrimaryStat(item);
  return {
    playerId: item.player.id,
    name: item.player.name,
    photo: item.player.photo,
    position: item.player.position,
    teamId: stat?.team.id ?? null,
    teamName: stat?.team.name ?? null,
    teamLogo: stat?.team.logo ?? null,
    appearances: stat?.games?.appearences ?? null,
    value,
  };
}

function normalizeTopScorers(items: ApiPlayerLeaderItem[]): PlPlayerStatRow[] {
  return items.map((item) =>
    normalizePlayerLeader(item, pickPrimaryStat(item)?.goals?.total ?? null),
  );
}

function normalizeTopAssists(items: ApiPlayerLeaderItem[]): PlPlayerStatRow[] {
  return items.map((item) =>
    normalizePlayerLeader(item, pickPrimaryStat(item)?.goals?.assists ?? null),
  );
}

function normalizeDiscipline(items: ApiPlayerLeaderItem[]): PlPlayerStatRow[] {
  return items.map((item) => {
    const stat = pickPrimaryStat(item);
    const cards =
      (stat?.cards?.yellow ?? 0) + (stat?.cards?.red ?? 0) * 2;
    return normalizePlayerLeader(item, cards > 0 ? cards : null);
  });
}

async function fetchPlayerLeaderboard(
  path: string,
  mapper: (items: ApiPlayerLeaderItem[]) => PlPlayerStatRow[],
  emptyMessage: string,
): Promise<PlPlayerLeaderboardApiResponse> {
  const base = plBaseEnvelope("fallback", { leaders: [] as PlPlayerStatRow[] });

  if (!base.configured) {
    return base;
  }

  try {
    const result = await apiFootballFetch<ApiPlayerLeaderItem[]>(path);
    if (!result.ok) {
      return mapFetchError(base, result);
    }

    const leaders = mapper(result.data);
    if (!leaders.length) {
      return plBaseEnvelope("fallback", {
        configured: true,
        leaders: [],
        error: emptyMessage,
      });
    }

    return plBaseEnvelope("api-football", {
      configured: true,
      leaders,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (isQuotaError(message)) {
      return plBaseEnvelope("fallback", {
        configured: true,
        leaders: [],
        error: "API rate limit reached. Please retry shortly.",
      });
    }
    throw error;
  }
}

export async function fetchPlTeams(): Promise<PlTeamsApiResponse> {
  const base = plBaseEnvelope("fallback", { teams: [] as PlTeamRow[] });
  if (!base.configured) return base;

  try {
    const result = await apiFootballFetch<ApiTeamItem[]>(
      `/teams?league=${PL_LEAGUE_ID}&season=${PL_SEASON}`,
    );
    if (!result.ok) return mapFetchError(base, result);

    const teams = result.data
      .map(normalizeTeam)
      .sort((a, b) => a.name.localeCompare(b.name));

    if (!teams.length) {
      return plBaseEnvelope("fallback", {
        configured: true,
        teams: [],
        error: "Premier League clubs are not available yet.",
      });
    }

    return plBaseEnvelope("api-football", { configured: true, teams });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (isQuotaError(message)) {
      return plBaseEnvelope("fallback", {
        configured: true,
        teams: [],
        error: "API rate limit reached. Please retry shortly.",
      });
    }
    throw error;
  }
}

export async function fetchPlLive(locale = "en-GB"): Promise<PlLiveApiResponse> {
  const base = plBaseEnvelope("fallback", { fixtures: [] as PlFixtureRow[] });
  if (!base.configured) return base;

  try {
    const result = await apiFootballFetch<ApiFixtureItem[]>(
      `/fixtures?league=${PL_LEAGUE_ID}&season=${PL_SEASON}&live=all`,
    );
    if (!result.ok) return mapFetchError(base, result);

    const fixtures = result.data
      .map((item) => normalizeFixture(item, locale))
      .filter((fixture) => fixture.status === "LIVE")
      .sort(
        (a, b) =>
          new Date(a.kickoffUtc).getTime() - new Date(b.kickoffUtc).getTime(),
      );

    return plBaseEnvelope("api-football", { configured: true, fixtures });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (isQuotaError(message)) {
      return plBaseEnvelope("fallback", {
        configured: true,
        fixtures: [],
        error: "API rate limit reached. Please retry shortly.",
      });
    }
    throw error;
  }
}

export async function fetchPlTopScorers(): Promise<PlPlayerLeaderboardApiResponse> {
  return fetchPlayerLeaderboard(
    `/players/topscorers?league=${PL_LEAGUE_ID}&season=${PL_SEASON}`,
    normalizeTopScorers,
    "Top scorers are not available yet for this season.",
  );
}

export async function fetchPlAssists(): Promise<PlPlayerLeaderboardApiResponse> {
  return fetchPlayerLeaderboard(
    `/players/topassists?league=${PL_LEAGUE_ID}&season=${PL_SEASON}`,
    normalizeTopAssists,
    "Assist leaders are not available yet for this season.",
  );
}

export async function fetchPlDisciplinary(): Promise<PlPlayerLeaderboardApiResponse> {
  const yellow = await fetchPlayerLeaderboard(
    `/players/topyellowcards?league=${PL_LEAGUE_ID}&season=${PL_SEASON}`,
    normalizeDiscipline,
    "",
  );
  if (yellow.leaders.length) return yellow;

  return fetchPlayerLeaderboard(
    `/players/topredcards?league=${PL_LEAGUE_ID}&season=${PL_SEASON}`,
    normalizeDiscipline,
    "Disciplinary stats are not available yet for this season.",
  );
}

export async function fetchPlCleanSheets(): Promise<PlPlayerLeaderboardApiResponse> {
  const base = plBaseEnvelope("fallback", { leaders: [] as PlPlayerStatRow[] });
  if (!base.configured) return base;

  return plBaseEnvelope("fallback", {
    configured: true,
    leaders: [],
    error: "Clean sheet leaders are not available from the current API source yet.",
  });
}

export async function fetchPlPlayers(): Promise<PlPlayersApiResponse> {
  const scorers = await fetchPlTopScorers();
  const base = plBaseEnvelope("fallback", { players: [] as PlPlayerStatRow[] });

  if (!scorers.configured) return base;

  if (scorers.leaders.length) {
    return plBaseEnvelope(scorers.source, {
      configured: scorers.configured,
      players: scorers.leaders,
      error: scorers.error,
    });
  }

  return plBaseEnvelope("fallback", {
    configured: scorers.configured,
    players: [],
    error:
      scorers.error ??
      "Player data is not available yet for the 2026/27 Premier League season.",
  });
}

export async function fetchPlStatistics(): Promise<PlStatisticsApiResponse> {
  const emptyStats: PlStatisticsBundle = {
    topScorers: [],
    topAssists: [],
    cleanSheets: [],
    discipline: [],
  };
  const base = plBaseEnvelope("fallback", { statistics: emptyStats });

  if (!base.configured) return base;

  try {
    const [topScorers, topAssists, cleanSheets, discipline] = await Promise.all([
      fetchPlTopScorers(),
      fetchPlAssists(),
      fetchPlCleanSheets(),
      fetchPlDisciplinary(),
    ]);

    const statistics: PlStatisticsBundle = {
      topScorers: topScorers.leaders,
      topAssists: topAssists.leaders,
      cleanSheets: cleanSheets.leaders,
      discipline: discipline.leaders,
    };

    const hasAny = Object.values(statistics).some((rows) => rows.length > 0);
    const error = hasAny
      ? undefined
      : "Statistics are not available yet for the 2026/27 Premier League season.";

    return plBaseEnvelope(hasAny ? "api-football" : "fallback", {
      configured: true,
      statistics,
      error,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (isQuotaError(message)) {
      return plBaseEnvelope("fallback", {
        configured: true,
        statistics: emptyStats,
        error: "API rate limit reached. Please retry shortly.",
      });
    }
    throw error;
  }
}

export async function fetchPlTransfers(): Promise<PlTransfersApiResponse> {
  const base = plBaseEnvelope("fallback", {
    transfers: [] as PlTransferRow[],
    supported: false,
  });

  if (!base.configured) {
    return { ...base, supported: false };
  }

  return plBaseEnvelope("fallback", {
    configured: true,
    transfers: [],
    supported: false,
    error: "Transfer feed not available from current API source yet.",
  });
}

export function plTeamsCacheControl(body: PlTeamsApiResponse): string {
  return plGenericCacheControl(
    body.configured,
    body.teams.length > 0,
    body.source,
  );
}

export function plLiveCacheControl(body: PlLiveApiResponse): string {
  if (!body.configured) return "no-store";
  return "s-maxage=30, stale-while-revalidate=15";
}

export function plLeaderboardCacheControl(
  body: PlPlayerLeaderboardApiResponse,
): string {
  return plGenericCacheControl(
    body.configured,
    body.leaders.length > 0,
    body.source,
  );
}

export function plPlayersCacheControl(body: PlPlayersApiResponse): string {
  return plGenericCacheControl(
    body.configured,
    body.players.length > 0,
    body.source,
  );
}

export function plStatisticsCacheControl(body: PlStatisticsApiResponse): string {
  const hasData = Object.values(body.statistics).some((rows) => rows.length > 0);
  return plGenericCacheControl(body.configured, hasData, body.source);
}

export function plTransfersCacheControl(body: PlTransfersApiResponse): string {
  return plGenericCacheControl(
    body.configured,
    body.transfers.length > 0,
    body.source,
  );
}
