"use client";

import { isWc26TournamentComplete } from "@/lib/wc26/archive";

/**
 * Spain champion popup/banner remain disabled in the WC26 archive era.
 * Do not restore modal or sticky tournament-completion promotions here.
 */
export default function FinalWinnerCelebration() {
  const archiveComplete = isWc26TournamentComplete();
  if (archiveComplete) {
    return null;
  }
  // Live tournament celebrations are intentionally retired until a future
  // competition needs them. Keep this null so archive previews stay quiet.
  return null;
}
