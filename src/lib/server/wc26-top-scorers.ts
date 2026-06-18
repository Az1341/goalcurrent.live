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
  extractVerifiedScoringGoals,
} from "@/lib/wc26-top-scorers";
import type { Wc26ApiMatch } from "@/types/fixture-overlay";
import type { MatchEventItem } from "@/types/match-detail";
import type { Wc26TopScorersResponse } from "@/types/wc26-top-scorers";

const FETCH_CONCURRENCY = 2;
const RETRY_DELAY_MS = 450;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function emptyResponse(): Wc26TopScorersResponse {
  return {
    scorers: [],
    totalGoals: 0,
    configured: isWc26ApiConfigured(),
    apiAvailable: false,
    matchesProcessed: 0,
    matchesWithVerifiedEvents: 0,
    matchesExcluded: 0,
    partialData: false,
    fetchedAt: new Date().toISOString(),
  };
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

export async function fetchWc26TopScorers(): Promise<Wc26TopScorersResponse> {
  if (!isWc26ApiConfigured()) {
    return emptyResponse();
  }

  try {
    const finishedMatches = await fetchFinishedWc26Matches();
    if (finishedMatches.length === 0) {
      return {
        ...emptyResponse(),
        configured: true,
        apiAvailable: true,
      };
    }

    const eventResults = await mapWithConcurrency(
      finishedMatches,
      fetchMatchEventsReliable,
      FETCH_CONCURRENCY,
    );

    const verifiedGoals = [];
    let matchesWithVerifiedEvents = 0;

    for (let index = 0; index < finishedMatches.length; index += 1) {
      const match = finishedMatches[index]!;
      const { events, apiAvailable } = eventResults[index]!;

      if (!apiAvailable) {
        continue;
      }

      const goals = extractVerifiedScoringGoals(
        events,
        match.homeScore,
        match.awayScore,
      );

      if (goals.length === 0 && (match.homeScore ?? 0) + (match.awayScore ?? 0) > 0) {
        continue;
      }

      if (goals.length > 0 || (match.homeScore ?? 0) + (match.awayScore ?? 0) === 0) {
        matchesWithVerifiedEvents += 1;
        verifiedGoals.push(...goals);
      }
    }

    const matchesExcluded = finishedMatches.length - matchesWithVerifiedEvents;
    const scorers = aggregateTopScorers(verifiedGoals, Number.POSITIVE_INFINITY);
    const totalGoals = countVerifiedTournamentGoals(verifiedGoals);

    return {
      scorers,
      totalGoals,
      configured: true,
      apiAvailable: matchesWithVerifiedEvents > 0,
      matchesProcessed: finishedMatches.length,
      matchesWithVerifiedEvents,
      matchesExcluded,
      partialData: matchesExcluded > 0,
      fetchedAt: new Date().toISOString(),
    };
  } catch {
    return emptyResponse();
  }
}
