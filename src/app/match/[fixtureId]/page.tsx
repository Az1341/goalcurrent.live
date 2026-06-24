import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MatchPageClient from "@/app/match/[fixtureId]/MatchPageClient";
import ErrorBoundary from "@/components/system/ErrorBoundary";
import { WC26_FIXTURES, getFixtureById, getTeamById } from "@/data/wc26";
import { isKnownFixtureId, matchHref } from "@/lib/wc26-match";
import { buildPageMetadata } from "@/lib/page-metadata";
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

  return {
    ...buildPageMetadata({
      title,
      description: `World Cup 2026 match — ${title}. Live centre, timeline, statistics and lineups on ${SITE_NAME}.`,
      path: matchHref(fixtureId),
    }),
    openGraph: {
      title,
      description: `World Cup 2026 match — ${title}. Live centre, timeline, statistics and lineups on ${SITE_NAME}.`,
      url: absoluteUrl(matchHref(fixtureId)),
      images: [
        {
          url: absoluteUrl("/icons/screenshot-desktop.png"),
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export default async function MatchPage({ params }: MatchPageProps) {
  const { fixtureId: rawId } = await params;
  const fixtureId = decodeURIComponent(rawId);

  if (!isKnownFixtureId(fixtureId)) {
    notFound();
  }

  const scorebatEmbed = await getScoreBatEmbedForFixture(fixtureId);

  return (
    <ErrorBoundary>
      <MatchPageClient fixtureId={fixtureId} scorebatEmbed={scorebatEmbed} />
    </ErrorBoundary>
  );
}
