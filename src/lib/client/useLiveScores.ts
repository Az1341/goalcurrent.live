"use client";

import { LIVE_API_PATHS, useLiveApi } from "@/lib/client/live-data";
import type { Wc26ScoresApiResponse } from "@/types/fixture-overlay";

/** When enabled is false, no WC26 live-scores request is made. */
export function useLiveScores(enabled = true) {
  return useLiveApi<Wc26ScoresApiResponse>(
    enabled ? LIVE_API_PATHS.wc26LiveScores : null,
    enabled ? { fresh: true } : undefined,
  );
}
