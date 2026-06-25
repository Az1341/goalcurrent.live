"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  useLocalizedKickoffLabel,
  useLocalizedKickoffTime,
} from "@/lib/client/use-local-kickoff";
import { useTournamentStats } from "@/lib/use-tournament-stats";
import { useEffectiveFixtures } from "@/lib/use-effective-fixtures";
import {
  buildHomepageMatchView,
  isLiveMatchStatus,
  selectFeaturedFixtures,
  selectHomepageFixtures,
  selectUpcomingHomepageFixtures,
  type HomepageMatchClass,
  type HomepageMatchView,
} from "@/lib/wc26-live";
import type { EffectiveFixture } from "@/lib/wc26-fixture-overlay";
import TeamFlag from "@/components/TeamFlag";
import FixtureMatchRow from "@/components/match/FixtureMatchRow";
import { FavouriteMatchButton } from "@/components/FavouriteButton";
import { matchHref } from "@/lib/wc26-match";
import { SITE_NAME } from "@/lib/site-url";
import { AdSlot } from "@/components/ads/AdSlot";
import { ADSENSE_SLOTS } from "@/lib/adsense-slots";
import LiveRibbon from "@/components/layout/LiveRibbon";
import HomeArticlesSection from "@/components/home/HomeArticlesSection";
import HomeFavouritesStrip from "@/components/home/HomeFavouritesStrip";
import HomeNewsSection from "@/components/home/HomeNewsSection";
import HomePlSection from "@/components/home/HomePlSection";
import HomeWc26StandingsPreview from "@/components/home/HomeWc26StandingsPreview";
import styles from "@/app/[locale]/page.module.css";

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
  const isUpcoming = match.matchClass === "upcoming";
  const kickoffTime = useLocalizedKickoffTime(match.kickoffUtc);
  return (
    <span className={`${styles.statusPill} ${statusPillClass(match.matchClass)}`}>
      {isLive ? <span className={styles.liveDot} aria-hidden="true" /> : null}
      {isUpcoming ? kickoffTime : match.statusLabel}
    </span>
  );
}

function FeaturedMatchBody({ match }: { match: HomepageMatchView }) {
  const score = formatScore(match);
  const isLive = match.matchClass === "live";
  const kickoffLabel = useLocalizedKickoffLabel(match.kickoffUtc);

  return (
    <>
      <div className={styles.featuredRow}>
        <div className={`${styles.featuredSide} ${styles.featuredSideHome}`}>
          <TeamFlag teamId={match.homeTeamId} size={FEATURED_FLAG} />
          <span className={styles.featuredTeamName}>{match.homeName}</span>
        </div>

        <div className={styles.featuredScorebox}>
          <div className={styles.featuredScore}>
            {score ?? <span className={styles.featuredVs}>vs</span>}
          </div>
          {isLive && match.elapsed != null ? (
            <div className={styles.minLive}>{match.elapsed}&apos;</div>
          ) : null}
        </div>

        <div className={`${styles.featuredSide} ${styles.featuredSideAway}`}>
          <span className={styles.featuredTeamName}>{match.awayName}</span>
          <TeamFlag teamId={match.awayTeamId} size={FEATURED_FLAG} />
        </div>
      </div>

      <p className={styles.featuredMeta}>
        {kickoffLabel}
        {match.venueLabel ? ` · ${match.venueLabel}` : ""}
      </p>
    </>
  );
}

function FeaturedMatchHero({ match }: { match: HomepageMatchView }) {
  const t = useTranslations("home");

  return (
    <article className={styles.featuredHero}>
      <div className={styles.featuredHeroTop}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span className={styles.featuredHeroLabel}>{t("featuredMatch")}</span>
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
        <FeaturedMatchBody match={match} />

        <div className={styles.featuredActions}>
          <Link href={matchHref(match.fixtureId)} className={styles.btnPrimary}>
            {t("matchDetails")} →
          </Link>
          <Link href="/worldcup2026/fixtures" className={styles.btnSecondary}>
            {t("allFixtures")}
          </Link>
        </div>
      </div>
    </article>
  );
}

function FeaturedSimultaneousDecider({
  matches,
}: {
  matches: readonly HomepageMatchView[];
}) {
  const t = useTranslations("home");
  const primaryLive = matches.find((match) => match.matchClass === "live");

  return (
    <article className={styles.featuredHero}>
      <div className={styles.featuredHeroTop}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span className={styles.featuredHeroLabel}>{t("featuredMatch")}</span>
          {primaryLive ? <FeaturedStatusBadge match={primaryLive} /> : null}
        </div>
      </div>

      <div
        className={`${styles.featuredDualBody} ${
          matches.length === 2 ? styles.featuredDualBodyPair : ""
        }`}
      >
        {matches.map((match) => (
          <div key={match.fixtureId} className={styles.featuredDualMatch}>
            <FeaturedMatchBody match={match} />
            <div className={styles.featuredDualActions}>
              <Link href={matchHref(match.fixtureId)} className={styles.btnPrimary}>
                {t("matchDetails")} →
              </Link>
              <FavouriteMatchButton
                matchId={match.fixtureId}
                label={`${match.homeName} vs ${match.awayName}`}
                className={styles.favBtnOnDark}
              />
            </div>
          </div>
        ))}
      </div>

      <div className={styles.featuredActions}>
        <Link href="/worldcup2026/fixtures" className={styles.btnSecondary}>
          {t("allFixtures")}
        </Link>
      </div>
    </article>
  );
}

function CompactMatchRow({
  match,
  showHalf,
  fixture,
}: {
  match: HomepageMatchView;
  showHalf: boolean;
  fixture: EffectiveFixture | undefined;
}) {
  const kickoffTime = useLocalizedKickoffTime(match.kickoffUtc);
  const score = formatScore(match);
  const half = fixture ? formatHalfIndicator(fixture) : null;
  const isLive = match.matchClass === "live";

  return (
    <li>
      <FixtureMatchRow
        className={styles.compactRowInner}
        href={matchHref(match.fixtureId)}
        homeTeamId={match.homeTeamId}
        awayTeamId={match.awayTeamId}
        homeName={match.homeName}
        awayName={match.awayName}
        centrePrimary={
          score ?? (match.matchClass === "upcoming" ? kickoffTime : "–")
        }
        centreSecondary={
          showHalf && half
            ? half
            : match.matchClass === "ft"
              ? "FT"
              : isLive && match.elapsed != null
                ? `${match.statusLabel} · ${match.elapsed}'`
                : match.matchClass === "upcoming"
                  ? undefined
                  : match.statusLabel
        }
        flagSize={LIST_FLAG}
        isLive={isLive}
      />
    </li>
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
      {matches.map((match) => (
        <CompactMatchRow
          key={match.fixtureId}
          match={match}
          showHalf={showHalf}
          fixture={fixtureById.get(match.fixtureId)}
        />
      ))}
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
      <h2 className={styles.columnCardTitle} data-gc-text>
        {title}
      </h2>
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
  const fixtures = useEffectiveFixtures();
  const fixtureById = new Map(fixtures.map((f) => [f.id, f]));
  const featuredSelection = selectFeaturedFixtures(fixtures);
  const featuredIds = featuredSelection.fixtures.map((fixture) => fixture.id);
  const featuredMatches = featuredSelection.fixtures.map(buildHomepageMatchView);
  const featured = featuredMatches[0];

  const pool = selectHomepageFixtures(fixtures, featuredIds, 16);
  const liveMatches = fixtures
    .filter((f) => isLiveMatchStatus(f.status))
    .map(buildHomepageMatchView)
    .slice(0, 4);
  const latestResults = pool.filter((m) => m.matchClass === "ft").slice(0, 4);
  const upcomingMatches = selectUpcomingHomepageFixtures(fixtures, featuredIds, 6);

  const { gamesPlayed, gamesLeft } = useTournamentStats();

  const t = useTranslations("home");

  return (
    <div className={styles.homeRoot} data-gc-shell>
      <main className={styles.homeMain}>
        <header className={styles.homeHero}>
          <div className={styles.homeHeroBg} aria-hidden="true" />
          <div className={styles.homeHeroContent} data-gc-text>
            <h1>{t("title")}</h1>
            <p>{t("subtitle", { siteName: SITE_NAME })}</p>
            <span className={styles.homeBadge}>{t("badge")}</span>
          </div>
        </header>

        <section className={styles.sectionBlock} aria-labelledby="featured-match-heading">
          <h2 id="featured-match-heading" className={styles.sectionTitle} data-gc-text>
            {t("featuredMatch")}
          </h2>
          {featuredSelection.mode === "simultaneous" && featuredMatches.length >= 2 ? (
            <FeaturedSimultaneousDecider matches={featuredMatches} />
          ) : featured ? (
            <FeaturedMatchHero match={featured} />
          ) : (
            <p className={styles.sectionNote}>{t("noFixturesLoaded")}</p>
          )}
        </section>

        <HomeFavouritesStrip />

        <div className={styles.homeTickerWrap}>
          <LiveRibbon embedded />
        </div>

        <AdSlot slot={ADSENSE_SLOTS.homeMid} className={styles.adUnit} />

        <div className={styles.threeCol}>
          <ColumnCard
            title={t("liveNow")}
            footerHref="/live"
            footerLabel={t("viewAllLive")}
            emptyMessage={t("noLiveMatches")}
            isEmpty={liveMatches.length === 0}
          >
            <CompactMatchList
              matches={liveMatches}
              showHalf
              fixtureById={fixtureById}
            />
          </ColumnCard>

          <ColumnCard
            title={t("latestResults")}
            footerHref="/live"
            footerLabel={t("viewAllResults")}
            emptyMessage={t("noRecentResults")}
            isEmpty={latestResults.length === 0}
          >
            <CompactMatchList
              matches={latestResults}
              showHalf={false}
              fixtureById={fixtureById}
            />
          </ColumnCard>

          <ColumnCard
            title={t("upcomingFixtures")}
            footerHref="/worldcup2026/fixtures"
            footerLabel={t("viewAllFixtures")}
            emptyMessage={t("noUpcomingFixtures")}
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

        <section className={styles.sectionBlock} aria-labelledby="wc26-heading">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleRow}>
              <span className={styles.sectionBar} aria-hidden="true" />
              <h2 id="wc26-heading" className={styles.sectionTitle}>
                {t("wc26Title")}
              </h2>
            </div>
            <Link href="/worldcup2026" className={styles.sectionLink}>
              {t("viewAll")} →
            </Link>
          </div>
          <p className={styles.wc26Summary}>
            {t("wc26Summary", { gamesPlayed, gamesLeft })}
          </p>
        </section>

        <HomeNewsSection />

        <HomeArticlesSection />

        <AdSlot slot={ADSENSE_SLOTS.homeLower} className={styles.adUnit} />
      </main>
    </div>
  );
}
