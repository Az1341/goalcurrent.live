import type { TeamId } from "@/types/team";

/** Confirmed R32 fixture with known participants (API-verified home/away order). */
export type ConfirmedKnockoutPairing = {
  readonly fixtureId: string;
  readonly matchNumber: number;
  readonly homeTeamId: TeamId;
  readonly awayTeamId: TeamId;
};

/**
 * Knockout slots where the actual pairing is confirmed — overrides FIFA feeder
 * template labels (e.g. match 75 is Brazil vs Japan, not NED vs MAR).
 */
export const WC26_CONFIRMED_KNOCKOUT_PAIRINGS: readonly ConfirmedKnockoutPairing[] =
  [
    {
      fixtureId: "fixture-075",
      matchNumber: 75,
      homeTeamId: "bra",
      awayTeamId: "jpn",
    },
    {
      fixtureId: "fixture-076",
      matchNumber: 76,
      homeTeamId: "ned",
      awayTeamId: "mar",
    },
    {
      fixtureId: "fixture-080",
      matchNumber: 80,
      homeTeamId: "eng",
      awayTeamId: "cod",
    },
    {
      fixtureId: "fixture-081",
      matchNumber: 81,
      homeTeamId: "usa",
      awayTeamId: "bih",
    },
    {
      fixtureId: "fixture-082",
      matchNumber: 82,
      homeTeamId: "bel",
      awayTeamId: "sen",
    },
    {
      fixtureId: "fixture-083",
      matchNumber: 83,
      homeTeamId: "por",
      awayTeamId: "cro",
    },
    {
      fixtureId: "fixture-084",
      matchNumber: 84,
      homeTeamId: "esp",
      awayTeamId: "aut",
    },
    {
      fixtureId: "fixture-085",
      matchNumber: 85,
      homeTeamId: "sui",
      awayTeamId: "alg",
    },
  ];

const byFixtureId = new Map(
  WC26_CONFIRMED_KNOCKOUT_PAIRINGS.map((entry) => [entry.fixtureId, entry] as const),
);

const byMatchNumber = new Map(
  WC26_CONFIRMED_KNOCKOUT_PAIRINGS.map((entry) => [entry.matchNumber, entry] as const),
);

export function getConfirmedKnockoutPairingByFixtureId(
  fixtureId: string,
): ConfirmedKnockoutPairing | undefined {
  return byFixtureId.get(fixtureId);
}

export function getConfirmedKnockoutPairingByMatchNumber(
  matchNumber: number,
): ConfirmedKnockoutPairing | undefined {
  return byMatchNumber.get(matchNumber);
}
