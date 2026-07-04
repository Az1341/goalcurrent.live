import type { EffectiveFixture } from "@/lib/wc26-fixture-overlay";
import { isLiveMatchStatus } from "@/lib/wc26-live";
import type { FixtureStatus } from "@/types/fixture";
import type { TeamId } from "@/types/team";
import type { Wc26ApiMatch } from "@/types/fixture-overlay";
import { getConfirmedKnockoutPairingByMatchNumber } from "@/lib/wc26/knockout-confirmed-pairings";

export type ConfirmedKnockoutResult = {
  readonly matchNumber: number;
  readonly winnerTeamId: TeamId;
  readonly homeScore: number;
  readonly awayScore: number;
  readonly penaltiesHome?: number;
  readonly penaltiesAway?: number;
  /** Finished status when not plain FT (e.g. after extra time). */
  readonly matchStatus?: "ft" | "aet" | "pen";
};

export const WC26_CONFIRMED_KNOCKOUT_RESULTS: readonly ConfirmedKnockoutResult[] = [
  {
    matchNumber: 73,
    winnerTeamId: "can",
    homeScore: 0,
    awayScore: 1,
  },
  {
    matchNumber: 74,
    winnerTeamId: "par",
    homeScore: 1,
    awayScore: 1,
    penaltiesHome: 3,
    penaltiesAway: 4,
    matchStatus: "pen",
  },
  {
    matchNumber: 75,
    winnerTeamId: "bra",
    homeScore: 2,
    awayScore: 1,
  },
  {
    matchNumber: 76,
    winnerTeamId: "mar",
    homeScore: 1,
    awayScore: 1,
    penaltiesHome: 2,
    penaltiesAway: 3,
    matchStatus: "pen",
  },
  {
    matchNumber: 77,
    winnerTeamId: "fra",
    homeScore: 3,
    awayScore: 0,
  },
  {
    matchNumber: 78,
    winnerTeamId: "nor",
    homeScore: 1,
    awayScore: 2,
  },
  {
    matchNumber: 79,
    winnerTeamId: "mex",
    homeScore: 2,
    awayScore: 0,
  },
  {
    matchNumber: 80,
    winnerTeamId: "eng",
    homeScore: 2,
    awayScore: 1,
  },
  {
    matchNumber: 81,
    winnerTeamId: "usa",
    homeScore: 2,
    awayScore: 0,
  },
  {
    matchNumber: 82,
    winnerTeamId: "bel",
    homeScore: 3,
    awayScore: 2,
    matchStatus: "aet",
  },
  {
    matchNumber: 83,
    winnerTeamId: "por",
    homeScore: 2,
    awayScore: 1,
  },
  {
    matchNumber: 84,
    winnerTeamId: "esp",
    homeScore: 3,
    awayScore: 0,
  },
  {
    matchNumber: 85,
    winnerTeamId: "sui",
    homeScore: 2,
    awayScore: 0,
  },
  {
    matchNumber: 86,
    winnerTeamId: "arg",
    homeScore: 3,
    awayScore: 2,
    matchStatus: "aet",
  },
  {
    matchNumber: 87,
    winnerTeamId: "col",
    homeScore: 1,
    awayScore: 0,
  },
  {
    matchNumber: 88,
    winnerTeamId: "egy",
    homeScore: 1,
    awayScore: 1,
    penaltiesHome: 2,
    penaltiesAway: 4,
    matchStatus: "pen",
  },
  {
    matchNumber: 89,
    winnerTeamId: "mar",
    homeScore: 0,
    awayScore: 3,
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
          homeTeamId: match.homeTeamId ?? pairing.homeTeamId,
          awayTeamId: match.awayTeamId ?? pairing.awayTeamId,
        }
      : match;

    const confirmed = getConfirmedKnockoutResult(match.matchNumber);
    if (!confirmed || isLiveMatchStatus(withPairing.status)) {
      return withPairing;
    }

    const hasApiTruth =
      withPairing.apiFixtureId != null &&
      withPairing.homeScore !== null &&
      withPairing.awayScore !== null;

    if (hasApiTruth) {
      return {
        ...withPairing,
        penaltiesHome: withPairing.penaltiesHome ?? confirmed.penaltiesHome,
        penaltiesAway: withPairing.penaltiesAway ?? confirmed.penaltiesAway,
      };
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
    overlayHomeTeamId: fixture.overlayHomeTeamId ?? pairing.homeTeamId,
    overlayAwayTeamId: fixture.overlayAwayTeamId ?? pairing.awayTeamId,
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

  if (isLiveMatchStatus(withPairing.status)) {
    return withPairing;
  }

  const hasApiOverlay =
    withPairing.apiFixtureId != null &&
    typeof withPairing.homeScore === "number" &&
    typeof withPairing.awayScore === "number";

  if (hasApiOverlay) {
    return {
      ...withPairing,
      penaltiesHome: withPairing.penaltiesHome ?? confirmed.penaltiesHome,
      penaltiesAway: withPairing.penaltiesAway ?? confirmed.penaltiesAway,
    };
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
