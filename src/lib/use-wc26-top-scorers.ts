"use client";

import { useCallback } from "react";
import { useLiveTopScorers } from "@/lib/client/useLiveTopScorers";
import type { Wc26TopScorersResponse } from "@/types/wc26-top-scorers";

function emptyResponse(): Wc26TopScorersResponse {
  return {
    scorers: [],
    totalGoals: 0,
    configured: false,
    apiAvailable: false,
    matchesProcessed: 0,
    matchesWithVerifiedEvents: 0,
    matchesExcluded: 0,
    fetchedAt: new Date().toISOString(),
  };
}

export function useWc26TopScorers(): {
  data: Wc26TopScorersResponse;
  loading: boolean;
  refresh: () => void;
  scorers: Wc26TopScorersResponse["scorers"];
} {
  const { data, isLoading, mutate } = useLiveTopScorers();

  const refresh = useCallback(() => {
    void mutate();
  }, [mutate]);

  const resolved = data ?? emptyResponse();

  return {
    data: resolved,
    loading: isLoading && !data,
    refresh,
    scorers: resolved.scorers,
  };
}
