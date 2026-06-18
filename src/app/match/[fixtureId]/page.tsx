import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MatchDetailContent from "@/components/match/MatchDetailContent";
import { WC26_FIXTURES, getFixtureById, getTeamById } from "@/data/wc26";
import { isKnownFixtureId, matchHref } from "@/lib/wc26-match";
import { buildPageMetadata } from "@/lib/page-metadata";

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

  return buildPageMetadata({
    title,
    description: `World Cup 2026 match — ${title}. Live centre, timeline, statistics and lineups on GoalCurrent.online.`,
    path: matchHref(fixtureId),
  });
}

export default async function MatchPage({ params }: MatchPageProps) {
  const { fixtureId: rawId } = await params;
  const fixtureId = decodeURIComponent(rawId);

  if (!isKnownFixtureId(fixtureId)) {
    notFound();
  }

  return <MatchDetailContent fixtureId={fixtureId} />;
}
