import { getTeamById, getVenueById } from "@/data/wc26";
import type { EffectiveFixture } from "@/lib/wc26-fixture-overlay";
import { sportsEventSchema } from "@/lib/seo/schema";
import { sportsEventStatus } from "@/lib/seo/sports-event-status";
import { absoluteUrl } from "@/lib/site-url";
import { matchHref } from "@/lib/wc26-match";

/** SportsEvent JSON-LD for the homepage featured WC26 match. */
export function buildHomeFeaturedSportsEventSchema(fixture: EffectiveFixture) {
  const home = getTeamById(fixture.homeTeamId);
  const away = getTeamById(fixture.awayTeamId);
  const venue = getVenueById(fixture.venueId);
  const homeName = home?.name ?? fixture.homeTeamId;
  const awayName = away?.name ?? fixture.awayTeamId;

  return sportsEventSchema({
    name: `${homeName} vs ${awayName}`,
    startDate: fixture.kickoffUtc,
    url: absoluteUrl(matchHref(fixture.id)),
    homeTeamName: homeName,
    awayTeamName: awayName,
    venueName: venue?.name,
    eventStatus: sportsEventStatus(String(fixture.status)),
    description: `FIFA World Cup 2026 — ${homeName} vs ${awayName}`,
  });
}