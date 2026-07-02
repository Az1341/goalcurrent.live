import { getVenueById } from "@/data/wc26";
import type { EffectiveFixture } from "@/lib/wc26-fixture-overlay";
import { resolveFixtureParticipantLabel } from "@/lib/wc26-live";
import { matchHref } from "@/lib/wc26-match";
import { getSeoEffectiveFixtures } from "@/lib/wc26/seo-fixtures";
import { sportsEventSchema } from "@/lib/seo/schema";
import { sportsEventStatus } from "@/lib/seo/sports-event-status";
import { absoluteUrl, SITE_NAME } from "@/lib/site-url";

/** SportsEvent JSON-LD for the homepage featured WC26 match. */
export function buildHomeFeaturedSportsEventSchema(
  fixture: EffectiveFixture,
  locale: string,
) {
  const seoFixtures = getSeoEffectiveFixtures();
  const homeName = resolveFixtureParticipantLabel(fixture, "home", seoFixtures);
  const awayName = resolveFixtureParticipantLabel(fixture, "away", seoFixtures);
  const venue = getVenueById(fixture.venueId);

  return sportsEventSchema({
    name: `${homeName} vs ${awayName}`,
    startDate: fixture.kickoffUtc,
    path: matchHref(fixture.id),
    locale,
    homeTeamName: homeName,
    awayTeamName: awayName,
    venueName: venue?.name,
    city: venue?.city,
    country: venue?.country,
    competition: "FIFA World Cup 2026",
    organizerUrl:
      "https://www.fifa.com/fifaplus/en/tournaments/mens/worldcup/canadamexicousa2026",
    eventStatus: sportsEventStatus(String(fixture.status)),
    description: `FIFA World Cup 2026 — ${homeName} vs ${awayName}. Live scores on ${SITE_NAME}.`,
    image: absoluteUrl("/icons/screenshot-desktop.png"),
  });
}
