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
  const startedAt = Date.now();
  console.info(
    `WC26 top scorers pipeline: start ${new Date(startedAt).toISOString()}`,
  );

  try {
    // Tier 1: API-Football (topscorers endpoint + fixture events)
    const apiFootball = await fetchApiFootballWc26TopScorers();
    if (apiFootball.scorers.length > 0) {
      const response: Wc26TopScorersResponse = {
        scorers: apiFootball.scorers,
        totalGoals: apiFootball.totalGoals,
        configured: isWc26ApiConfigured(),
        apiAvailable: apiFootball.apiAvailable,
        matchesProcessed: apiFootball.matchesProcessed,
        matchesWithVerifiedEvents: apiFootball.matchesWithVerifiedEvents,
        matchesExcluded: apiFootball.matchesExcluded,
        fetchedAt: new Date().toISOString(),
      };
      console.info(`FINAL MERGED: ${response.scorers.length} scorers`);
      const endedAt = Date.now();
      console.info(
        `WC26 top scorers pipeline: end ${new Date(endedAt).toISOString()} duration ${endedAt - startedAt}ms`,
      );
      return response;
    }

    // Tier 2: ScoreBat + ESPN + LiveScore (merged, deduplicated)
    const multiSource = await fetchMultiSourceWc26TopScorers();
    if (multiSource.scorers.length > 0) {
      const response: Wc26TopScorersResponse = {
        scorers: multiSource.scorers,
        totalGoals: multiSource.totalGoals,
        configured: isWc26ApiConfigured(),
        apiAvailable: multiSource.apiAvailable,
        matchesProcessed: 0,
        matchesWithVerifiedEvents: 0,
        matchesExcluded: 0,
        fetchedAt: new Date().toISOString(),
      };
      console.info(`FINAL MERGED: ${response.scorers.length} scorers`);
      const endedAt = Date.now();
      console.info(
        `WC26 top scorers pipeline: end ${new Date(endedAt).toISOString()} duration ${endedAt - startedAt}ms`,
      );
      return response;
    }

    const response = emptyResponse();
    console.info(`FINAL MERGED: ${response.scorers.length} scorers`);
    const endedAt = Date.now();
    console.info(
      `WC26 top scorers pipeline: end ${new Date(endedAt).toISOString()} duration ${endedAt - startedAt}ms`,
    );
    return response;
  } catch (err) {
    console.error("WC26 top scorers pipeline ERROR", err);
    const response = emptyResponse();
    console.info(`FINAL MERGED: ${response.scorers.length} scorers`);
    const endedAt = Date.now();
    console.info(
      `WC26 top scorers pipeline: end ${new Date(endedAt).toISOString()} duration ${endedAt - startedAt}ms`,
    );
    return response;
  }
}
