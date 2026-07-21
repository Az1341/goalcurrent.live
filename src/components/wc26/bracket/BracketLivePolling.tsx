"use client";

import { useEffect } from "react";
import { LIVE_API_PATHS, useLiveApi } from "@/lib/client/live-data";
import { LIVE_POLL_MATCH_MS } from "@/lib/client/fetcher";
import { applyWc26ScoresToOverlay } from "@/lib/wc26-results-sync";
import type { Wc26ScoresApiResponse } from "@/types/fixture-overlay";

/** Poll live scores when knockout matches are in play; always merge results. */
export default function BracketLivePolling({ enabled }: { enabled: boolean }) {
  const { data: liveData } = useLiveApi<Wc26ScoresApiResponse>(
    enabled ? LIVE_API_PATHS.wc26LiveScores : null,
    { refreshInterval: enabled ? LIVE_POLL_MATCH_MS : undefined },
  );
  const { data: resultsData } = useLiveApi<Wc26ScoresApiResponse>(
    LIVE_API_PATHS.wc26Results,
    { refreshInterval: LIVE_POLL_MATCH_MS, fresh: true },
  );

  useEffect(() => {
    if (liveData) {
      applyWc26ScoresToOverlay(liveData);
    }
  }, [liveData]);

  useEffect(() => {
    if (resultsData) {
      applyWc26ScoresToOverlay(resultsData);
    }
  }, [resultsData]);

  return null;
}
