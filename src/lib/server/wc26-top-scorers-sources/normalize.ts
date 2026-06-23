import { getTeamDisplayName } from "@/lib/teamIdentity";
import {
  aggregateTopScorers,
  type ScorerGoalEvent,
  type TopScorerRow,
} from "@/lib/wc26-top-scorers";
import type { Wc26SourceGoalFetchResult } from "./types";

function normalizeKey(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function canonicalTeamName(teamName: string): string {
  return getTeamDisplayName(teamName) ?? teamName.trim();
}

/** Expand goal events into ranked rows (one row per goal event). */
export function topScorerRowsFromGoalEvents(
  goals: readonly ScorerGoalEvent[],
): TopScorerRow[] {
  return aggregateTopScorers(goals, Number.POSITIVE_INFINITY);
}

/**
 * Merge scorer rows from multiple live sources.
 * Deduplicates by player + team and sums goal totals.
 */
export function mergeTopScorerRowsFromSources(
  sources: readonly Wc26SourceGoalFetchResult[],
): TopScorerRow[] {
  const totals = new Map<
    string,
    { playerName: string; teamName: string; goals: number; ownGoals: number }
  >();

  for (const source of sources) {
    if (!source.available || source.goals.length === 0) {
      continue;
    }

    const rows = topScorerRowsFromGoalEvents(source.goals);
    for (const row of rows) {
      const teamName = canonicalTeamName(row.teamName);
      const key = `${normalizeKey(row.playerName)}|${normalizeKey(teamName)}`;
      const existing = totals.get(key);
      if (existing) {
        existing.goals += row.goals;
        existing.ownGoals += row.ownGoals;
      } else {
        totals.set(key, {
          playerName: row.playerName,
          teamName,
          goals: row.goals,
          ownGoals: row.ownGoals,
        });
      }
    }
  }

  const sorted = [...totals.values()].sort((left, right) => {
    if (right.goals !== left.goals) {
      return right.goals - left.goals;
    }
    return left.playerName.localeCompare(right.playerName, undefined, {
      sensitivity: "base",
    });
  });

  return sorted.map((row, index) => ({
    rank: index + 1,
    playerName: row.playerName,
    teamName: row.teamName,
    goals: row.goals,
    ownGoals: row.ownGoals,
  }));
}

export function sumTopScorerRowGoals(scorers: readonly TopScorerRow[]): number {
  return scorers.reduce((total, row) => total + row.goals, 0);
}
