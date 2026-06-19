"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  mergeFixtureOverlay,
  WC26_FIXTURES_UPDATED_EVENT,
} from "@/lib/wc26-fixture-overlay";
import type { Wc26ScoresApiResponse } from "@/types/fixture-overlay";

const POLL_INTERVAL = 30000; // 30 seconds

async function fetchScores(type: "live" | "results"): Promise<Wc26ScoresApiResponse> {
  const url = type === "live" 
    ? "/api/wc26/scores?live=true"
    : "/api/wc26/scores?results=wc";
  
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${type} scores`);
  }
  return res.json();
}

function apiMatchToOverlay(match: Wc26ScoresApiResponse["matches"][number]) {
  const entry: Record<string, unknown> = {
    status: match.status,
  };

  if (match.homeScore !== null && match.homeScore !== undefined) {
    entry.homeScore = match.homeScore;
  }

  if (match.awayScore !== null && match.awayScore !== undefined) {
    entry.awayScore = match.awayScore;
  }

  if (match.elapsed !== null && match.elapsed !== undefined) {
    entry.elapsed = match.elapsed;
  }

  return entry;
}

function updateOverlayFromApiResponse(response: Wc26ScoresApiResponse): void {
  if (!response.configured || response.matches.length === 0) {
    return;
  }

  const overlay: Record<string, unknown> = {};
  for (const match of response.matches) {
    overlay[match.fixtureId] = apiMatchToOverlay(match);
  }

  mergeFixtureOverlay(overlay as Record<string, { status: string; homeScore?: number; awayScore?: number; elapsed?: number | null }>);
}

/** Client-side hook to poll live scores from API and populate fixture overlay. */
export function useLiveScores(): void {
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const isPollingRef = useRef(false);

  const pollScores = useCallback(async () => {
    if (isPollingRef.current) {
      return;
    }

    isPollingRef.current = true;

    try {
      // Fetch live matches
      const liveResponse = await fetchScores("live");
      updateOverlayFromApiResponse(liveResponse);

      // Fetch finished matches
      const resultsResponse = await fetchScores("results");
      updateOverlayFromApiResponse(resultsResponse);
    } catch (error) {
      console.error("[useLiveScores] Failed to fetch scores:", error);
    } finally {
      isPollingRef.current = false;
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    pollScores();

    // Set up polling
    pollingRef.current = setInterval(pollScores, POLL_INTERVAL);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [pollScores]);
}
