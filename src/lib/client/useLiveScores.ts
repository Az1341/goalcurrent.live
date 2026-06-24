"use client";

import { LIVE_API_PATHS, useLiveApi } from "@/lib/client/live-data";
import type { Wc26ScoresApiResponse } from "@/types/fixture-overlay";

export function useLiveScores() {
  return useLiveApi<Wc26ScoresApiResponse>(LIVE_API_PATHS.wc26LiveScores);
}
