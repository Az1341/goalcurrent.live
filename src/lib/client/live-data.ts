"use client";

import useSWR, { type SWRConfiguration } from "swr";
import { fetcher, LIVE_SWR_OPTIONS } from "@/lib/client/fetcher";

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
  refreshInterval?: number;
};

export function useLiveApi<T = unknown>(
  path: string | null,
  options?: UseLiveApiOptions,
) {
  const swrOptions: SWRConfiguration = {
    ...LIVE_SWR_OPTIONS,
    ...(options?.refreshInterval !== undefined
      ? { refreshInterval: options.refreshInterval }
      : {}),
    onSuccess: () => {
      if (path) {
        console.info("Unified SWR:", path);
      }
    },
  };

  return useSWR<T>(path, fetcher, swrOptions);
}
