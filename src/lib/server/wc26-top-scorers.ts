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
  sumTopScorerGoals,
} from "@/lib/wc26-top-scorers";
import { getWc26FallbackTopScorerRows } from "@/data/wc26-fallback-scorers";
import type { Wc26ApiMatch } from "@/types/fixture-overlay";
import type { MatchEventItem } from "@/types/match-detail";
import type { ScorerGoalEvent } from "@/lib/wc26-top-scorers";
import type { Wc26TopScorersResponse } from "@/types/wc26-top-scorers";

const FETCH_CONCURRENCY = 2;
const RETRY_DELAY_MS = 450;

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

function buildTopScorersResponse(
  finishedMatches: readonly Wc26ApiMatch[],
  goalEvents: readonly ScorerGoalEvent[],
  matchesWithEvents: number,
  partialData: boolean,
  apiAvailable: boolean,
): Wc26TopScorersResponse {
  const scorers = aggregateTopScorers(goalEvents, Number.POSITIVE_INFINITY);
  const matchesExcluded = finishedMatches.length - matchesWithEvents;

  return {
    scorers,
    totalGoals: countVerifiedTournamentGoals(goalEvents),
    configured: true,
    apiAvailable,
    matchesProcessed: finishedMatches.length,
    matchesWithVerifiedEvents: matchesWithEvents,
    matchesExcluded,
    partialData,
    fetchedAt: new Date().toISOString(),
  };
}

/** Tier 3: curated static scorers when API + match events produce no rows. */
function buildStaticFallbackResponse(
  finishedMatches: readonly Wc26ApiMatch[],
): Wc26TopScorersResponse {
  const scorers = getWc26FallbackTopScorerRows();

  return {
    scorers,
    totalGoals: sumTopScorerGoals(scorers),
    configured: isWc26ApiConfigured(),
    apiAvailable: true,
    matchesProcessed: finishedMatches.length,
    matchesWithVerifiedEvents: 0,
    matchesExcluded: finishedMatches.length,
    partialData: true,
    fetchedAt: new Date().toISOString(),
  };
}

function withStaticFallbackIfEmpty(
  response: Wc26TopScorersResponse,
  finishedMatches: readonly Wc26ApiMatch[],
): Wc26TopScorersResponse {
  if (response.scorers.length > 0) {
    return response;
  }
  return buildStaticFallbackResponse(finishedMatches);
}

export async function fetchWc26TopScorers(): Promise<Wc26TopScorersResponse> {
  if (!isWc26ApiConfigured()) {
    return buildStaticFallbackResponse([]);
  }

  try {
    const finishedMatches = await fetchFinishedWc26Matches();
    if (finishedMatches.length === 0) {
      return buildStaticFallbackResponse([]);
    }

    const eventResults = await mapWithConcurrency(
      finishedMatches,
      fetchMatchEventsReliable,
      FETCH_CONCURRENCY,
    );

    // Tier 1: verified goal events from API-Football match feeds
    const verified = collectGoalsFromEvents(
      finishedMatches,
      eventResults,
      true,
    );

    if (verified.goals.length > 0) {
      return withStaticFallbackIfEmpty(
        buildTopScorersResponse(
          finishedMatches,
          verified.goals,
          verified.matchesWithEvents,
          verified.matchesWithEvents < finishedMatches.length,
          true,
        ),
        finishedMatches,
      );
    }

    // Tier 2: unverified event aggregation (same finished-match set as scores API)
    const eventFallback = collectGoalsFromEvents(
      finishedMatches,
      eventResults,
      false,
    );

    if (eventFallback.goals.length > 0) {
      return withStaticFallbackIfEmpty(
        buildTopScorersResponse(
          finishedMatches,
          eventFallback.goals,
          eventFallback.matchesWithEvents,
          true,
          true,
        ),
        finishedMatches,
      );
    }

    // Tier 3: static curated dataset
    return buildStaticFallbackResponse(finishedMatches);
  } catch {
    return buildStaticFallbackResponse([]);
  }
}
