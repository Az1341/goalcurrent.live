"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import { trackMatchOpen } from "@/lib/analytics";

type MatchOpenTrackerProps = {
  matchId: string;
  competition: string;
  homeTeam: string;
  awayTeam: string;
  matchStatus: string;
  sourceSurface?: string;
};

export default function MatchOpenTracker({
  matchId,
  competition,
  homeTeam,
  awayTeam,
  matchStatus,
  sourceSurface = "match_centre",
}: MatchOpenTrackerProps) {
  const locale = useLocale();
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    trackMatchOpen({
      match_id: matchId,
      competition,
      home_team: homeTeam.slice(0, 120),
      away_team: awayTeam.slice(0, 120),
      match_status: matchStatus,
      source_surface: sourceSurface,
      language: locale,
    });
  }, [
    awayTeam,
    competition,
    homeTeam,
    locale,
    matchId,
    matchStatus,
    sourceSurface,
  ]);

  return null;
}
