import type { EffectiveFixture } from "@/lib/wc26-fixture-overlay";
import { isLiveMatchStatus } from "@/lib/wc26-live";
import type { FixtureStatus } from "@/types/fixture";
import type { TeamId } from "@/types/team";

export type ConfirmedKnockoutResult = {
  readonly matchNumber: number;
  readonly winnerTeamId: TeamId;
  readonly homeScore: number;
  readonly awayScore: number;
  readonly penaltiesHome?: number;
  readonly penaltiesAway?: number;
};

export const WC26_CONFIRMED_KNOCKOUT_RESULTS: readonly ConfirmedKnockoutResult[] = [
  {
    matchNumber: 76,
    winnerTeamId: "mar",
    homeScore: 1,
    awayScore: 1,
    penaltiesHome: 2,
    penaltiesAway: 3,
  },
];

const byMatchNumber = new Map(
  WC26_CONFIRMED_KNOCKOUT_RESULTS.map((entry) => [entry.matchNumber, entry] as const),
);

export function getConfirmedKnockoutResult(
  matchNumber: number,
): ConfirmedKnockoutResult | undefined {
  return byMatchNumber.get(matchNumber);
}

export function getConfirmedKnockoutWinner(
  matchNumber: number,
): TeamId | undefined {
  return byMatchNumber.get(matchNumber)?.winnerTeamId;
}

export function getConfirmedPenaltyShootout(
  matchNumber: number,
): { home: number; away: number } | null {
  const entry = byMatchNumber.get(matchNumber);
  if (entry?.penaltiesHome === undefined || entry?.penaltiesAway === undefined) {
    return null;
  }
  return { home: entry.penaltiesHome, away: entry.penaltiesAway };
}

/** Merge confirmed knockout scores when API overlay is absent. */
export function applyConfirmedKnockoutResults(
  fixtures: readonly EffectiveFixture[],
): EffectiveFixture[] {
  return fixtures.map((fixture) => {
    if (fixture.stage === "group") {
      return fixture;
    }

    const confirmed = getConfirmedKnockoutResult(fixture.matchNumber);
    if (!confirmed) {
      return fixture;
    }

    if (isLiveMatchStatus(fixture.status)) {
      return fixture;
    }

    const hasOverlayScore =
      typeof fixture.homeScore === "number" &&
      typeof fixture.awayScore === "number";
    if (hasOverlayScore) {
      return {
        ...fixture,
        penaltiesHome: fixture.penaltiesHome ?? confirmed.penaltiesHome,
        penaltiesAway: fixture.penaltiesAway ?? confirmed.penaltiesAway,
      };
    }

    return {
      ...fixture,
      status: "ft" as FixtureStatus,
      homeScore: confirmed.homeScore,
      awayScore: confirmed.awayScore,
      ...(confirmed.penaltiesHome !== undefined
        ? { penaltiesHome: confirmed.penaltiesHome }
        : {}),
      ...(confirmed.penaltiesAway !== undefined
        ? { penaltiesAway: confirmed.penaltiesAway }
        : {}),
    };
  });
}
