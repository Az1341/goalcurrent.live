"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getGamesLeftToPlay,
  getGamesPlayed,
} from "@/lib/wc26-tournament-stats";
import {
  getEffectiveFixtures,
  WC26_FIXTURES_UPDATED_EVENT,
} from "@/lib/wc26-fixture-overlay";

export type TournamentStats = {
  gamesPlayed: number;
  gamesLeft: number;
};

function computeStats(): TournamentStats {
  const fixtures = getEffectiveFixtures();
  return {
    gamesPlayed: getGamesPlayed(fixtures),
    gamesLeft: getGamesLeftToPlay(fixtures),
  };
}

/** Reactive tournament progress — updates when fixture overlay changes. */
export function useTournamentStats(): TournamentStats {
  const [stats, setStats] = useState<TournamentStats>(() => computeStats());

  const refresh = useCallback(() => {
    setStats(computeStats());
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener(WC26_FIXTURES_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(WC26_FIXTURES_UPDATED_EVENT, refresh);
  }, [refresh]);

  return stats;
}
