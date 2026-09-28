import type { Metadata } from "next";
import PlHubClient from "@/components/pl/PlHubClient";
import JsonLdScript from "@/components/seo/JsonLdScript";
import { buildPageMetadata } from "@/lib/page-metadata";
import { fetchPlFixtures, fetchPlStandings } from "@/lib/pl/api";
import { getPlSsotFixtures } from "@/lib/pl/fixtures-ssot";
import type { PlFixtureRow, PlStandingsApiResponse } from "@/lib/pl/types";
import { SITE_NAME, absoluteUrl } from "@/lib/site-url";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    title: "Premier League 2026/27",
    description: `Premier League 2026/27 hub — table, fixtures, clubs and stats on ${SITE_NAME}.`,
    path: "/premier-league",
    locale,
  });
}

export default async function PremierLeagueHubPage() {
  // Sprint-1 P0 (C3): seed the server-rendered snapshot from live API data
  // with the SSOT schedule as fallback, so crawlers and first paint see the
  // current season state (latest result, real table) instead of the frozen
  // June SSOT pre-season snapshot.
  const [fixturesBody, standingsBody] = await Promise.all([
    fetchPlFixtures("en-GB").catch(() => null),
    fetchPlStandings().catch(() => null),
  ]);

  const initialFixtures: PlFixtureRow[] = fixturesBody?.fixtures.length
    ? fixturesBody.fixtures
    : getPlSsotFixtures();

  const initialStandings: PlStandingsApiResponse | undefined =
    standingsBody?.standings.length ? standingsBody : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    name: "Premier League",
    sport: "Football",
    url: absoluteUrl("/premier-league"),
  };

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <PlHubClient
        initialFixtures={initialFixtures}
        initialStandings={initialStandings}
      />
    </>
  );
}
