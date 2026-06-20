import type { Metadata } from "next";
import { PlAdSlot } from "@/components/pl/PlCommercialStrip";
import PlMatchClient from "@/components/pl/PlMatchClient";
import { fetchPlMatchDetail } from "@/lib/pl/match-detail";
import { buildPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site-url";

type PlMatchPageProps = {
  params: Promise<{ fixtureId: string }>;
};

function parseFixtureId(raw: string): number | null {
  const id = Number.parseInt(decodeURIComponent(raw), 10);
  if (!Number.isFinite(id) || id <= 0) return null;
  return id;
}

export async function generateMetadata({
  params,
}: PlMatchPageProps): Promise<Metadata> {
  const fixtureId = parseFixtureId((await params).fixtureId);
  if (fixtureId === null) {
    return { title: "Match not found" };
  }

  const detail = await fetchPlMatchDetail(fixtureId);
  const fixture = detail.fixture;

  if (!fixture) {
    return buildPageMetadata({
      title: "Premier League Match",
      description: `Premier League match centre on ${SITE_NAME}.`,
      path: `/premier-league/match/${fixtureId}`,
    });
  }

  const title = `${fixture.homeTeamName} vs ${fixture.awayTeamName}`;

  return buildPageMetadata({
    title,
    description: `${title} — Premier League 2026/27 match centre with timeline, lineups, stats and H2H on ${SITE_NAME}.`,
    path: `/premier-league/match/${fixtureId}`,
  });
}

export default async function PremierLeagueMatchPage({
  params,
}: PlMatchPageProps) {
  const fixtureId = parseFixtureId((await params).fixtureId) ?? 0;

  return (
    <>
      <PlAdSlot slot="8901234567" />
      <PlMatchClient fixtureId={fixtureId} />
    </>
  );
}
