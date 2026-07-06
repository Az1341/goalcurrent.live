import {
  WC26_CONFIRMED_KNOCKOUT_PAIRINGS,
  type ConfirmedKnockoutPairing,
} from "@/lib/wc26/confirmed-results-ssot";

/** Confirmed R32 fixture with known participants (API-verified home/away order). */
export type { ConfirmedKnockoutPairing };

/**
 * Knockout slots where the actual pairing is confirmed — overrides FIFA feeder
 * template labels (e.g. match 75 is Brazil vs Japan, not NED vs MAR).
 */
export { WC26_CONFIRMED_KNOCKOUT_PAIRINGS };

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
