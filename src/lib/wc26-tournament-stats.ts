import { WC26_FIXTURES, WC26_TOURNAMENT } from "@/data/wc26";
import type { FixtureStatus } from "@/types/fixture";

const COMPLETED_STATUSES = new Set([
  "ft",
  "finished",
  "completed",
  "full-time",
  "aet",
  "pen",
]);

function normalizeStatus(status: string): string {
  return status.trim().toLowerCase();
}

/** True when a fixture status represents a completed match. */
export function isCompletedMatchStatus(status: FixtureStatus | string): boolean {
  return COMPLETED_STATUSES.has(normalizeStatus(status));
}

/** Count of finished tournament matches in the loaded fixture dataset. */
export function getGamesPlayed(): number {
  return WC26_FIXTURES.filter((fixture) =>
    isCompletedMatchStatus(fixture.status),
  ).length;
}

/** Remaining tournament matches: 104 minus completed. */
export function getGamesLeftToPlay(): number {
  return Math.max(WC26_TOURNAMENT.fixtureCount - getGamesPlayed(), 0);
}
