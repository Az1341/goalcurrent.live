"use client";

import { useMemo, useState } from "react";
import JsonLdScript from "@/components/seo/JsonLdScript";
import ApiFootballStatusBanner from "@/components/system/ApiFootballStatusBanner";
import { useLiveScores } from "@/lib/client/useLiveScores";
import { useEffectiveFixtures } from "@/lib/use-effective-fixtures";
import { isLiveMatchStatus, resolveFixtureParticipantLabel } from "@/lib/wc26-live";
import dynamic from "next/dynamic";

const LiveMatchCentre = dynamic(
  () => import("@/components/live/LiveMatchCentre"),
  { ssr: true, loading: () => null },
);

/** Client shell for /live — subscribes to unified WC26 live-scores SWR cache. */
export default function LivePageClient() {
  const { data: liveScores, error } = useLiveScores();
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
        const homeName = resolveFixtureParticipantLabel(fixture, "home", fixtures);
        const awayName = resolveFixtureParticipantLabel(fixture, "away", fixtures);

        return {
          "@type": "BlogPosting",
          headline: `${homeName} vs ${awayName}`,
          datePublished: fixture.kickoffUtc,
        };
      }),
    }),
    [coverageStartTime, fixtures, liveMatches],
  );

  if (!liveScores && !error) {
    return <div>Loading...</div>;
  }

  if (error && !liveScores) {
    return (
      <p className="text-center text-gray-400 py-4">
        Unable to load data. Please try again shortly.
      </p>
    );
  }

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
