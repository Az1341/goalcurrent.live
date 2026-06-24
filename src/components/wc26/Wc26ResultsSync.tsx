"use client";

import { useEffect } from "react";
import { LIVE_API_PATHS, useLiveApi } from "@/lib/client/live-data";
import { useLiveScores } from "@/lib/client/useLiveScores";
import { applyWc26ScoresToOverlay } from "@/lib/wc26-results-sync";
import type { Wc26ScoresApiResponse } from "@/types/fixture-overlay";

/** Invisible client bootstrap — feeds WC26 overlay from unified SWR caches. */
export default function Wc26ResultsSync() {
  const { data: liveData } = useLiveScores();
  const { data: resultsData } = useLiveApi<Wc26ScoresApiResponse>(
    LIVE_API_PATHS.wc26Results,
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
