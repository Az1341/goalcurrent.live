"use client";

import dynamic from "next/dynamic";
import ApiFootballStatusBanner from "@/components/system/ApiFootballStatusBanner";
import { getFixtureById } from "@/data/wc26";
import { useLiveScores } from "@/lib/client/useLiveScores";
import { useMatchDetail } from "@/lib/use-match-detail";
import { useEffectiveFixtures } from "@/lib/use-effective-fixtures";
import { isLiveMatchStatus } from "@/lib/wc26-live";

const MatchDetailContent = dynamic(
  () => import("@/components/match/MatchDetailContent"),
  { ssr: true, loading: () => null },
);

type MatchPageClientProps = {
  fixtureId: string;
  scorebatEmbed?: string | null;
};

/** Client shell — shares unified live-scores SWR cache with scoreboard and overlay sync. */
export default function MatchPageClient({
  fixtureId,
  scorebatEmbed = null,
}: MatchPageClientProps) {
  useLiveScores();

  const fixtures = useEffectiveFixtures();
  const fixture =
    fixtures.find((entry) => entry.id === fixtureId) ?? getFixtureById(fixtureId);
  const { detail } = useMatchDetail(
    fixtureId,
    fixture ? isLiveMatchStatus(fixture.status) : false,
  );

  return (
    <>
      <ApiFootballStatusBanner
        errorCode={detail.error}
        message={
          detail.error
            ? detail.message ?? "Detailed live data is temporarily unavailable."
            : undefined
        }
        fetchedAt={detail.stale ? detail.fetchedAt : undefined}
      />
      <MatchDetailContent
        fixtureId={fixtureId}
        detailUnavailable={Boolean(detail.error)}
        scorebatEmbed={scorebatEmbed}
      />
    </>
  );
}
