"use client";

import { WC26_FINAL_GROUP_STANDINGS } from "@/lib/wc26-final-standings";
import type { Wc26GroupId } from "@/types/group";
import type { GroupStandings } from "@/types/standing";

/** Final group-stage standings (hardcoded — group stage complete). */
export function useWc26Standings(): readonly GroupStandings[] {
  return WC26_FINAL_GROUP_STANDINGS;
}

/** Final standings for a single group. */
export function useWc26GroupStandings(groupId: Wc26GroupId): GroupStandings {
  return (
    WC26_FINAL_GROUP_STANDINGS.find((table) => table.groupId === groupId) ?? {
      groupId,
      rows: [],
    }
  );
}
