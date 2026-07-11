import type { MatchDetailPayload } from "@/types/match-detail";

/** Subset of match detail used by statistics graph + player stats sections. */
export type MatchStatsViewModel = Pick<
  MatchDetailPayload,
  "configured" | "apiAvailable" | "events" | "lineups" | "statistics" | "playerStats"
>;

export const MATCH_MOVEMENT_STAT_KEYS = [
  "ball_possession",
  "total_shots",
  "shots_on_goal",
  "corner_kicks",
  "fouls",
  "yellow_cards",
  "red_cards",
] as const;

export const MATCH_MOVEMENT_LABELS: Record<string, string> = {
  ball_possession: "Possession",
  total_shots: "Shots",
  shots_on_goal: "Shots on target",
  corner_kicks: "Corners",
  fouls: "Fouls",
  yellow_cards: "Yellow cards",
  red_cards: "Red cards",
};
