"use client";

import { useSyncExternalStore } from "react";
import { mergeEditorialFirst } from "@/lib/editorial-news";
import type { NewsApiResponse, NewsArticle } from "@/types/news";

const REFRESH_MS = 3_600_000;

type NewsSnapshot = {
  readonly articles: readonly NewsArticle[];
  readonly loading: boolean;
  readonly error: boolean;
};

const serverSnapshot: NewsSnapshot = {
  articles: [],
  loading: true,
  error: false,
};

let clientSnapshot: NewsSnapshot = {
  articles: [],
  loading: true,
  error: false,
};

const listeners = new Set<() => void>();
let subscriberCount = 0;
let abortController: AbortController | null = null;
let fetchInFlight = false;
let pollTimer: ReturnType<typeof setInterval> | null = null;

function emit(): void {
  for (const listener of listeners) {
    listener();
  }
}

function setSnapshot(next: NewsSnapshot): void {
  clientSnapshot = next;
  emit();
}

async function fetchNews(): Promise<void> {
  if (fetchInFlight) {
    return;
  }

  fetchInFlight = true;
  abortController?.abort();
  abortController = new AbortController();

  try {
    const response = await fetch("/api/news", {
      cache: "no-store",
      signal: abortController.signal,
    });

    if (!response.ok) {
      throw new Error(`News API ${response.status}`);
    }

    const data = (await response.json()) as NewsApiResponse;
    const merged = mergeEditorialFirst(data.articles);
    if (!merged.length) {
      throw new Error("No articles");
    }

    setSnapshot({
      articles: merged,
      loading: false,
      error: false,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return;
    }

    setSnapshot({
      articles: [],
      loading: false,
      error: true,
    });
  } finally {
    fetchInFlight = false;
  }
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  subscriberCount += 1;

  if (subscriberCount === 1) {
    void fetchNews();
    pollTimer = setInterval(() => {
      void fetchNews();
    }, REFRESH_MS);
  }

  return () => {
    listeners.delete(listener);
    subscriberCount = Math.max(0, subscriberCount - 1);

    if (subscriberCount === 0) {
      abortController?.abort();
      abortController = null;
      if (pollTimer) {
        clearInterval(pollTimer);
        pollTimer = null;
      }
    }
  };
}

function getClientSnapshot(): NewsSnapshot {
  return clientSnapshot;
}

function getServerSnapshot(): NewsSnapshot {
  return serverSnapshot;
}

export function useNewsFeed(): NewsSnapshot {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
