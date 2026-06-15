import type { Wc26GroupId } from "./group";

/** Stable identifier for a WC26 nation (e.g. `"mex"`, `"usa"`). */
export type TeamId = string;

/** A qualified nation at World Cup 2026 — metadata only, no results. */
export interface Team {
  readonly id: TeamId;
  readonly name: string;
  /** FIFA-style three-letter code (uppercase). */
  readonly code: string;
  readonly groupId: Wc26GroupId;
}
