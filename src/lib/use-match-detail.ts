"use client";

import { useCallback, useEffect } from "react";
import { LIVE_API_PATHS, useLiveApi } from "@/lib/client/live-data";
import { WC26_FIXTURES_UPDATED_EVENT } from "@/lib/wc26-fixture-overlay";
import type { MatchDetailPayload } from "@/types/match-detail";

const POLL_MS = 30_000;

function emptyDetail(fixtureId: string): MatchDetailPayload {
  return {
    fixtureId,
    configured: false,
    apiAvailable: false,
    fetchedAt: new Date().toISOString(),
    events: [],
    lineups: { home: null, away: null },
    statistics: [],
  };
}

export function useMatchDetail(
  fixtureId: string,
  poll = false,
): {
  detail: MatchDetailPayload;
  loading: boolean;
  refresh: () => void;
} {
  const path = LIVE_API_PATHS.wc26Match(fixtureId);
  const { data, isLoading, mutate } = useLiveApi<MatchDetailPayload>(path, {
    refreshInterval: poll ? POLL_MS : 0,
  });

  useEffect(() => {
    if (!poll) {
      return undefined;
    }

    const onOverlay = () => {
      void mutate();
    };

    window.addEventListener(WC26_FIXTURES_UPDATED_EVENT, onOverlay);
    return () => window.removeEventListener(WC26_FIXTURES_UPDATED_EVENT, onOverlay);
  }, [poll, mutate]);

  const detail = data ?? emptyDetail(fixtureId);
  const loading = isLoading && !data;

  const refresh = useCallback(() => {
    void mutate();
  }, [mutate]);

  return { detail, loading, refresh };
}
