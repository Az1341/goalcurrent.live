import type { EffectiveFixture } from "@/lib/wc26-fixture-overlay";
import { isLiveMatchStatus } from "@/lib/wc26-live";
import type { FixtureStatus } from "@/types/fixture";
import { isWc26GroupStageComplete } from "@/lib/wc26-final-standings";

export type ConfirmedGroupResult = {
  readonly matchNumber: number;
  readonly homeScore: number;
  readonly awayScore: number;
};

/** Official group-stage results (matches 1–72) — FIFA / API-Football verified. */
export const WC26_CONFIRMED_GROUP_RESULTS: readonly ConfirmedGroupResult[] = [
  { matchNumber: 1, homeScore: 2, awayScore: 0 },
  { matchNumber: 2, homeScore: 2, awayScore: 1 },
  { matchNumber: 3, homeScore: 1, awayScore: 1 },
  { matchNumber: 4, homeScore: 4, awayScore: 1 },
  { matchNumber: 5, homeScore: 1, awayScore: 1 },
  { matchNumber: 6, homeScore: 1, awayScore: 1 },
  { matchNumber: 7, homeScore: 0, awayScore: 1 },
  { matchNumber: 8, homeScore: 2, awayScore: 0 },
  { matchNumber: 9, homeScore: 7, awayScore: 1 },
  { matchNumber: 10, homeScore: 2, awayScore: 2 },
  { matchNumber: 11, homeScore: 1, awayScore: 0 },
  { matchNumber: 12, homeScore: 5, awayScore: 1 },
  { matchNumber: 13, homeScore: 0, awayScore: 0 },
  { matchNumber: 14, homeScore: 1, awayScore: 1 },
  { matchNumber: 15, homeScore: 2, awayScore: 2 },
  { matchNumber: 16, homeScore: 1, awayScore: 1 },
  { matchNumber: 17, homeScore: 3, awayScore: 1 },
  { matchNumber: 18, homeScore: 1, awayScore: 4 },
  { matchNumber: 19, homeScore: 3, awayScore: 0 },
  { matchNumber: 20, homeScore: 3, awayScore: 1 },
  { matchNumber: 21, homeScore: 1, awayScore: 1 },
  { matchNumber: 22, homeScore: 4, awayScore: 2 },
  { matchNumber: 23, homeScore: 1, awayScore: 0 },
  { matchNumber: 24, homeScore: 1, awayScore: 3 },
  { matchNumber: 25, homeScore: 1, awayScore: 1 },
  { matchNumber: 26, homeScore: 4, awayScore: 1 },
  { matchNumber: 27, homeScore: 6, awayScore: 0 },
  { matchNumber: 28, homeScore: 1, awayScore: 0 },
  { matchNumber: 29, homeScore: 2, awayScore: 0 },
  { matchNumber: 30, homeScore: 0, awayScore: 1 },
  { matchNumber: 31, homeScore: 3, awayScore: 0 },
  { matchNumber: 32, homeScore: 0, awayScore: 1 },
  { matchNumber: 33, homeScore: 5, awayScore: 1 },
  { matchNumber: 34, homeScore: 2, awayScore: 1 },
  { matchNumber: 35, homeScore: 0, awayScore: 0 },
  { matchNumber: 36, homeScore: 0, awayScore: 4 },
  { matchNumber: 37, homeScore: 4, awayScore: 0 },
  { matchNumber: 38, homeScore: 0, awayScore: 0 },
  { matchNumber: 39, homeScore: 2, awayScore: 2 },
  { matchNumber: 40, homeScore: 1, awayScore: 3 },
  { matchNumber: 41, homeScore: 2, awayScore: 0 },
  { matchNumber: 42, homeScore: 3, awayScore: 0 },
  { matchNumber: 43, homeScore: 3, awayScore: 2 },
  { matchNumber: 44, homeScore: 1, awayScore: 2 },
  { matchNumber: 45, homeScore: 5, awayScore: 0 },
  { matchNumber: 46, homeScore: 0, awayScore: 0 },
  { matchNumber: 47, homeScore: 0, awayScore: 1 },
  { matchNumber: 48, homeScore: 1, awayScore: 0 },
  { matchNumber: 49, homeScore: 2, awayScore: 1 },
  { matchNumber: 50, homeScore: 3, awayScore: 1 },
  { matchNumber: 51, homeScore: 0, awayScore: 3 },
  { matchNumber: 52, homeScore: 4, awayScore: 2 },
  { matchNumber: 53, homeScore: 0, awayScore: 3 },
  { matchNumber: 54, homeScore: 1, awayScore: 0 },
  { matchNumber: 55, homeScore: 0, awayScore: 2 },
  { matchNumber: 56, homeScore: 2, awayScore: 1 },
  { matchNumber: 57, homeScore: 1, awayScore: 1 },
  { matchNumber: 58, homeScore: 1, awayScore: 3 },
  { matchNumber: 59, homeScore: 3, awayScore: 2 },
  { matchNumber: 60, homeScore: 0, awayScore: 0 },
  { matchNumber: 61, homeScore: 1, awayScore: 4 },
  { matchNumber: 62, homeScore: 5, awayScore: 0 },
  { matchNumber: 63, homeScore: 0, awayScore: 0 },
  { matchNumber: 64, homeScore: 0, awayScore: 1 },
  { matchNumber: 65, homeScore: 1, awayScore: 1 },
  { matchNumber: 66, homeScore: 1, awayScore: 5 },
  { matchNumber: 67, homeScore: 0, awayScore: 2 },
  { matchNumber: 68, homeScore: 2, awayScore: 1 },
  { matchNumber: 69, homeScore: 0, awayScore: 0 },
  { matchNumber: 70, homeScore: 3, awayScore: 1 },
  { matchNumber: 71, homeScore: 3, awayScore: 3 },
  { matchNumber: 72, homeScore: 1, awayScore: 3 },
];

const byMatchNumber = new Map(
  WC26_CONFIRMED_GROUP_RESULTS.map((entry) => [entry.matchNumber, entry] as const),
);

export function getConfirmedGroupResult(
  matchNumber: number,
): ConfirmedGroupResult | undefined {
  return byMatchNumber.get(matchNumber);
}

export function applyConfirmedGroupResults(
  fixtures: readonly EffectiveFixture[],
): EffectiveFixture[] {
  if (!isWc26GroupStageComplete()) {
    return [...fixtures];
  }

  return fixtures.map((fixture) => {
    if (fixture.stage !== "group") {
      return fixture;
    }

    const confirmed = getConfirmedGroupResult(fixture.matchNumber ?? 0);
    if (!confirmed) {
      return fixture;
    }

    if (isLiveMatchStatus(fixture.status)) {
      return fixture;
    }

    const hasApiOverlay =
      fixture.apiFixtureId != null &&
      typeof fixture.homeScore === "number" &&
      typeof fixture.awayScore === "number";

    if (hasApiOverlay) {
      return fixture;
    }

    return {
      ...fixture,
      status: "ft" as FixtureStatus,
      homeScore: confirmed.homeScore,
      awayScore: confirmed.awayScore,
    };
  });
}
