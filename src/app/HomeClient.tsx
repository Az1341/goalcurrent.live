"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useTournamentStats } from "@/lib/use-tournament-stats";
import { useEffectiveFixtures } from "@/lib/use-effective-fixtures";
import { useLiveScores } from "@/lib/use-live-scores";
import {
  buildHomepageMatchView,
  isLiveMatchStatus,
  selectFeaturedFixture,
  selectHomepageFixtures,
  selectUpcomingHomepageFixtures,
  type HomepageMatchClass,
  type HomepageMatchView,
} from "@/lib/wc26-live";
import type { EffectiveFixture } from "@/lib/wc26-fixture-overlay";
import TeamFlag from "@/components/TeamFlag";
import { FavouriteMatchButton } from "@/components/FavouriteButton";
import { matchHref } from "@/lib/wc26-match";
import { SITE_NAME } from "@/lib/site-url";
import AdSenseUnit from "@/components/AdSenseUnit";
import { ADSENSE_SLOTS } from "@/lib/adsense-slots";
import LiveRibbon from "@/components/layout/LiveRibbon";
import HomeArticlesSection from "@/components/home/HomeArticlesSection";
import HomeFavouritesStrip from "@/components/home/HomeFavouritesStrip";
import HomeNewsSection from "@/components/home/HomeNewsSection";
import HomePlSection from "@/components/home/HomePlSection";
import HomeWc26StandingsPreview from "@/components/home/HomeWc26StandingsPreview";
import styles from "@/app/page.module.css";

const FEATURED_FLAG = 64;
const LIST_FLAG = 22;

function formatScore(match: HomepageMatchView) {
  if (!match.score) return null;
  return `${match.score.home}–${match.score.away}`;
}

function normalizeStatus(status: string) {
  return status.trim().toLowerCase();
}

function formatHalfIndicator(fixture: EffectiveFixture): string | null {
  if (!isLiveMatchStatus(fixture.status)) return null;
  const status = normalizeStatus(String(fixture.status));
  if (status === "ht" || status === "halftime" || status === "half-time") {
    return "HT";
  }
  if (status === "2h") return "2nd H";
  if (status === "1h") return "1st H";
  if (fixture.elapsed != null) {
    return fixture.elapsed > 45 ? "2nd H" : "1st H";
  }
  return "1st H";
}

function statusPillClass(status: HomepageMatchClass) {
  if (status === "live") return styles.statusLive;
  if (status === "ft") return styles.statusFinished;
  return styles.statusUpcoming;
}

function FeaturedStatusBadge({ match }: { match: HomepageMatchView }) {
  const isLive = match.matchClass === "live";
  return (
    <span className={`${styles.statusPill} ${statusPillClass(match.matchClass)}`}>
      {isLive ? <span className={styles.liveDot} aria-hidden="true" /> : null}
      {match.statusLabel}
    </span>
  );
}

function FeaturedMatchHero({ match }: { match: HomepageMatchView }) {
  const score = formatScore(match);
  const isLive = match.matchClass === "live";

  return (
    <article className={styles.featuredHero}>
      <div className={styles.featuredHeroTop}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span className={styles.featuredHeroLabel}>Featured match</span>
          <FeaturedStatusBadge match={match} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className={styles.featuredHeroRound}>{match.roundLabel}</span>
          <FavouriteMatchButton
            matchId={match.fixtureId}
            label={`${match.homeName} vs ${match.awayName}`}
            className={styles.favBtnOnDark}
          />
        </div>
      </div>

      <div className={styles.featuredHeroBody}>
        <div className={styles.featuredRow}>
          <div className={`${styles.featuredSide} ${styles.featuredSideHome}`}>
            <TeamFlag teamId={match.homeTeamId} size={FEATURED_FLAG} />
            <span className={styles.featuredTeamName}>{match.homeName}</span>
          </div>

          <div className={styles.featuredScorebox}>
            <div className={styles.featuredScore}>
              {score ?? <span className={styles.featuredVs}>vs</span>}
            </div>
            {isLive && match.elapsed != null && (
              <div className={styles.minLive}>{match.elapsed}&apos;</div>
            )}
          </div>

          <div className={`${styles.featuredSide} ${styles.featuredSideAway}`}>
            <span className={styles.featuredTeamName}>{match.awayName}</span>
            <TeamFlag teamId={match.awayTeamId} size={FEATURED_FLAG} />
          </div>
        </div>

        <p className={styles.featuredMeta}>
          {match.kickoffLabel}
          {match.venueLabel ? ` · ${match.venueLabel}` : ""}
        </p>

        <div className={styles.featuredActions}>
          <Link href={matchHref(match.fixtureId)} className={styles.btnPrimary}>
            Match details →
          </Link>
          <Link href="/worldcup2026/fixtures" className={styles.btnSecondary}>
            All fixtures
          </Link>
        </div>
      </div>
    </article>
  );
}

function CompactMatchList({
  matches,
  showHalf,
  fixtureById,
}: {
  matches: readonly HomepageMatchView[];
  showHalf: boolean;
  fixtureById: Map<string, EffectiveFixture>;
}) {
  if (matches.length === 0) {
    return null;
  }

  return (
    <ul className={styles.compactList}>
      {matches.map((match) => {
        const score = formatScore(match);
        const fixture = fixtureById.get(match.fixtureId);
        const half = fixture ? formatHalfIndicator(fixture) : null;
        const isLive = match.matchClass === "live";

        return (
          <li key={match.fixtureId}>
            <Link href={matchHref(match.fixtureId)} className={styles.compactRow}>
              <TeamFlag teamId={match.homeTeamId} size={LIST_FLAG} />
              <span className={styles.compactTeam}>{match.homeName}</span>
              <span
                className={`${styles.compactScore} ${isLive ? styles.compactScoreLive : ""}`}
              >
                {score ?? "–"}
              </span>
              <span className={styles.compactTeam}>{match.awayName}</span>
              <TeamFlag teamId={match.awayTeamId} size={LIST_FLAG} />
              <span className={styles.compactMeta}>
                {showHalf && half
                  ? half
                  : match.matchClass === "ft"
                    ? "FT"
                    : match.statusLabel}
                {isLive && match.elapsed != null ? ` · ${match.elapsed}'` : ""}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function ColumnCard({
  title,
  children,
  footerHref,
  footerLabel,
  emptyMessage,
  isEmpty,
}: {
  title: string;
  children: ReactNode;
  footerHref: string;
  footerLabel: string;
  emptyMessage: string;
  isEmpty: boolean;
}) {
  return (
    <section className={styles.columnCard}>
      <h2 className={styles.columnCardTitle}>{title}</h2>
      <div className={styles.columnCardBody}>
        {isEmpty ? <p className={styles.columnEmpty}>{emptyMessage}</p> : children}
      </div>
      <Link href={footerHref} className={styles.columnCardFooter}>
        {footerLabel} →
      </Link>
    </section>
  );
}

export default function Home() {
  useLiveScores();
  const fixtures = useEffectiveFixtures();
  const fixtureById = new Map(fixtures.map((f) => [f.id, f]));
  const featuredFixture = selectFeaturedFixture(fixtures);
  const featured = featuredFixture
    ? buildHomepageMatchView(featuredFixture)
    : undefined;

  const pool = selectHomepageFixtures(fixtures, featured?.fixtureId, 16);
  const liveMatches = fixtures
    .filter((f) => isLiveMatchStatus(f.status))
    .map(buildHomepageMatchView)
    .slice(0, 4);
  const latestResults = pool.filter((m) => m.matchClass === "ft").slice(0, 4);
  const upcomingMatches = selectUpcomingHomepageFixtures(
    fixtures,
    featured?.fixtureId,
    6,
  );

  const { gamesPlayed, gamesLeft } = useTournamentStats();

  return (
    <div className={styles.homeRoot}>
      <main className={styles.homeMain}>
        <header className={styles.homeHero}>
          <div className={styles.homeHeroBg} aria-hidden="true" />
          <div className={styles.homeHeroContent}>
            <h1>Football live scores &amp; match centre</h1>
            <p>
              Live results, fixtures and news from {SITE_NAME} — World Cup 2026
              is the lead competition.
            </p>
            <span className={styles.homeBadge}>World Cup 2026 · lead competition</span>
          </div>
        </header>

        <section className={styles.sectionBlock} aria-labelledby="featured-match-heading">
          <h2 id="featured-match-heading" className={styles.sectionTitle}>
            Featured match
          </h2>
          {featured ? (
            <FeaturedMatchHero match={featured} />
          ) : (
            <p className={styles.sectionNote}>No World Cup fixtures loaded.</p>
          )}
        </section>

        <HomeFavouritesStrip />

        <div className={styles.homeTickerWrap}>
          <LiveRibbon embedded />
        </div>

        <div className={styles.threeCol}>
          <ColumnCard
            title="Live Now"
            footerHref="/live"
            footerLabel="View All Live Matches"
            emptyMessage="No live matches right now."
            isEmpty={liveMatches.length === 0}
          >
            <CompactMatchList
              matches={liveMatches}
              showHalf
              fixtureById={fixtureById}
            />
          </ColumnCard>

          <ColumnCard
            title="Latest Results"
            footerHref="/live"
            footerLabel="View All Results"
            emptyMessage="No recent full-time results."
            isEmpty={latestResults.length === 0}
          >
            <CompactMatchList
              matches={latestResults}
              showHalf={false}
              fixtureById={fixtureById}
            />
          </ColumnCard>

          <ColumnCard
            title="Upcoming Fixtures"
            footerHref="/worldcup2026/fixtures"
            footerLabel="View All Fixtures"
            emptyMessage="No upcoming fixtures scheduled."
            isEmpty={upcomingMatches.length === 0}
          >
            <CompactMatchList
              matches={upcomingMatches}
              showHalf={false}
              fixtureById={fixtureById}
            />
          </ColumnCard>
        </div>

        <HomeWc26StandingsPreview />

        <HomePlSection />

        <div className={styles.sectionBlock}>
          <AdSenseUnit slot={ADSENSE_SLOTS.homeMid} className={styles.adUnit} />
        </div>

        <section className={styles.sectionBlock} aria-labelledby="wc26-heading">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleRow}>
              <span className={styles.sectionBar} aria-hidden="true" />
              <h2 id="wc26-heading" className={styles.sectionTitle}>
                World Cup 2026
              </h2>
            </div>
            <Link href="/worldcup2026" className={styles.sectionLink}>
              View All →
            </Link>
          </div>
          <p className={styles.wc26Summary}>
            USA · Mexico · Canada · 11 Jun – 19 Jul 2026 ·{" "}
            <strong>{gamesPlayed}</strong> played · <strong>{gamesLeft}</strong>{" "}
            remaining
          </p>
        </section>

        <HomeNewsSection />

        <HomeArticlesSection />

        <div className={styles.sectionBlock}>
          <AdSenseUnit slot={ADSENSE_SLOTS.homeLower} className={styles.adUnit} />
        </div>
      </main>
    </div>
  );
}
