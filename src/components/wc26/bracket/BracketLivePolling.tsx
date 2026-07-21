"use client";

import { useEffect } from "react";
import { LIVE_API_PATHS, useLiveApi } from "@/lib/client/live-data";
import { LIVE_POLL_MATCH_MS } from "@/lib/client/fetcher";
import { applyWc26ScoresToOverlay } from "@/lib/wc26-results-sync";
import type { Wc26ScoresApiResponse } from "@/types/fixture-overlay";

type BracketLivePollingProps = {
  /** When false, live score polling is off. */
  enabled: boolean;
  /** When true, skip all WC26 score/result network polling (historical archive). */
  archiveMode?: boolean;
};

/** Poll live scores when knockout matches are in play; merge results when not archived. */
export default function BracketLivePolling({
  enabled,
  archiveMode = false,
}: BracketLivePollingProps) {
  const allowNetwork = !archiveMode;
  const { data: liveData } = useLiveApi<Wc26ScoresApiResponse>(
    allowNetwork && enabled ? LIVE_API_PATHS.wc26LiveScores : null,
    { refreshInterval: allowNetwork && enabled ? LIVE_POLL_MATCH_MS : undefined },
  );
  const { data: resultsData } = useLiveApi<Wc26ScoresApiResponse>(
    allowNetwork ? LIVE_API_PATHS.wc26Results : null,
    {
      refreshInterval: allowNetwork ? LIVE_POLL_MATCH_MS : undefined,
      fresh: true,
    },
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