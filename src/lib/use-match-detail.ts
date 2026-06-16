"use client";

import { useCallback, useEffect, useState } from "react";
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
  const [detail, setDetail] = useState<MatchDetailPayload>(() =>
    emptyDetail(fixtureId),
  );
  const [loading, setLoading] = useState(true);

  const refresh = useCallback((options?: { showLoading?: boolean }) => {
    if (options?.showLoading !== false) {
      setLoading(true);
    }
    fetch(`/api/wc26/match/${encodeURIComponent(fixtureId)}`, {
      cache: "no-store",
    })
      .then((res) => (res.ok ? res.json() : emptyDetail(fixtureId)))
      .then((payload: MatchDetailPayload) => setDetail(payload))
      .catch(() => setDetail(emptyDetail(fixtureId)))
      .finally(() => setLoading(false));
  }, [fixtureId]);

  useEffect(() => {
    refresh({ showLoading: true });
  }, [refresh]);

  useEffect(() => {
    if (!poll) {
      return undefined;
    }
    const timer = setInterval(() => refresh({ showLoading: false }), POLL_MS);
    return () => clearInterval(timer);
  }, [poll, refresh]);

  useEffect(() => {
    const onOverlay = () => refresh({ showLoading: false });
    window.addEventListener(WC26_FIXTURES_UPDATED_EVENT, onOverlay);
    return () => window.removeEventListener(WC26_FIXTURES_UPDATED_EVENT, onOverlay);
  }, [refresh]);

  return { detail, loading, refresh };
}
