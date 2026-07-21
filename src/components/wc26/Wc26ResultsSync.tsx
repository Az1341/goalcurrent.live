"use client";

import { useEffect } from "react";
import { LIVE_API_PATHS, useLiveApi } from "@/lib/client/live-data";
import { useLiveScores } from "@/lib/client/useLiveScores";
import { isWc26TournamentComplete } from "@/lib/wc26/archive";
import { applyWc26ScoresToOverlay } from "@/lib/wc26-results-sync";
import type { Wc26ScoresApiResponse } from "@/types/fixture-overlay";

/**
 * Invisible client bootstrap — feeds WC26 overlay from unified SWR caches.
 * Disabled when the tournament archive is complete to avoid unnecessary
 * API-Football traffic on historical browsing.
 */
export default function Wc26ResultsSync() {
  const archiveComplete = isWc26TournamentComplete();
  const { data: liveData } = useLiveScores(!archiveComplete);
  const { data: resultsData } = useLiveApi<Wc26ScoresApiResponse>(
    archiveComplete ? null : LIVE_API_PATHS.wc26Results,
    archiveComplete ? undefined : { fresh: true },
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
