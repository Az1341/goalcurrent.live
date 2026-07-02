import { WC26_FIXTURES } from "@/data/wc26";
import { applyConfirmedKnockoutResults } from "@/lib/wc26/knockout-confirmed-results";
import type { EffectiveFixture } from "@/lib/wc26-fixture-overlay";

/** WC26 fixtures with confirmed knockout pairings — for SSR metadata and JSON-LD. */
export function getSeoEffectiveFixtures(): readonly EffectiveFixture[] {
  return applyConfirmedKnockoutResults(WC26_FIXTURES);
}
