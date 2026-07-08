"use client";

import useSWR from "swr";
import { useMemo } from "react";
import { useEffectiveFixtures } from "@/lib/use-effective-fixtures";
import {
  buildHomepageMatchView,
  selectFeaturedFixtures,
  selectHomepageFixtures,
} from "@/lib/wc26-live";
import { fetcher, LIVE_SWR_OPTIONS } from "@/lib/client/fetcher";
import type { PlFixturesApiResponse } from "@/lib/pl/types";
import LiveRibbon from "@/components/layout/LiveRibbon";
import HomeHero from "@/components/home/v5/HomeHero";
import HomeTodaysMatches from "@/components/home/v5/HomeTodaysMatches";
import HomeLatestNews from "@/components/home/v5/HomeLatestNews";
import HomeTrendingClips from "@/components/home/v5/HomeTrendingClips";
import HomeTeamsLeagues from "@/components/home/v5/HomeTeamsLeagues";
import styles from "@/components/home/home-v5.module.css";

export default function HomeClient() {
  const fixtures = useEffectiveFixtures();
  const featuredSelection = selectFeaturedFixtures(fixtures);
  const featuredMatch = featuredSelection.fixtures[0]
    ? buildHomepageMatchView(featuredSelection.fixtures[0], fixtures)
    : undefined;

  const { data: plData } = useSWR<PlFixturesApiResponse>(
    "/api/pl/fixtures",
    fetcher,
    LIVE_SWR_OPTIONS,
  );

  const heroWc26Views = useMemo(
    () => selectHomepageFixtures(fixtures, [], 3),
    [fixtures],
  );

  const plFixtures = plData?.fixtures ?? [];

  return (
    <div className={styles.root} data-gc-home-v5>
      <div className={styles.tickerWrap}>
        <LiveRibbon embedded variant="v5" />
      </div>

      <main className={styles.main}>
        <HomeHero
          featuredMatch={featuredMatch}
          wc26Views={heroWc26Views}
          plFixtures={plFixtures}
        />
        <HomeTodaysMatches fixtures={fixtures} />
        <HomeLatestNews />
        <HomeTrendingClips />
        <HomeTeamsLeagues fixtures={fixtures} />
      </main>
    </div>
  );
}
