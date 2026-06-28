import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MatchPageClient from "@/app/[locale]/match/[fixtureId]/MatchPageClient";
import { WC26_FIXTURES, getFixtureById } from "@/data/wc26";
import { isKnownFixtureId } from "@/lib/wc26-match";
import { resolveFixtureParticipantLabel } from "@/lib/wc26-live";
import { buildPageMetadata } from "@/lib/page-metadata";
import { getScoreBatEmbedForFixture } from "@/lib/scorebat/getScoreBatEmbed";
import { absoluteUrl, SITE_NAME } from "@/lib/site-url";

type Wc26MatchPageProps = {
  params: Promise<{ fixtureId: string }>;
};

export function generateStaticParams() {
  return WC26_FIXTURES.map((fixture) => ({
    fixtureId: fixture.id,
  }));
}

function wc26MatchPath(fixtureId: string): string {
  return `/worldcup2026/match/${encodeURIComponent(fixtureId)}`;
}

export async function generateMetadata({
  params,
}: Wc26MatchPageProps): Promise<Metadata> {
  const { fixtureId: rawId } = await params;
  const fixtureId = decodeURIComponent(rawId);
  const fixture = getFixtureById(fixtureId);

  if (!fixture) {
    return { title: "Match not found" };
  }

  const homeName = resolveFixtureParticipantLabel(fixture, "home", WC26_FIXTURES);
  const awayName = resolveFixtureParticipantLabel(fixture, "away", WC26_FIXTURES);
  const title = `${homeName} vs ${awayName}`;

  return {
    ...buildPageMetadata({
      title,
      description: `World Cup 2026 match — ${title}. Live centre, timeline, statistics and lineups on ${SITE_NAME}.`,
      path: wc26MatchPath(fixtureId),
    }),
    openGraph: {
      title,
      description: `World Cup 2026 match — ${title}. Live centre, timeline, statistics and lineups on ${SITE_NAME}.`,
      url: absoluteUrl(wc26MatchPath(fixtureId)),
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

export default async function Wc26MatchPage({ params }: Wc26MatchPageProps) {
  const { fixtureId: rawId } = await params;
  const fixtureId = decodeURIComponent(rawId);

  if (!isKnownFixtureId(fixtureId)) {
    notFound();
  }

  const scorebatEmbed = await getScoreBatEmbedForFixture(fixtureId);

  return <MatchPageClient fixtureId={fixtureId} scorebatEmbed={scorebatEmbed} />;
}
