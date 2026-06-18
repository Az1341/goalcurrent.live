"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { WC26_FIXTURES_UPDATED_EVENT } from "@/lib/wc26-fixture-overlay";
import type { Wc26TopScorersResponse } from "@/types/wc26-top-scorers";

const POLL_MS = 300_000;

function emptyResponse(): Wc26TopScorersResponse {
  return {
    scorers: [],
    totalGoals: 0,
    configured: false,
    apiAvailable: false,
    matchesProcessed: 0,
    matchesWithVerifiedEvents: 0,
    matchesExcluded: 0,
    partialData: false,
    fetchedAt: new Date().toISOString(),
  };
}

function mergeTopScorersResponse(
  prev: Wc26TopScorersResponse,
  next: Wc26TopScorersResponse,
): Wc26TopScorersResponse {
  if (
    prev.matchesWithVerifiedEvents > 0 &&
    next.matchesWithVerifiedEvents < prev.matchesWithVerifiedEvents
  ) {
    return {
      ...prev,
      fetchedAt: next.fetchedAt,
      partialData: true,
    };
  }

  return next;
}

export function useWc26TopScorers(): {
  data: Wc26TopScorersResponse;
  loading: boolean;
  refresh: () => void;
} {
  const [data, setData] = useState<Wc26TopScorersResponse>(emptyResponse);
  const [loading, setLoading] = useState(true);
  const requestSeqRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const overlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refresh = useCallback((options?: { showLoading?: boolean }) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const requestSeq = ++requestSeqRef.current;

    if (options?.showLoading !== false) {
      setLoading(true);
    }

    fetch("/api/wc26/top-scorers", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : emptyResponse()))
      .then((payload: Wc26TopScorersResponse) => {
        if (requestSeq !== requestSeqRef.current) {
          return;
        }
        setData((prev) => mergeTopScorersResponse(prev, payload));
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) {
          return;
        }
        if (requestSeq !== requestSeqRef.current) {
          return;
        }
        setData(emptyResponse());
      })
      .finally(() => {
        if (controller.signal.aborted) {
          return;
        }
        if (requestSeq !== requestSeqRef.current) {
          return;
        }
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    refresh({ showLoading: true });
    return () => {
      abortRef.current?.abort();
    };
  }, [refresh]);

  useEffect(() => {
    const timer = setInterval(() => refresh({ showLoading: false }), POLL_MS);
    return () => clearInterval(timer);
  }, [refresh]);

  useEffect(() => {
    const onOverlay = () => {
      if (overlayTimerRef.current) {
        clearTimeout(overlayTimerRef.current);
      }
      overlayTimerRef.current = setTimeout(() => {
        refresh({ showLoading: false });
      }, 500);
    };
    window.addEventListener(WC26_FIXTURES_UPDATED_EVENT, onOverlay);
    return () => {
      if (overlayTimerRef.current) {
        clearTimeout(overlayTimerRef.current);
      }
      window.removeEventListener(WC26_FIXTURES_UPDATED_EVENT, onOverlay);
    };
  }, [refresh]);

  return { data, loading, refresh };
}
