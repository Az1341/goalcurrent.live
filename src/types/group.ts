import type { TeamId } from "./team";

/** Group-stage identifier — letters a through l (48-team format). */
export const WC26_GROUP_IDS = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
] as const;

export type Wc26GroupId = (typeof WC26_GROUP_IDS)[number];

/** Teams per group in the expanded 2026 format. */
export const TEAMS_PER_GROUP = 4 as const;

/** A World Cup 2026 group — team membership only, no standings. */
export interface Group {
  readonly id: Wc26GroupId;
  readonly label: string;
  readonly teamIds: readonly TeamId[];
}

export function isWc26GroupId(value: string): value is Wc26GroupId {
  return (WC26_GROUP_IDS as readonly string[]).includes(value);
}

export function groupLabel(id: Wc26GroupId): string {
  return `Group ${id.toUpperCase()}`;
}
