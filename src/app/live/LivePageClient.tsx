"use client";

import { useMemo, useState } from "react";
import LiveMatchCentre from "@/components/live/LiveMatchCentre";
import JsonLdScript from "@/components/seo/JsonLdScript";
import { getTeamById } from "@/data/wc26";
import { useLiveScores } from "@/lib/client/useLiveScores";
import { useEffectiveFixtures } from "@/lib/use-effective-fixtures";
import { isLiveMatchStatus } from "@/lib/wc26-live";

/** Client shell for /live — subscribes to unified WC26 live-scores SWR cache. */
export default function LivePageClient() {
  useLiveScores();
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
      <LiveMatchCentre />
    </>
  );
}
