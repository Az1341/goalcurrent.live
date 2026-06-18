import type { MatchEventItem } from "@/types/match-detail";

function normalizeEventKey(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

/** True when the event counts as a scored goal for scorers / summaries. */
export function isCountableGoal(event: MatchEventItem): boolean {
  const type = event.type.toLowerCase();
  const detail = event.detail.toLowerCase();

  if (type !== "goal") {
    return false;
  }
  if (detail.includes("missed")) {
    return false;
  }
  if (
    detail.includes("disallowed") ||
    detail.includes("cancelled") ||
    detail.includes("canceled")
  ) {
    return false;
  }

  return true;
}

export function isVarDisallowedGoalEvent(event: MatchEventItem): boolean {
  const type = event.type.toLowerCase();
  const detail = event.detail.toLowerCase();

  if (type !== "var") {
    return false;
  }

  return (
    detail.includes("goal") &&
    (detail.includes("disallowed") ||
      detail.includes("cancelled") ||
      detail.includes("canceled") ||
      detail.includes("no goal"))
  );
}

export function isOwnGoalEvent(event: MatchEventItem): boolean {
  return (
    event.type.toLowerCase() === "goal" &&
    event.detail.toLowerCase().includes("own")
  );
}

/** Match key for pairing a Goal event with a later VAR disallowed review. */
export function goalEventMatchKey(event: MatchEventItem): string {
  const minute = event.minute ?? 0;
  const extra = event.extra ?? 0;
  return `${minute}|${extra}|${normalizeEventKey(event.teamName)}|${normalizeEventKey(event.playerName)}`;
}

export function buildVarCancelledGoalKeys(
  events: readonly MatchEventItem[],
): ReadonlySet<string> {
  const keys = new Set<string>();
  for (const event of events) {
    if (isVarDisallowedGoalEvent(event)) {
      keys.add(goalEventMatchKey(event));
    }
  }
  return keys;
}

export function isGoalCancelledByVar(
  event: MatchEventItem,
  varCancelledKeys: ReadonlySet<string>,
): boolean {
  return isCountableGoal(event) && varCancelledKeys.has(goalEventMatchKey(event));
}

export function expectedGoalTotal(
  homeScore: number | null,
  awayScore: number | null,
): number | null {
  if (homeScore == null || awayScore == null) {
    return null;
  }
  return homeScore + awayScore;
}
