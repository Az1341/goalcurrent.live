"use client";

import useSWR from "swr";
import {
  fetcher,
  LIVE_MATCH_FETCH_SWR_OPTIONS,
  LIVE_POLL_HUB_MS,
  LIVE_POLL_MATCH_MS,
  visibilityAwareRefreshInterval,
} from "@/lib/client/fetcher";

export const LIVE_API_PATHS = {
  wc26LiveScores: "/api/wc26/scores?live=true",
  wc26Results: "/api/wc26/scores?results=wc",
  wc26TopScorers: "/api/wc26/top-scorers",
  plFixtures: "/api/pl/fixtures",
  plTopScorers: "/api/pl/top-scorers",
  wc26Match: (fixtureId: string) =>
    `/api/wc26/match/${encodeURIComponent(fixtureId)}`,
} as const;

type UseLiveApiOptions = {
  /** Poll interval in ms; omit for hub default (75s). Pass 30_000 for live match pages. */
  refreshInterval?: number;
  /** Use LIVE_MATCH_FETCH_SWR_OPTIONS — no stale data flash on live/home match sections. */
  fresh?: boolean;
};

export function useLiveApi<T = unknown>(
  path: string | null,
  options?: UseLiveApiOptions,
) {
  if (options?.fresh) {
    return useSWR<T>(path, fetcher, LIVE_MATCH_FETCH_SWR_OPTIONS);
  }

  const pollMs =
    options?.refreshInterval !== undefined
      ? options.refreshInterval
      : LIVE_POLL_HUB_MS;

  return useSWR<T>(path, fetcher, {
    refreshInterval: () => visibilityAwareRefreshInterval(pollMs),
    dedupingInterval: pollMs > 0 ? pollMs : LIVE_POLL_HUB_MS,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });
}

export { LIVE_POLL_MATCH_MS, LIVE_POLL_HUB_MS };
