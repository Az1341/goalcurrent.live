import { getTeamById, getVenueById } from "@/data/wc26";
import type { EffectiveFixture } from "@/lib/wc26-fixture-overlay";
import { sportsEventSchema } from "@/lib/seo/schema";
import { sportsEventStatus } from "@/lib/seo/sports-event-status";
import { matchHref } from "@/lib/wc26-match";

/** SportsEvent JSON-LD for the homepage featured WC26 match. */
export function buildHomeFeaturedSportsEventSchema(
  fixture: EffectiveFixture,
  locale: string,
) {
  const home = getTeamById(fixture.homeTeamId);
  const away = getTeamById(fixture.awayTeamId);
  const venue = getVenueById(fixture.venueId);
  const homeName = home?.name ?? fixture.homeTeamId;
  const awayName = away?.name ?? fixture.awayTeamId;

  return sportsEventSchema({
    name: `${homeName} vs ${awayName}`,
    startDate: fixture.kickoffUtc,
    path: matchHref(fixture.id),
    locale,
    homeTeamName: homeName,
    awayTeamName: awayName,
    venueName: venue?.name,
    country: venue?.country,
    competition: "FIFA World Cup 2026",
    eventStatus: sportsEventStatus(String(fixture.status)),
    description: `FIFA World Cup 2026 — ${homeName} vs ${awayName}`,
  });
}