import type { TeamId } from "./team";
import type { Wc26GroupId } from "./group";
import type { VenueId } from "./venue";

/** Knockout or group-stage phase for a fixture. */
export type FixtureStage =
  | "group"
  | "round-of-32"
  | "round-of-16"
  | "quarter-final"
  | "semi-final"
  | "third-place"
  | "final";

/** Pre-match fixture status — no live or finished states in this phase. */
export type FixtureStatus = "scheduled" | "postponed" | "cancelled";

/** A scheduled match — kickoff and participants only, no scores. */
export interface Fixture {
  readonly id: string;
  /** Official FIFA match number (1–104). */
  readonly matchNumber: number;
  readonly stage: FixtureStage;
  readonly homeTeamId: TeamId;
  readonly awayTeamId: TeamId;
  readonly venueId: VenueId;
  /** ISO 8601 UTC kickoff. */
  readonly kickoffUtc: string;
  readonly status: FixtureStatus;
  /** Present for group-stage fixtures. */
  readonly groupId?: Wc26GroupId;
  /** Group-stage matchday 1–3 when applicable. */
  readonly matchday?: number;
}
