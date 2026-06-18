import { getTeamDisplayName } from "@/lib/teamIdentity";
import {
  buildVarCancelledGoalKeys,
  expectedGoalTotal,
  isCountableGoal,
  isGoalCancelledByVar,
  isOwnGoalEvent,
} from "@/lib/wc26-goal-events";
import type { MatchEventItem } from "@/types/match-detail";

export type ScorerGoalEvent = {
  readonly playerName: string;
  readonly teamName: string;
  readonly isOwnGoal: boolean;
};

export type TopScorerRow = {
  readonly rank: number;
  readonly playerName: string;
  readonly teamName: string;
  readonly goals: number;
  readonly ownGoals: number;
};

export const TOP_SCORERS_LIMIT = 6;

function normalizeKey(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function extractScoringGoalsFromEvents(
  events: readonly MatchEventItem[],
): ScorerGoalEvent[] {
  const varCancelledKeys = buildVarCancelledGoalKeys(events);
  const goals: ScorerGoalEvent[] = [];

  for (const event of events) {
    if (!isCountableGoal(event) || isGoalCancelledByVar(event, varCancelledKeys)) {
      continue;
    }

    const playerName = event.playerName.trim();
    if (!playerName) {
      continue;
    }

    const teamName =
      getTeamDisplayName(event.teamName) ?? event.teamName.trim();
    if (!teamName) {
      continue;
    }

    goals.push({
      playerName,
      teamName,
      isOwnGoal: isOwnGoalEvent(event),
    });
  }

  return goals;
}

/**
 * Returns goal events only when the feed matches the official final score.
 * Empty array when events are missing, incomplete, or inconsistent.
 */
export function extractVerifiedScoringGoals(
  events: readonly MatchEventItem[],
  homeScore: number | null,
  awayScore: number | null,
): ScorerGoalEvent[] {
  const expectedTotal = expectedGoalTotal(homeScore, awayScore);
  if (expectedTotal == null) {
    return [];
  }

  const goals = extractScoringGoalsFromEvents(events);
  if (goals.length !== expectedTotal) {
    return [];
  }

  return goals;
}

export function aggregateTopScorers(
  goalEvents: readonly ScorerGoalEvent[],
  limit = TOP_SCORERS_LIMIT,
): TopScorerRow[] {
  const totals = new Map<
    string,
    { playerName: string; teamName: string; goals: number; ownGoals: number }
  >();

  for (const goal of goalEvents) {
    const key = `${normalizeKey(goal.playerName)}|${normalizeKey(goal.teamName)}`;
    const existing = totals.get(key);
    if (existing) {
      existing.goals += 1;
      if (goal.isOwnGoal) {
        existing.ownGoals += 1;
      }
      continue;
    }

    totals.set(key, {
      playerName: goal.playerName,
      teamName: goal.teamName,
      goals: 1,
      ownGoals: goal.isOwnGoal ? 1 : 0,
    });
  }

  const sorted = [...totals.values()].sort((left, right) => {
    if (right.goals !== left.goals) {
      return right.goals - left.goals;
    }
    return left.playerName.localeCompare(right.playerName, undefined, {
      sensitivity: "base",
    });
  });

  return sorted.slice(0, limit).map((row, index) => ({
    rank: index + 1,
    playerName: row.playerName,
    teamName: row.teamName,
    goals: row.goals,
    ownGoals: row.ownGoals,
  }));
}

export function formatTopScorerPlayerName(row: TopScorerRow): string {
  if (row.ownGoals > 0 && row.ownGoals === row.goals) {
    return `${row.playerName} (OG)`;
  }
  if (row.ownGoals > 0) {
    return `${row.playerName} (${row.ownGoals} OG)`;
  }
  return row.playerName;
}

/** Sum of all goals in the top-scorers table — must match verified event total. */
export function sumTopScorerGoals(scorers: readonly TopScorerRow[]): number {
  return scorers.reduce((total, row) => total + row.goals, 0);
}

/** Count verified scoring events across completed matches. */
export function countVerifiedTournamentGoals(
  goalEvents: readonly ScorerGoalEvent[],
): number {
  return goalEvents.length;
}
