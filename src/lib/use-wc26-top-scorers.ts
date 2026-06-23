"use client";

import { useCallback, useSyncExternalStore } from "react";
import { WC26_FIXTURES_UPDATED_EVENT } from "@/lib/wc26-fixture-overlay";
import type { Wc26TopScorersResponse } from "@/types/wc26-top-scorers";

const POLL_MS = 300_000;

type TopScorersSnapshot = {
  readonly data: Wc26TopScorersResponse;
  readonly loading: boolean;
};

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

const serverSnapshot: TopScorersSnapshot = {
  data: emptyResponse(),
  loading: true,
};

let clientSnapshot: TopScorersSnapshot = {
  data: emptyResponse(),
  loading: true,
};

const listeners = new Set<() => void>();
let subscriberCount = 0;
let abortController: AbortController | null = null;
let requestSeq = 0;
let overlayTimer: ReturnType<typeof setTimeout> | null = null;
let pollTimer: ReturnType<typeof setInterval> | null = null;
let fetchInFlight = false;

function emit(): void {
  for (const listener of listeners) {
    listener();
  }
}

function setSnapshot(next: TopScorersSnapshot): void {
  clientSnapshot = next;
  emit();
}

function getSnapshot(): TopScorersSnapshot {
  return clientSnapshot;
}

function getServerSnapshot(): TopScorersSnapshot {
  return serverSnapshot;
}

function refreshTopScorers(options?: { showLoading?: boolean }): void {
  if (fetchInFlight) {
    return;
  }

  const controller = new AbortController();
  abortController = controller;
  const requestId = ++requestSeq;
  fetchInFlight = true;

  if (options?.showLoading !== false) {
    setSnapshot({ ...clientSnapshot, loading: true });
  }

  fetch("/api/wc26/top-scorers", {
    cache: "no-store",
    signal: controller.signal,
  })
    .then((res) => (res.ok ? res.json() : emptyResponse()))
    .then((payload: Wc26TopScorersResponse) => {
      if (requestId !== requestSeq) {
        return;
      }
      setSnapshot({
        data: payload,
        loading: false,
      });
    })
    .catch((err: unknown) => {
      if (controller.signal.aborted) {
        return;
      }
      if (requestId !== requestSeq) {
        return;
      }
      setSnapshot({
        data: emptyResponse(),
        loading: false,
      });
    })
    .finally(() => {
      fetchInFlight = false;
      if (controller.signal.aborted) {
        return;
      }
      if (requestId !== requestSeq) {
        return;
      }
      setSnapshot({ ...clientSnapshot, loading: false });
    });
}

function onOverlay(): void {
  if (overlayTimer) {
    clearTimeout(overlayTimer);
  }
  overlayTimer = setTimeout(() => {
    refreshTopScorers({ showLoading: false });
  }, 500);
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  subscriberCount += 1;

  if (subscriberCount === 1) {
    refreshTopScorers({ showLoading: true });
    pollTimer = setInterval(() => refreshTopScorers({ showLoading: false }), POLL_MS);
    window.addEventListener(WC26_FIXTURES_UPDATED_EVENT, onOverlay);
  }

  return () => {
    listeners.delete(listener);
    subscriberCount -= 1;

    if (subscriberCount === 0) {
      abortController?.abort();
      abortController = null;
      fetchInFlight = false;
      if (pollTimer) {
        clearInterval(pollTimer);
        pollTimer = null;
      }
      if (overlayTimer) {
        clearTimeout(overlayTimer);
        overlayTimer = null;
      }
      window.removeEventListener(WC26_FIXTURES_UPDATED_EVENT, onOverlay);
    }
  };
}

export function useWc26TopScorers(): {
  data: Wc26TopScorersResponse;
  loading: boolean;
  refresh: () => void;
  scorers: Wc26TopScorersResponse["scorers"];
} {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const refresh = useCallback(() => {
    refreshTopScorers({ showLoading: false });
  }, []);

  return {
    data: snapshot.data,
    loading: snapshot.loading,
    refresh,
    scorers: snapshot.data.scorers,
  };
}
