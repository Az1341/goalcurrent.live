import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MatchPageClient from "@/app/[locale]/match/[fixtureId]/MatchPageClient";
import MatchSeo from "@/components/seo/MatchSeo";
import ErrorBoundary from "@/components/system/ErrorBoundary";
import { WC26_FIXTURES, getFixtureById, getTeamById, getVenueById } from "@/data/wc26";
import { isKnownFixtureId, matchHref } from "@/lib/wc26-match";
import { buildMatchMetadata } from "@/lib/page-metadata";
import { sportsEventStatus } from "@/lib/seo/sports-event-status";
import { getScoreBatEmbedForFixture } from "@/lib/scorebat/getScoreBatEmbed";
import { absoluteUrl, SITE_NAME } from "@/lib/site-url";

type MatchPageProps = {
  params: Promise<{ fixtureId: string }>;
};

export function generateStaticParams() {
  return WC26_FIXTURES.map((fixture) => ({
    fixtureId: fixture.id,
  }));
}

export async function generateMetadata({ params }: MatchPageProps): Promise<Metadata> {
  const { fixtureId: rawId } = await params;
  const fixtureId = decodeURIComponent(rawId);
  const fixture = getFixtureById(fixtureId);

  if (!fixture) {
    return { title: "Match not found" };
  }

  const home = getTeamById(fixture.homeTeamId);
  const away = getTeamById(fixture.awayTeamId);
  const title = `${home?.name ?? fixture.homeTeamId} vs ${away?.name ?? fixture.awayTeamId}`;

  return buildMatchMetadata({
    title,
    description: `World Cup 2026 match — ${title}. Live centre, timeline, statistics and lineups on ${SITE_NAME}.`,
    path: matchHref(fixtureId),
    ogImage: absoluteUrl("/icons/screenshot-desktop.png"),
  });
}

export default async function MatchPage({ params }: MatchPageProps) {
  const { fixtureId: rawId } = await params;
  const fixtureId = decodeURIComponent(rawId);

  if (!isKnownFixtureId(fixtureId)) {
    notFound();
  }

  const fixture = getFixtureById(fixtureId)!;
  const home = getTeamById(fixture.homeTeamId)!;
  const away = getTeamById(fixture.awayTeamId)!;
  const venue = getVenueById(fixture.venueId);
  const scorebatEmbed = await getScoreBatEmbedForFixture(fixtureId);

  return (
    <ErrorBoundary>
      <MatchSeo
        event={{
          name: `${home.name} vs ${away.name}`,
          startDate: fixture.kickoffUtc,
          path: matchHref(fixtureId),
          homeTeamName: home.name,
          awayTeamName: away.name,
          venueName: venue?.name,
          country: venue?.country,
          competition: "FIFA World Cup 2026",
          eventStatus: sportsEventStatus(String(fixture.status)),
          description: `FIFA World Cup 2026 — ${home.name} vs ${away.name}`,
        }}
        breadcrumbs={[
          { name: "World Cup 2026", path: "/worldcup2026" },
          { name: "Fixtures", path: "/worldcup2026/fixtures" },
          { name: `${home.name} vs ${away.name}`, path: matchHref(fixtureId) },
        ]}
      />
      <MatchPageClient fixtureId={fixtureId} scorebatEmbed={scorebatEmbed} />
    </ErrorBoundary>
  );
}
