import type { EffectiveFixture } from "@/lib/wc26-fixture-overlay";
import type { FixtureStatus } from "@/types/fixture";
import type { TeamId } from "@/types/team";
import type { Wc26ApiMatch } from "@/types/fixture-overlay";
import { getConfirmedKnockoutPairingByMatchNumber } from "@/lib/wc26/knockout-confirmed-pairings";
import {
  WC26_CONFIRMED_KNOCKOUT_RESULTS,
  type ConfirmedKnockoutResult,
} from "@/lib/wc26/confirmed-results-ssot";

export type { ConfirmedKnockoutResult };
export { WC26_CONFIRMED_KNOCKOUT_RESULTS };

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

function resolvedConfirmedStatus(
  confirmed: ConfirmedKnockoutResult,
): "ft" | "aet" | "pen" {
  if (confirmed.matchStatus) {
    return confirmed.matchStatus;
  }
  if (
    confirmed.penaltiesHome !== undefined &&
    confirmed.penaltiesAway !== undefined
  ) {
    return "pen";
  }
  return "ft";
}

function confirmedStatusShort(status: "ft" | "aet" | "pen"): string {
  if (status === "pen") return "PEN";
  if (status === "aet") return "AET";
  return "FT";
}

function confirmedElapsed(status: "ft" | "aet" | "pen"): number {
  if (status === "aet") return 120;
  if (status === "pen") return 120;
  return 90;
}
export function applyConfirmedKnockoutResults(
  fixtures: readonly EffectiveFixture[],
): EffectiveFixture[] {
  return fixtures.map((fixture) => applyConfirmedKnockoutToFixture(fixture));
}

/** Apply editorial confirmed scores to API match rows (scores route / sync). */
export function applyConfirmedKnockoutResultsToApiMatches(
  matches: readonly Wc26ApiMatch[],
): Wc26ApiMatch[] {
  return matches.map((match) => {
    const pairing = getConfirmedKnockoutPairingByMatchNumber(match.matchNumber);
    const withPairing = pairing
      ? {
          ...match,
          homeTeamId: pairing.homeTeamId,
          awayTeamId: pairing.awayTeamId,
        }
      : match;

    const confirmed = getConfirmedKnockoutResult(match.matchNumber);
    if (!confirmed) {
      return withPairing;
    }

    const status = resolvedConfirmedStatus(confirmed);
    const hasPenalties =
      confirmed.penaltiesHome !== undefined &&
      confirmed.penaltiesAway !== undefined;

    return {
      ...withPairing,
      status,
      statusShort: confirmedStatusShort(status),
      elapsed: confirmedElapsed(status),
      homeScore: confirmed.homeScore,
      awayScore: confirmed.awayScore,
      ...(hasPenalties
        ? {
            penaltiesHome: confirmed.penaltiesHome,
            penaltiesAway: confirmed.penaltiesAway,
          }
        : {
            penaltiesHome: undefined,
            penaltiesAway: undefined,
          }),
    };
  });
}

function applyConfirmedKnockoutPairingOverlay(
  fixture: EffectiveFixture,
): EffectiveFixture {
  const pairing = getConfirmedKnockoutPairingByMatchNumber(fixture.matchNumber);
  if (!pairing) {
    return fixture;
  }

  return {
    ...fixture,
    overlayHomeTeamId: pairing.homeTeamId,
    overlayAwayTeamId: pairing.awayTeamId,
  };
}

function applyConfirmedKnockoutToFixture(fixture: EffectiveFixture): EffectiveFixture {
  if (fixture.stage === "group") {
    return fixture;
  }

  const withPairing = applyConfirmedKnockoutPairingOverlay(fixture);
  const confirmed = getConfirmedKnockoutResult(fixture.matchNumber);
  if (!confirmed) {
    return withPairing;
  }

  const status = resolvedConfirmedStatus(confirmed);
  const hasPenalties =
    confirmed.penaltiesHome !== undefined &&
    confirmed.penaltiesAway !== undefined;

  return {
    ...withPairing,
    status: status as FixtureStatus,
    homeScore: confirmed.homeScore,
    awayScore: confirmed.awayScore,
    ...(hasPenalties
      ? {
          penaltiesHome: confirmed.penaltiesHome,
          penaltiesAway: confirmed.penaltiesAway,
        }
      : {
          penaltiesHome: undefined,
          penaltiesAway: undefined,
        }),
  };
}
