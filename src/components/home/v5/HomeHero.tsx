"use client";

import { Link } from "@/i18n/navigation";
import { HOME_HERO_CONFIG } from "@/lib/home/hero-config";
import type { HomepageMatchView } from "@/lib/wc26-live";
import type { PlFixtureRow } from "@/lib/pl/types";
import TeamFlag from "@/components/TeamFlag";
import HomeFeaturedMatchCards from "./HomeLiveMatchCards";
import styles from "../home-v5.module.css";

function MarqueeMatchCard({ match }: { match: HomepageMatchView }) {
  const score =
    match.score != null
      ? `${match.score.home} - ${match.score.away}`
      : "vs";
  const liveLabel =
    match.matchClass === "live" && match.elapsed != null
      ? `LIVE ${match.elapsed}'`
      : match.statusLabel;

  return (
    <div className={styles.heroMarqueeCard}>
      <div className={styles.heroMarqueeTeam}>
        <TeamFlag teamId={match.homeTeamId} teamName={match.homeName} size={32} />
        <span className={styles.heroMarqueeTeamName}>{match.homeName}</span>
      </div>
      <div className={styles.heroMarqueeScore}>
        <span className={styles.heroMarqueeScoreValue}>{score}</span>
        <span className={styles.heroMarqueeLive}>{liveLabel}</span>
      </div>
      <div className={styles.heroMarqueeTeam}>
        <TeamFlag teamId={match.awayTeamId} teamName={match.awayName} size={32} />
        <span className={styles.heroMarqueeTeamName}>{match.awayName}</span>
      </div>
    </div>
  );
}

type HomeHeroProps = {
  featuredMatch?: HomepageMatchView;
  wc26Views: readonly HomepageMatchView[];
  plFixtures: readonly PlFixtureRow[];
};

export default function HomeHero({
  featuredMatch,
  wc26Views,
  plFixtures,
}: HomeHeroProps) {
  const config = HOME_HERO_CONFIG;
  const marquee = config.marquee;

  if (config.variant === "marquee" && marquee) {
    return (
      <section className={styles.heroMarquee} aria-label="Featured match hero">
        <div
          className={styles.heroMarqueeBg}
          style={{ backgroundImage: `url(${marquee.backgroundImage})` }}
          aria-hidden="true"
        />
        <div className={styles.heroMarqueeInner}>
          <div className={styles.heroEyebrow}>
            <span className={styles.heroEyebrowBar} aria-hidden="true" />
            <span>{marquee.eyebrow}</span>
          </div>
          <h1 className={styles.heroHeadline}>
            {marquee.headline}
            {marquee.subheadline ? (
              <>
                <br />
                {marquee.subheadline}
              </>
            ) : null}
          </h1>
          {featuredMatch ? <MarqueeMatchCard match={featuredMatch} /> : null}
          <Link
            href={marquee.ctaHref ?? "/live"}
            className={`${styles.ctaPrimary} ${styles.ctaFullMobile}`}
          >
            {marquee.ctaLabel ?? "View all matches"}
            <span className={styles.ctaArrow} aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.heroDefault} aria-label="Home hero">
      <h1 className={styles.heroHeadline}>
        Live Football.
        <br />
        Every Goal.
        <br />
        Every Moment.
      </h1>
      <HomeFeaturedMatchCards
        wc26Views={wc26Views}
        plFixtures={plFixtures}
        limit={3}
      />
      <Link href="/live" className={`${styles.ctaPrimary} ${styles.ctaFullMobile}`}>
        View all matches
        <span className={styles.ctaArrow} aria-hidden="true">
          →
        </span>
      </Link>
    </section>
  );
}
