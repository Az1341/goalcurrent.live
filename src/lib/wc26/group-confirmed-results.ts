import type { EffectiveFixture } from "@/lib/wc26-fixture-overlay";
import { isLiveMatchStatus } from "@/lib/wc26-live";
import type { FixtureStatus } from "@/types/fixture";
import { isWc26GroupStageComplete } from "@/lib/wc26-final-standings";
import {
  WC26_CONFIRMED_GROUP_RESULTS,
  type ConfirmedGroupResult,
} from "@/lib/wc26/confirmed-results-ssot";

export type { ConfirmedGroupResult };
export { WC26_CONFIRMED_GROUP_RESULTS };

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

    return {
      ...fixture,
      status: "ft" as FixtureStatus,
      homeScore: confirmed.homeScore,
      awayScore: confirmed.awayScore,
    };
  });
}
