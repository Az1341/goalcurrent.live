"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getEffectiveFixtures,
  WC26_FIXTURES_UPDATED_EVENT,
} from "@/lib/wc26-fixture-overlay";
import {
  computeAllGroupStandings,
  computeGroupStandings,
} from "@/lib/wc26-standings";
import type { Wc26GroupId } from "@/types/group";
import type { GroupStandings } from "@/types/standing";

function computeAll(): readonly GroupStandings[] {
  return computeAllGroupStandings(getEffectiveFixtures());
}

/** Reactive standings for all WC26 groups. */
export function useWc26Standings(): readonly GroupStandings[] {
  const [standings, setStandings] = useState<readonly GroupStandings[]>(() =>
    computeAll(),
  );

  const refresh = useCallback(() => {
    setStandings(computeAll());
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener(WC26_FIXTURES_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(WC26_FIXTURES_UPDATED_EVENT, refresh);
  }, [refresh]);

  return standings;
}

/** Reactive standings for a single group. */
export function useWc26GroupStandings(
  groupId: Wc26GroupId,
): GroupStandings {
  const all = useWc26Standings();
  return (
    all.find((table) => table.groupId === groupId) ??
    computeGroupStandings(groupId, getEffectiveFixtures())
  );
}
