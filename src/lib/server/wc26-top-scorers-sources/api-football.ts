import { getFixtureById } from "@/data/wc26";
import { getTeamDisplayName } from "@/lib/teamIdentity";
import {
  findFixtureIdByTeamNames,
  mapApiStatusShort,
} from "@/lib/wc26-fixture-match";
import { isWc26ApiConfigured } from "@/lib/server/wc26-api-football";
import {
  aggregateTopScorers,
  countVerifiedTournamentGoals,
  extractScoringGoalsFromEvents,
  extractVerifiedScoringGoals,
  type ScorerGoalEvent,
  type TopScorerRow,
} from "@/lib/wc26-top-scorers";
import type { Wc26ApiMatch } from "@/types/fixture-overlay";
import type { MatchEventItem } from "@/types/match-detail";
import type { ApiFootballTopScorersResult } from "./types";

const BASE_URL = "https://v3.football.api-sports.io";
/** FIFA World Cup — API-Football league id */
const WC_LEAGUE = 1;
/** World Cup 2026 season year */
const WC_SEASON = 2026;

type ApiPlayerLeaderItem = {
  player: { name: string };
  statistics: Array<{
    team: { name: string };
    goals?: { total?: number | null };
  }>;
};

type ApiFootballFixture = {
  fixture: {
    id: number;
    date: string;
    status: { short: string; elapsed: number | null };
  };
  teams: {
    home: { name: string };
    away: { name: string };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
};

type ApiEventRow = {
  time: { elapsed: number | null; extra: number | null };
  team: { name: string };
  player: { name: string };
  assist: { name: string | null } | null;
  type: string;
  detail: string;
};

type ApiFixtureEventsGroup = {
  fixture?: { id?: number };
  events?: ApiEventRow[];
};

function getApiKey(): string | undefined {
  return process.env.API_FOOTBALL_KEY?.trim() || undefined;
}

/** Query string with required WC26 league + season for every API-Football call in this module. */
function wcLeagueSeasonQuery(extra?: Record<string, string>): string {
  const params = new URLSearchParams({
    league: String(WC_LEAGUE),
    season: String(WC_SEASON),
  });
  if (extra) {
    for (const [key, value] of Object.entries(extra)) {
      params.set(key, value);
    }
  }
  return params.toString();
}

async function apiFootballFetch<T>(path: string): Promise<T[]> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return [];
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "x-apisports-key": apiKey },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    return [];
  }

  const json = (await res.json()) as {
    errors?: Record<string, string>;
    response?: T[];
  };

  if (json.errors && Object.keys(json.errors).length > 0) {
    return [];
  }

  return json.response ?? [];
}

function mapEvents(rows: readonly ApiEventRow[]): MatchEventItem[] {
  return rows.map((event) => ({
    minute: event.time.elapsed,
    extra: event.time.extra,
    teamName: event.team.name,
    playerName: event.player.name,
    assistName: event.assist?.name ?? null,
    type: event.type,
    detail: event.detail,
  }));
}

function normalizeApiFixture(raw: ApiFootballFixture): Wc26ApiMatch | null {
  const homeName = raw.teams.home.name;
  const awayName = raw.teams.away.name;
  const fixtureId = findFixtureIdByTeamNames(homeName, awayName);
  if (!fixtureId) {
    return null;
  }

  const fixture = getFixtureById(fixtureId);
  if (!fixture) {
    return null;
  }

  const statusShort = raw.fixture.status.short;
  const status = mapApiStatusShort(statusShort);
  if (!status) {
    return null;
  }

  const isFinished = status === "ft" || status === "aet" || status === "pen";
  if (
    isFinished &&
    (raw.goals.home === null || raw.goals.away === null)
  ) {
    return null;
  }

  return {
    fixtureId,
    matchNumber: fixture.matchNumber,
    status,
    statusShort,
    elapsed: raw.fixture.status.elapsed,
    homeScore: raw.goals.home,
    awayScore: raw.goals.away,
    kickoffUtc: raw.fixture.date,
    apiFixtureId: raw.fixture.id,
  };
}

async function fetchFinishedWc26Fixtures(): Promise<Wc26ApiMatch[]> {
  const raw = await apiFootballFetch<ApiFootballFixture>(
    `/fixtures?${wcLeagueSeasonQuery({ status: "FT-AET-PEN" })}`,
  );

  return raw
    .map(normalizeApiFixture)
    .filter((match): match is Wc26ApiMatch => match !== null)
    .filter((match) => ["ft", "aet", "pen"].includes(match.status));
}

function buildEventsByFixtureId(
  rows: readonly ApiFixtureEventsGroup[],
): Map<number, MatchEventItem[]> {
  const eventsByFixtureId = new Map<number, MatchEventItem[]>();

  for (const row of rows) {
    const fixtureId = row.fixture?.id;
    if (fixtureId == null) {
      continue;
    }

    const eventRows = row.events ?? [];
    if (eventRows.length === 0) {
      continue;
    }

    eventsByFixtureId.set(fixtureId, mapEvents(eventRows));
  }

  return eventsByFixtureId;
}

async function fetchWc26FixtureEventsByLeagueSeason(): Promise<{
  eventsByFixtureId: Map<number, MatchEventItem[]>;
  apiAvailable: boolean;
}> {
  const rows = await apiFootballFetch<ApiFixtureEventsGroup>(
    `/fixtures/events?${wcLeagueSeasonQuery()}`,
  );

  if (rows.length === 0) {
    return { eventsByFixtureId: new Map(), apiAvailable: false };
  }

  return {
    eventsByFixtureId: buildEventsByFixtureId(rows),
    apiAvailable: true,
  };
}

function collectGoalsFromFixtureEvents(
  finishedMatches: readonly Wc26ApiMatch[],
  eventsByFixtureId: ReadonlyMap<number, MatchEventItem[]>,
  verifiedOnly: boolean,
): { goals: ScorerGoalEvent[]; matchesWithEvents: number } {
  const goals: ScorerGoalEvent[] = [];
  let matchesWithEvents = 0;

  for (const match of finishedMatches) {
    if (match.apiFixtureId == null) {
      continue;
    }

    const events = eventsByFixtureId.get(match.apiFixtureId);
    if (!events || events.length === 0) {
      continue;
    }

    const matchGoals = verifiedOnly
      ? extractVerifiedScoringGoals(events, match.homeScore, match.awayScore)
      : extractScoringGoalsFromEvents(events);

    if (
      verifiedOnly &&
      matchGoals.length === 0 &&
      (match.homeScore ?? 0) + (match.awayScore ?? 0) > 0
    ) {
      continue;
    }

    if (
      matchGoals.length > 0 ||
      (match.homeScore ?? 0) + (match.awayScore ?? 0) === 0
    ) {
      matchesWithEvents += 1;
      goals.push(...matchGoals);
    }
  }

  return { goals, matchesWithEvents };
}

function normalizeTopScorersLeaderboard(
  items: readonly ApiPlayerLeaderItem[],
): TopScorerRow[] {
  const rows = items
    .map((item) => {
      const stat = item.statistics[0];
      const goals = stat?.goals?.total ?? 0;
      if (!goals || goals <= 0 || !item.player.name.trim()) {
        return null;
      }
      const teamName = stat?.team?.name?.trim();
      if (!teamName) {
        return null;
      }
      return {
        playerName: item.player.name.trim(),
        teamName: getTeamDisplayName(teamName) ?? teamName,
        goals,
        ownGoals: 0,
      };
    })
    .filter((row): row is Omit<TopScorerRow, "rank"> => row != null)
    .sort((left, right) => {
      if (right.goals !== left.goals) {
        return right.goals - left.goals;
      }
      return left.playerName.localeCompare(right.playerName, undefined, {
        sensitivity: "base",
      });
    });

  return rows.map((row, index) => ({
    rank: index + 1,
    ...row,
  }));
}

async function fetchTopScorersLeaderboard(): Promise<TopScorerRow[]> {
  const items = await apiFootballFetch<ApiPlayerLeaderItem>(
    `/players/topscorers?${wcLeagueSeasonQuery()}`,
  );

  return normalizeTopScorersLeaderboard(items);
}

function buildResultFromGoals(
  finishedMatches: readonly Wc26ApiMatch[],
  goals: readonly ScorerGoalEvent[],
  matchesWithEvents: number,
  apiAvailable: boolean,
): ApiFootballTopScorersResult {
  const scorers = aggregateTopScorers(goals, Number.POSITIVE_INFINITY);

  return {
    scorers,
    totalGoals: countVerifiedTournamentGoals(goals),
    apiAvailable,
    matchesProcessed: finishedMatches.length,
    matchesWithVerifiedEvents: matchesWithEvents,
    matchesExcluded: finishedMatches.length - matchesWithEvents,
  };
}

function emptyApiFootballResult(
  finishedMatches: readonly Wc26ApiMatch[],
): ApiFootballTopScorersResult {
  return {
    scorers: [],
    totalGoals: 0,
    apiAvailable: isWc26ApiConfigured(),
    matchesProcessed: finishedMatches.length,
    matchesWithVerifiedEvents: 0,
    matchesExcluded: finishedMatches.length,
  };
}

/** Tier 1: API-Football topscorers endpoint, then verified/unverified fixture events. */
export async function fetchApiFootballWc26TopScorers(): Promise<ApiFootballTopScorersResult> {
  const startedAt = Date.now();
  console.info(
    `API-FOOTBALL top scorers: start ${new Date(startedAt).toISOString()}`,
  );

  if (!isWc26ApiConfigured()) {
    console.info("API-FOOTBALL: 0 scorers returned");
    const endedAt = Date.now();
    console.info(
      `API-FOOTBALL top scorers: end ${new Date(endedAt).toISOString()} duration ${endedAt - startedAt}ms`,
    );
    return {
      scorers: [],
      totalGoals: 0,
      apiAvailable: false,
      matchesProcessed: 0,
      matchesWithVerifiedEvents: 0,
      matchesExcluded: 0,
    };
  }

  try {
    const leaderboard = await fetchTopScorersLeaderboard();
    if (leaderboard.length > 0) {
      console.info(`API-FOOTBALL: ${leaderboard.length} scorers returned`);
      const endedAt = Date.now();
      console.info(
        `API-FOOTBALL top scorers: end ${new Date(endedAt).toISOString()} duration ${endedAt - startedAt}ms`,
      );
      return {
        scorers: leaderboard,
        totalGoals: leaderboard.reduce((sum, row) => sum + row.goals, 0),
        apiAvailable: true,
        matchesProcessed: 0,
        matchesWithVerifiedEvents: 0,
        matchesExcluded: 0,
      };
    }

    const [finishedMatches, fixtureEvents] = await Promise.all([
      fetchFinishedWc26Fixtures(),
      fetchWc26FixtureEventsByLeagueSeason(),
    ]);

    if (finishedMatches.length === 0) {
      const empty = emptyApiFootballResult([]);
      console.info(`API-FOOTBALL: ${empty.scorers.length} scorers returned`);
      const endedAt = Date.now();
      console.info(
        `API-FOOTBALL top scorers: end ${new Date(endedAt).toISOString()} duration ${endedAt - startedAt}ms`,
      );
      return empty;
    }

    const { eventsByFixtureId, apiAvailable } = fixtureEvents;

    const verified = collectGoalsFromFixtureEvents(
      finishedMatches,
      eventsByFixtureId,
      true,
    );
    if (verified.goals.length > 0) {
      const result = buildResultFromGoals(
        finishedMatches,
        verified.goals,
        verified.matchesWithEvents,
        apiAvailable,
      );
      console.info(`API-FOOTBALL: ${result.scorers.length} scorers returned`);
      const endedAt = Date.now();
      console.info(
        `API-FOOTBALL top scorers: end ${new Date(endedAt).toISOString()} duration ${endedAt - startedAt}ms`,
      );
      return result;
    }

    const unverified = collectGoalsFromFixtureEvents(
      finishedMatches,
      eventsByFixtureId,
      false,
    );
    if (unverified.goals.length > 0) {
      const result = buildResultFromGoals(
        finishedMatches,
        unverified.goals,
        unverified.matchesWithEvents,
        apiAvailable,
      );
      console.info(`API-FOOTBALL: ${result.scorers.length} scorers returned`);
      const endedAt = Date.now();
      console.info(
        `API-FOOTBALL top scorers: end ${new Date(endedAt).toISOString()} duration ${endedAt - startedAt}ms`,
      );
      return result;
    }

    const empty = emptyApiFootballResult(finishedMatches);
    console.info(`API-FOOTBALL: ${empty.scorers.length} scorers returned`);
    const endedAt = Date.now();
    console.info(
      `API-FOOTBALL top scorers: end ${new Date(endedAt).toISOString()} duration ${endedAt - startedAt}ms`,
    );
    return empty;
  } catch (err) {
    console.error("API-FOOTBALL ERROR", err);
    console.info("API-FOOTBALL: 0 scorers returned");
    const endedAt = Date.now();
    console.info(
      `API-FOOTBALL top scorers: end ${new Date(endedAt).toISOString()} duration ${endedAt - startedAt}ms`,
    );
    return {
      scorers: [],
      totalGoals: 0,
      apiAvailable: false,
      matchesProcessed: 0,
      matchesWithVerifiedEvents: 0,
      matchesExcluded: 0,
    };
  }
}

/** Raw API-Football JSON payload (unmodified upstream response). */
export async function fetchApiFootballRawJson(path: string): Promise<unknown> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return {
      errors: { apiKey: "API_FOOTBALL_KEY is not configured" },
      response: [],
    };
  }

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { "x-apisports-key": apiKey },
      cache: "no-store",
    });

    return await res.json();
  } catch (err) {
    return {
      errors: {
        request: err instanceof Error ? err.message : "Unknown error",
      },
      response: [],
    };
  }
}

/** Raw topscorers endpoint response for WC26 (league=1, season=2026). */
export async function fetchWc26TopScorersRaw(): Promise<unknown> {
  return fetchApiFootballRawJson(`/players/topscorers?${wcLeagueSeasonQuery()}`);
}
