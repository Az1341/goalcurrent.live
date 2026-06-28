"use client";

import dynamic from "next/dynamic";
import ApiFootballStatusBanner from "@/components/system/ApiFootballStatusBanner";
import { useLiveScores } from "@/lib/client/useLiveScores";
import { useMatchDetail } from "@/lib/use-match-detail";

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
  const { detail, loading } = useMatchDetail(fixtureId, true);

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
        detail={detail}
        loading={loading}
        detailUnavailable={Boolean(detail.error)}
        scorebatEmbed={scorebatEmbed}
      />
    </>
  );
}
