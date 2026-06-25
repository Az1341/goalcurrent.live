"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import JsonLdScript from "@/components/seo/JsonLdScript";
import ApiFootballStatusBanner from "@/components/system/ApiFootballStatusBanner";
import { getTeamById } from "@/data/wc26";
import { useLiveScores } from "@/lib/client/useLiveScores";
import { useEffectiveFixtures } from "@/lib/use-effective-fixtures";
import { isLiveMatchStatus } from "@/lib/wc26-live";

const LiveMatchCentre = dynamic(
  () => import("@/components/live/LiveMatchCentre"),
  { ssr: true, loading: () => null },
);

/** Client shell for /live — subscribes to unified WC26 live-scores SWR cache. */
export default function LivePageClient() {
  const { data: liveScores } = useLiveScores();
  const fixtures = useEffectiveFixtures();
  const [coverageStartTime] = useState(() => new Date().toISOString());

  const liveMatches = useMemo(
    () => fixtures.filter((fixture) => isLiveMatchStatus(fixture.status)),
    [fixtures],
  );

  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "LiveBlogPosting",
      headline: "Live Football Scores",
      coverageStartTime,
      liveBlogUpdate: liveMatches.map((fixture) => {
        const homeTeam = getTeamById(fixture.homeTeamId);
        const awayTeam = getTeamById(fixture.awayTeamId);

        return {
          "@type": "BlogPosting",
          headline: `${homeTeam?.name ?? fixture.homeTeamId} vs ${awayTeam?.name ?? fixture.awayTeamId}`,
          datePublished: fixture.kickoffUtc,
        };
      }),
    }),
    [coverageStartTime, liveMatches],
  );

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <ApiFootballStatusBanner
        errorCode={liveScores?.error}
        message={liveScores?.message}
        fetchedAt={liveScores?.stale ? liveScores.fetchedAt : undefined}
      />
      <LiveMatchCentre />
    </>
  );
}
