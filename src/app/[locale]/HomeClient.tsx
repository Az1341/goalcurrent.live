"use client";

import dynamic from "next/dynamic";
import HomeResultsBoard from "@/components/home/v5/HomeResultsBoard";
import type { FootballSnapshot } from "@/lib/free-football/model";
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

export default function HomeClient({ snapshot }: { snapshot: FootballSnapshot }) {

  return (
    <div className={styles.root} data-gc-home-v5>
      <main className={styles.main}>
        <HomeResultsBoard snapshot={snapshot} />
        <HomeLatestNews />
        <HomeTrendingClips />
        <HomeEcosystemPromo />
        <HomeSepanaiVideoAd />
      </main>
    </div>
  );
}
