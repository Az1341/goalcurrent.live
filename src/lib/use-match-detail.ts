"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { LIVE_API_PATHS, useLiveApi } from "@/lib/client/live-data";
import { useLiveScores } from "@/lib/client/useLiveScores";
import { LIVE_POLL_MATCH_MS } from "@/lib/client/fetcher";
import { WC26_FIXTURES_UPDATED_EVENT } from "@/lib/wc26-fixture-overlay";
import { useEffectiveFixtures } from "@/lib/use-effective-fixtures";
import type { MatchDetailPayload } from "@/types/match-detail";

const POLL_MS = LIVE_POLL_MATCH_MS;
const API_FIXTURE_ID_STORAGE_KEY = "wc26:api-fixture-ids";

function readStoredApiFixtureId(fixtureId: string): number | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }
  try {
    const raw = sessionStorage.getItem(API_FIXTURE_ID_STORAGE_KEY);
    if (!raw) {
      return undefined;
    }
    const map = JSON.parse(raw) as Record<string, number>;
    const value = map[fixtureId];
    return typeof value === "number" && Number.isFinite(value) ? value : undefined;
  } catch {
    return undefined;
  }
}

function storeApiFixtureId(fixtureId: string, apiFixtureId: number): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    const raw = sessionStorage.getItem(API_FIXTURE_ID_STORAGE_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, number>) : {};
    map[fixtureId] = apiFixtureId;
    sessionStorage.setItem(API_FIXTURE_ID_STORAGE_KEY, JSON.stringify(map));
  } catch {
    // Ignore storage failures.
  }
}

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
  poll = true,
): {
  detail: MatchDetailPayload;
  loading: boolean;
  refresh: () => void;
} {
  const fixtures = useEffectiveFixtures();
  const { data: liveScores } = useLiveScores();

  const [storedApiFixtureId, setStoredApiFixtureId] = useState<number | undefined>(
    () => readStoredApiFixtureId(fixtureId),
  );

  const fixture = fixtures.find((entry) => entry.id === fixtureId);
  const apiFixtureId =
    fixture?.apiFixtureId ??
    liveScores?.matches.find((match) => match.fixtureId === fixtureId)?.apiFixtureId ??
    storedApiFixtureId;

  useEffect(() => {
    if (apiFixtureId == null) {
      return;
    }
    storeApiFixtureId(fixtureId, apiFixtureId);
    setStoredApiFixtureId(apiFixtureId);
  }, [apiFixtureId, fixtureId]);

  const liveScoresReady = liveScores !== undefined;
  // Knockout pages resolve api-sports ids server-side — do not block on live scores.
  const fetchReady = true;

  const path = useMemo(() => {
    if (!fetchReady) {
      return null;
    }
    const base = LIVE_API_PATHS.wc26Match(fixtureId);
    if (apiFixtureId == null) {
      return base;
    }
    return `${base}?apiFixtureId=${apiFixtureId}`;
  }, [apiFixtureId, fetchReady, fixtureId]);

  const { data, isLoading, mutate } = useLiveApi<MatchDetailPayload>(path, {
    fresh: true,
    refreshInterval: poll && fetchReady ? POLL_MS : 0,
  });

  useEffect(() => {
    if (!path) {
      return;
    }
    void mutate();
  }, [mutate, path]);

  useEffect(() => {
    if (!poll) {
      return undefined;
    }

    const onOverlay = () => {
      void mutate();
    };

    window.addEventListener(WC26_FIXTURES_UPDATED_EVENT, onOverlay);
    return () => window.removeEventListener(WC26_FIXTURES_UPDATED_EVENT, onOverlay);
  }, [mutate, poll]);

  useEffect(() => {
    if (!poll || !liveScoresReady || apiFixtureId == null) {
      return;
    }
    void mutate();
  }, [apiFixtureId, liveScoresReady, mutate, poll]);

  const detail = data ?? emptyDetail(fixtureId);
  const loading = isLoading && !data;

  const refresh = useCallback(() => {
    void mutate();
  }, [mutate]);

  return { detail, loading, refresh };
}
