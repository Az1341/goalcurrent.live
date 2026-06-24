"use client";

import { useMemo } from "react";
import MatchDetailContent from "@/components/match/MatchDetailContent";
import JsonLdScript from "@/components/seo/JsonLdScript";
import { getFixtureById, getTeamById, getVenueById } from "@/data/wc26";
import { useLiveScores } from "@/lib/client/useLiveScores";
import { useEffectiveFixtures } from "@/lib/use-effective-fixtures";
import { isLiveMatchStatus } from "@/lib/wc26-live";
import { isCompletedMatchStatus } from "@/lib/wc26-tournament-stats";

type MatchPageClientProps = {
  fixtureId: string;
};

function sportsEventStatus(status: string): string {
  const normalized = status.trim().toLowerCase();

  if (isLiveMatchStatus(status)) {
    return "https://schema.org/EventInProgress";
  }

  if (isCompletedMatchStatus(status) || normalized === "ft" || normalized === "finished") {
    return "https://schema.org/EventCompleted";
  }

  if (normalized === "cancelled") {
    return "https://schema.org/EventCancelled";
  }

  if (normalized === "postponed") {
    return "https://schema.org/EventPostponed";
  }

  return "https://schema.org/EventScheduled";
}

/** Client shell — shares unified live-scores SWR cache with scoreboard and overlay sync. */
export default function MatchPageClient({ fixtureId }: MatchPageClientProps) {
  useLiveScores();

  const fixtures = useEffectiveFixtures();
  const fixture =
    fixtures.find((entry) => entry.id === fixtureId) ?? getFixtureById(fixtureId);

  const jsonLd = useMemo(() => {
    if (!fixture) {
      return null;
    }

    const homeTeam = getTeamById(fixture.homeTeamId);
    const awayTeam = getTeamById(fixture.awayTeamId);
    const venue = getVenueById(fixture.venueId);

    if (!homeTeam || !awayTeam) {
      return null;
    }

    return {
      "@context": "https://schema.org",
      "@type": "SportsEvent",
      name: `${homeTeam.name} vs ${awayTeam.name}`,
      startDate: fixture.kickoffUtc,
      location: venue
        ? {
            "@type": "Place",
            name: venue.name,
          }
        : undefined,
      homeTeam: {
        "@type": "SportsTeam",
        name: homeTeam.name,
      },
      awayTeam: {
        "@type": "SportsTeam",
        name: awayTeam.name,
      },
      eventStatus: sportsEventStatus(String(fixture.status)),
      performer: [
        { "@type": "SportsTeam", name: homeTeam.name },
        { "@type": "SportsTeam", name: awayTeam.name },
      ],
    };
  }, [fixture]);

  return (
    <>
      {jsonLd ? <JsonLdScript data={jsonLd} /> : null}
      <MatchDetailContent fixtureId={fixtureId} />
    </>
  );
}
