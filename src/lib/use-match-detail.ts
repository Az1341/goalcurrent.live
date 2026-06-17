"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  const requestSeqRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  const refresh = useCallback((options?: { showLoading?: boolean }) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const requestSeq = ++requestSeqRef.current;

    if (options?.showLoading !== false) {
      setLoading(true);
    }

    fetch(`/api/wc26/match/${encodeURIComponent(fixtureId)}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : emptyDetail(fixtureId)))
      .then((payload: MatchDetailPayload) => {
        if (requestSeq !== requestSeqRef.current) {
          return;
        }
        setDetail(payload);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) {
          return;
        }
        if (requestSeq !== requestSeqRef.current) {
          return;
        }
        setDetail(emptyDetail(fixtureId));
      })
      .finally(() => {
        if (requestSeq !== requestSeqRef.current) {
          return;
        }
        setLoading(false);
      });
  }, [fixtureId]);

  useEffect(() => {
    refresh({ showLoading: true });
    return () => {
      abortRef.current?.abort();
    };
  }, [refresh]);

  useEffect(() => {
    if (!poll) {
      return undefined;
    }
    const timer = setInterval(() => refresh({ showLoading: false }), POLL_MS);
    return () => clearInterval(timer);
  }, [poll, refresh]);

  useEffect(() => {
    if (!poll) {
      return undefined;
    }
    const onOverlay = () => refresh({ showLoading: false });
    window.addEventListener(WC26_FIXTURES_UPDATED_EVENT, onOverlay);
    return () => window.removeEventListener(WC26_FIXTURES_UPDATED_EVENT, onOverlay);
  }, [poll, refresh]);

  return { detail, loading, refresh };
}
