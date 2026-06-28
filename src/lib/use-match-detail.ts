"use client";

import { useCallback, useEffect, useMemo } from "react";
import { LIVE_API_PATHS, useLiveApi } from "@/lib/client/live-data";
import { LIVE_POLL_MATCH_MS } from "@/lib/client/fetcher";
import { WC26_FIXTURES_UPDATED_EVENT } from "@/lib/wc26-fixture-overlay";
import { useEffectiveFixtures } from "@/lib/use-effective-fixtures";
import type { MatchDetailPayload } from "@/types/match-detail";

const POLL_MS = LIVE_POLL_MATCH_MS;

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
  const fixtures = useEffectiveFixtures();
  const apiFixtureId = fixtures.find((entry) => entry.id === fixtureId)?.apiFixtureId;
  const path = useMemo(() => {
    const base = LIVE_API_PATHS.wc26Match(fixtureId);
    if (apiFixtureId == null) {
      return base;
    }
    return `${base}?apiFixtureId=${apiFixtureId}`;
  }, [fixtureId, apiFixtureId]);

  const { data, isLoading, mutate } = useLiveApi<MatchDetailPayload>(path, {
    fresh: poll,
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
