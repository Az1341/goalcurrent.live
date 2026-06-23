import { getTeamDisplayName } from "@/lib/teamIdentity";
import {
  fetchWc26EventsForApiFixture,
  fetchWc26MatchEvents,
} from "@/lib/server/wc26-match-detail";
import {
  fetchFinishedWc26Matches,
  isWc26ApiConfigured,
} from "@/lib/server/wc26-api-football";
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
const WC_LEAGUE = 1;
const WC_SEASON = 2026;
const FETCH_CONCURRENCY = 2;
const RETRY_DELAY_MS = 450;

type ApiPlayerLeaderItem = {
  player: { name: string };
  statistics: Array<{
    team: { name: string };
    goals?: { total?: number | null };
  }>;
};

function getApiKey(): string | undefined {
  return process.env.API_FOOTBALL_KEY?.trim() || undefined;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function mapWithConcurrency<T, R>(
  items: readonly T[],
  mapper: (item: T) => Promise<R>,
  concurrency: number,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let nextIndex = 0;

  async function worker(): Promise<void> {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await mapper(items[index]!);
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    () => worker(),
  );
  await Promise.all(workers);
  return results;
}

async function fetchMatchEvents(
  match: Wc26ApiMatch,
): Promise<{ events: MatchEventItem[]; apiAvailable: boolean }> {
  if (match.apiFixtureId != null) {
    return fetchWc26EventsForApiFixture(match.apiFixtureId);
  }
  return fetchWc26MatchEvents(match.fixtureId);
}

async function fetchMatchEventsReliable(
  match: Wc26ApiMatch,
): Promise<{ events: MatchEventItem[]; apiAvailable: boolean }> {
  let result = await fetchMatchEvents(match);
  const expectedGoals = (match.homeScore ?? 0) + (match.awayScore ?? 0);

  if (expectedGoals > 0 && !result.apiAvailable) {
    await sleep(RETRY_DELAY_MS);
    result = await fetchMatchEvents(match);
  }

  return result;
}

function collectGoalsFromEvents(
  finishedMatches: readonly Wc26ApiMatch[],
  eventResults: readonly { events: MatchEventItem[]; apiAvailable: boolean }[],
  verifiedOnly: boolean,
): { goals: ScorerGoalEvent[]; matchesWithEvents: number } {
  const goals: ScorerGoalEvent[] = [];
  let matchesWithEvents = 0;

  for (let index = 0; index < finishedMatches.length; index += 1) {
    const match = finishedMatches[index]!;
    const { events, apiAvailable } = eventResults[index]!;

    if (!apiAvailable) {
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
  const apiKey = getApiKey();
  if (!apiKey) {
    return [];
  }

  try {
    const res = await fetch(
      `${BASE_URL}/players/topscorers?league=${WC_LEAGUE}&season=${WC_SEASON}`,
      {
        headers: { "x-apisports-key": apiKey },
        next: { revalidate: 0 },
      },
    );

    if (!res.ok) {
      return [];
    }

    const json = (await res.json()) as {
      response?: ApiPlayerLeaderItem[];
    };

    return normalizeTopScorersLeaderboard(json.response ?? []);
  } catch {
    return [];
  }
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
  if (!isWc26ApiConfigured()) {
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
      return {
        scorers: leaderboard,
        totalGoals: leaderboard.reduce((sum, row) => sum + row.goals, 0),
        apiAvailable: true,
        matchesProcessed: 0,
        matchesWithVerifiedEvents: 0,
        matchesExcluded: 0,
      };
    }

    const finishedMatches = await fetchFinishedWc26Matches();
    if (finishedMatches.length === 0) {
      return emptyApiFootballResult([]);
    }

    const eventResults = await mapWithConcurrency(
      finishedMatches,
      fetchMatchEventsReliable,
      FETCH_CONCURRENCY,
    );

    const verified = collectGoalsFromEvents(
      finishedMatches,
      eventResults,
      true,
    );
    if (verified.goals.length > 0) {
      return buildResultFromGoals(
        finishedMatches,
        verified.goals,
        verified.matchesWithEvents,
        true,
      );
    }

    const unverified = collectGoalsFromEvents(
      finishedMatches,
      eventResults,
      false,
    );
    if (unverified.goals.length > 0) {
      return buildResultFromGoals(
        finishedMatches,
        unverified.goals,
        unverified.matchesWithEvents,
        true,
      );
    }

    return emptyApiFootballResult(finishedMatches);
  } catch {
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
