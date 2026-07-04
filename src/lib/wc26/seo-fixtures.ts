import { getFixtureById, WC26_FIXTURES } from "@/data/wc26";
import { isKnockoutPlaceholderTeam } from "@/data/wc26/knockout-fixtures";
import { applyAllConfirmedResults } from "@/lib/wc26/confirmed-results";
import type { EffectiveFixture } from "@/lib/wc26-fixture-overlay";

/** WC26 fixtures with confirmed knockout pairings — for SSR metadata and JSON-LD. */
export function getSeoEffectiveFixtures(): readonly EffectiveFixture[] {
  return applyAllConfirmedResults(WC26_FIXTURES);
}

/** Merge live overlay scores onto SEO fixtures so names stay resolved during live play. */
export function mergeFavouriteMatchFixture(
  matchId: string,
  overlayFixtures: readonly EffectiveFixture[],
): EffectiveFixture | undefined {
  const staticFixture = getFixtureById(matchId);
  const seoFixture = getSeoEffectiveFixtures().find((entry) => entry.id === matchId);
  const overlay = overlayFixtures.find((entry) => entry.id === matchId);

  if (!staticFixture && !seoFixture && !overlay) {
    return undefined;
  }

  const base: EffectiveFixture | undefined =
    seoFixture ??
    overlay ??
    (staticFixture as EffectiveFixture | undefined);
  if (!base || !overlay) {
    return base;
  }

  return {
    ...base,
    ...overlay,
    overlayHomeTeamId:
      overlay.overlayHomeTeamId &&
      !isKnockoutPlaceholderTeam(overlay.overlayHomeTeamId)
        ? overlay.overlayHomeTeamId
        : base.overlayHomeTeamId,
    overlayAwayTeamId:
      overlay.overlayAwayTeamId &&
      !isKnockoutPlaceholderTeam(overlay.overlayAwayTeamId)
        ? overlay.overlayAwayTeamId
        : base.overlayAwayTeamId,
  };
}