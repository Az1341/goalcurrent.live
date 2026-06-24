"use client";

import LiveMatchCentre from "@/components/live/LiveMatchCentre";
import { useLiveScores } from "@/lib/client/useLiveScores";

/** Client shell for /live — subscribes to unified WC26 live-scores SWR cache. */
export default function LivePageClient() {
  useLiveScores();

  return <LiveMatchCentre />;
}
