"use client";

import MatchDetailContent from "@/components/match/MatchDetailContent";
import { useLiveScores } from "@/lib/client/useLiveScores";

type MatchPageClientProps = {
  fixtureId: string;
};

/** Client shell — shares unified live-scores SWR cache with scoreboard and overlay sync. */
export default function MatchPageClient({ fixtureId }: MatchPageClientProps) {
  useLiveScores();

  return <MatchDetailContent fixtureId={fixtureId} />;
}
