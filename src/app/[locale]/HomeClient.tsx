"use client";

import dynamic from "next/dynamic";
import { useHomeMatchdayFixtures } from "@/lib/client/useHomeMatchdayFixtures";
import HomeHero from "@/components/home/v5/HomeHero";
import HomePlKickoffCountdown from "@/components/home/v5/HomePlKickoffCountdown";
import HomeCommunityShieldNews from "@/components/home/v5/HomeCommunityShieldNews";
import HomeEcosystemPromo from "@/components/home/v5/HomeEcosystemPromo";
import HomeSepanaiVideoAd from "@/components/home/v5/HomeSepanaiVideoAd";
import styles from "@/components/home/home-v5.module.css";

const HomeTodaysMatches = dynamic(
  () => import("@/components/home/v5/HomeTodaysMatches"),
  { loading: () => <div className={`${styles.skeleton} animate-skeleton-shimmer`} /> },
);

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
  const matchday = useHomeMatchdayFixtures();
  const plFixtures = matchday.plFixtures;
  const plLoading = matchday.feeds.pl.isLoading;

  return (
    <div className={styles.root} data-gc-home-v5>
      <main className={styles.main}>
        <HomeHero featuredMatch={undefined} wc26Views={[]} plFixtures={plFixtures} matchdayCards={matchday.cards} />
        <HomeTodaysMatches
          cards={matchday.cards}
          loading={matchday.allLoadingEmpty}
          anyError={matchday.anyError}
          anyStale={matchday.anyStale}
          fetchedAt={matchday.earliestFetchedAt}
          feedErrors={{
            pl: matchday.feeds.pl.error,
            ucl: matchday.feeds.ucl.error,
            facup: matchday.feeds.facup.error,
            unl: matchday.feeds.unl.error,
          }}
        />
        <HomePlKickoffCountdown
          plFixtures={plFixtures}
          loading={plLoading && plFixtures.length === 0}
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
