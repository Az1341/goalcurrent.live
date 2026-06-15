import type { TeamId } from "./team";
import type { Wc26GroupId } from "./group";

/** One row in a group table — numeric fields only, no calculation logic. */
export interface StandingRow {
  readonly teamId: TeamId;
  readonly played: number;
  readonly won: number;
  readonly drawn: number;
  readonly lost: number;
  readonly goalsFor: number;
  readonly goalsAgainst: number;
  readonly goalDifference: number;
  readonly points: number;
}

/** Group table snapshot — rows are stored data, not computed in this phase. */
export interface GroupStandings {
  readonly groupId: Wc26GroupId;
  readonly rows: readonly StandingRow[];
}

/** Zeroed row template for placeholder standings before real data. */
export const EMPTY_STANDING_STATS: Omit<StandingRow, "teamId"> = {
  played: 0,
  won: 0,
  drawn: 0,
  lost: 0,
  goalsFor: 0,
  goalsAgainst: 0,
  goalDifference: 0,
  points: 0,
} as const;

export function createEmptyStandingRow(teamId: TeamId): StandingRow {
  return { teamId, ...EMPTY_STANDING_STATS };
}
