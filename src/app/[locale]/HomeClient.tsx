"use client";

import dynamic from "next/dynamic";
import { useNow } from "next-intl";
import { useLiveFixtures } from "@/lib/client/useLiveFixtures";
import { LIVE_API_PATHS, useLiveApi } from "@/lib/client/live-data";
import type { MatchdayData, MatchdaySource } from "@/lib/home/matchday";
import HomeTodaysMatches from "@/components/home/v5/HomeTodaysMatches";
import HomeHero from "@/components/home/v5/HomeHero";
import HomePlKickoffCountdown from "@/components/home/v5/HomePlKickoffCountdown";
import HomeCommunityShieldNews from "@/components/home/v5/HomeCommunityShieldNews";
import HomeEcosystemPromo from "@/components/home/v5/HomeEcosystemPromo";
import HomeSepanaiVideoAd from "@/components/home/v5/HomeSepanaiVideoAd";
import styles from "@/components/home/home-v5.module.css";

const HomeLatestNews = dynamic(
  () => import("@/components/home/v5/HomeLatestNews"),
  { loading: () => <div className={`${styles.skeleton} animate-skeleton-shimmer`} /> },
);

const HomeTrendingClips = dynamic(
  () => import("@/components/home/v5/HomeTrendingClips"),
  {
    ssr: false,
    loading: () => <div className={`${styles.skeleton} animate-skeleton-shimmer`} />,
  },
);

const HomeTeamsLeagues = dynamic(
  () => import("@/components/home/v5/HomeTeamsLeagues"),
  { loading: () => <div className={`${styles.skeleton} animate-skeleton-shimmer`} /> },
);

export default function HomeClient() {
  const pl = useLiveFixtures();
  const ucl = useLiveApi<MatchdayData>(LIVE_API_PATHS.uclFixtures);
  const facup = useLiveApi<MatchdayData>(LIVE_API_PATHS.facupFixtures);
  const unl = useLiveApi<MatchdayData>(LIVE_API_PATHS.unlFixtures);
  const now = useNow({ updateInterval: 30_000 });
  const { data: plData, isLoading: plLoading } = pl;
  const plFixtures = plData?.fixtures ?? [];
  const sources: MatchdaySource[] = [
    { key: "pl", data: pl.data, loading: pl.isLoading, failed: Boolean(pl.error) },
    { key: "ucl", data: ucl.data, loading: ucl.isLoading, failed: Boolean(ucl.error) },
    { key: "facup", data: facup.data, loading: facup.isLoading, failed: Boolean(facup.error) },
    { key: "unl", data: unl.data, loading: unl.isLoading, failed: Boolean(unl.error) },
  ];

  return (
    <div className={styles.root} data-gc-home-v5>
      <main className={styles.main}>
        <HomeHero compact featuredMatch={undefined} wc26Views={[]} plFixtures={plFixtures} />
        <HomeTodaysMatches sources={sources} now={now} />
        <HomePlKickoffCountdown
          plFixtures={plFixtures}
          loading={plLoading && !plData}
        />
        <HomeEcosystemPromo />
        <HomeSepanaiVideoAd />
        <HomeCommunityShieldNews />
        <HomeLatestNews />
        <HomeTrendingClips />
        <HomeTeamsLeagues plFixtures={plFixtures} />
      </main>
    </div>
  );
}
