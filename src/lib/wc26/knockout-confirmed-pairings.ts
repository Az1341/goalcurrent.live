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
      fixtureId: "fixture-073",
      matchNumber: 73,
      homeTeamId: "rsa",
      awayTeamId: "can",
    },
    {
      fixtureId: "fixture-074",
      matchNumber: 74,
      homeTeamId: "ger",
      awayTeamId: "par",
    },
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
      fixtureId: "fixture-077",
      matchNumber: 77,
      homeTeamId: "fra",
      awayTeamId: "swe",
    },
    {
      fixtureId: "fixture-078",
      matchNumber: 78,
      homeTeamId: "civ",
      awayTeamId: "nor",
    },
    {
      fixtureId: "fixture-079",
      matchNumber: 79,
      homeTeamId: "mex",
      awayTeamId: "ecu",
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
    {
      fixtureId: "fixture-086",
      matchNumber: 86,
      homeTeamId: "arg",
      awayTeamId: "cpv",
    },
    {
      fixtureId: "fixture-087",
      matchNumber: 87,
      homeTeamId: "col",
      awayTeamId: "gha",
    },
    {
      fixtureId: "fixture-088",
      matchNumber: 88,
      homeTeamId: "aus",
      awayTeamId: "egy",
    },
    {
      fixtureId: "fixture-089",
      matchNumber: 89,
      homeTeamId: "can",
      awayTeamId: "mar",
    },
    {
      fixtureId: "fixture-090",
      matchNumber: 90,
      homeTeamId: "par",
      awayTeamId: "fra",
    },
    {
      fixtureId: "fixture-091",
      matchNumber: 91,
      homeTeamId: "bra",
      awayTeamId: "nor",
    },
    {
      fixtureId: "fixture-092",
      matchNumber: 92,
      homeTeamId: "mex",
      awayTeamId: "eng",
    },
    {
      fixtureId: "fixture-093",
      matchNumber: 93,
      homeTeamId: "por",
      awayTeamId: "esp",
    },
    {
      fixtureId: "fixture-094",
      matchNumber: 94,
      homeTeamId: "usa",
      awayTeamId: "bel",
    },
    {
      fixtureId: "fixture-095",
      matchNumber: 95,
      homeTeamId: "arg",
      awayTeamId: "egy",
    },
    {
      fixtureId: "fixture-096",
      matchNumber: 96,
      homeTeamId: "sui",
      awayTeamId: "col",
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
