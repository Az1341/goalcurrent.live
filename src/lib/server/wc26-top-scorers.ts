import { isWc26ApiConfigured } from "@/lib/server/wc26-api-football";
import {
  fetchApiFootballWc26TopScorers,
  fetchMultiSourceWc26TopScorers,
} from "@/lib/server/wc26-top-scorers-sources";
import type { Wc26TopScorersResponse } from "@/types/wc26-top-scorers";

function emptyResponse(): Wc26TopScorersResponse {
  return {
    scorers: [],
    totalGoals: 0,
    configured: isWc26ApiConfigured(),
    apiAvailable: false,
    matchesProcessed: 0,
    matchesWithVerifiedEvents: 0,
    matchesExcluded: 0,
    fetchedAt: new Date().toISOString(),
  };
}

export async function fetchWc26TopScorers(): Promise<Wc26TopScorersResponse> {
  try {
    // Tier 1: API-Football (topscorers endpoint + fixture events)
    const apiFootball = await fetchApiFootballWc26TopScorers();
    if (apiFootball.scorers.length > 0) {
      return {
        scorers: apiFootball.scorers,
        totalGoals: apiFootball.totalGoals,
        configured: isWc26ApiConfigured(),
        apiAvailable: apiFootball.apiAvailable,
        matchesProcessed: apiFootball.matchesProcessed,
        matchesWithVerifiedEvents: apiFootball.matchesWithVerifiedEvents,
        matchesExcluded: apiFootball.matchesExcluded,
        fetchedAt: new Date().toISOString(),
      };
    }

    // Tier 2: ScoreBat + ESPN + LiveScore (merged, deduplicated)
    const multiSource = await fetchMultiSourceWc26TopScorers();
    if (multiSource.scorers.length > 0) {
      return {
        scorers: multiSource.scorers,
        totalGoals: multiSource.totalGoals,
        configured: isWc26ApiConfigured(),
        apiAvailable: multiSource.apiAvailable,
        matchesProcessed: 0,
        matchesWithVerifiedEvents: 0,
        matchesExcluded: 0,
        fetchedAt: new Date().toISOString(),
      };
    }

    return emptyResponse();
  } catch {
    return emptyResponse();
  }
}
