"use client";

import Link from "next/link";
import { WC26_TOURNAMENT } from "@/data/wc26";
import { useTournamentStats } from "@/lib/use-tournament-stats";
import { useEffectiveFixtures } from "@/lib/use-effective-fixtures";
import { useLiveScores } from "@/lib/use-live-scores";
import {
  buildHomepageMatchView,
  selectFeaturedFixture,
  selectHomepageFixtures,
  type HomepageMatchClass,
  type HomepageMatchView,
} from "@/lib/wc26-live";
import TeamFlag from "@/components/TeamFlag";
import { FavouriteMatchButton } from "@/components/FavouriteButton";
import { matchHref } from "@/lib/wc26-match";
import { SITE_NAME } from "@/lib/site-url";
import AdSenseUnit from "@/components/AdSenseUnit";
import styles from "@/app/page.module.css";

const ADSENSE_PUBLISHER_ID = "ca-pub-8697460993506171";

const FEATURED_FLAG = 64;

const HOME_NEWS = [
  {
    category: "World Cup 2026",
    headline: "Tournament news, groups and daily round-ups",
    href: "/news",
    editorial: false,
  },
  {
    category: "GoalCurrent Editorial",
    headline: "Football Is Inspiring Canada's Next Generation",
    href: "/news/articles/football-inspiring-canadas-next-generation",
    editorial: true,
  },
  {
    category: "GoalCurrent Editorial",
    headline: "World Cup 2026 — The Complete Fan Guide",
    href: "/news/articles/world-cup-2026-complete-guide",
    editorial: true,
  },
] as const;

const WC26_NAV = [
  { href: "/worldcup2026/fixtures", label: "Fixtures", note: "Full schedule" },
  { href: "/worldcup2026/groups", label: "Groups", note: "All 12 groups" },
  { href: "/worldcup2026/standings", label: "Standings", note: "Tables & points" },
  { href: "/worldcup2026", label: "Tournament hub", note: "World Cup 2026" },
] as const;

function formatScore(match: HomepageMatchView) {
  if (!match.score) return null;
  return `${match.score.home}–${match.score.away}`;
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

function MatchListRow({ match }: { match: HomepageMatchView }) {
  const score = formatScore(match);
  const matchLabel = `${match.homeName} vs ${match.awayName}`;

  return (
    <div className={styles.matchRow}>
      <span className={`${styles.statusPill} ${statusPillClass(match.matchClass)}`}>
        {match.matchClass === "live" ? (
          <span className={styles.liveDot} aria-hidden="true" />
        ) : null}
        {match.statusLabel}
      </span>
      <span className={styles.colHome}>
        <TeamFlag teamId={match.homeTeamId} size={26} />
        <span>{match.homeName}</span>
      </span>
      <span className={styles.colScore}>
        {score ?? "vs"}
      </span>
      <span className={styles.colAway}>
        <TeamFlag teamId={match.awayTeamId} size={26} />
        <span>{match.awayName}</span>
      </span>
      <FavouriteMatchButton matchId={match.fixtureId} label={matchLabel} />
    </div>
  );
}

function MatchListSection({
  id,
  title,
  matches,
  emptyMessage,
  moreHref,
  moreLabel,
  isResults = false,
}: {
  id: string;
  title: string;
  matches: readonly HomepageMatchView[];
  emptyMessage: string;
  moreHref: string;
  moreLabel: string;
  isResults?: boolean;
}) {
  return (
    <section className={styles.sectionBlock} aria-labelledby={id}>
      <div className={styles.sectionHeader}>
        <h2 id={id} className={styles.sectionTitle}>
          {title}
        </h2>
        <Link href={moreHref} className={styles.sectionLink}>
          {moreLabel}
        </Link>
      </div>
      <div className={`${styles.matchCard} ${isResults ? styles.matchCardResults : ""}`}>
        {matches.length === 0 ? (
          <p className={styles.matchCardEmpty}>{emptyMessage}</p>
        ) : (
          matches.map((match) => (
            <MatchListRow key={match.fixtureId} match={match} />
          ))
        )}
        <Link href={moreHref} className={styles.matchLink}>
          {moreLabel} →
        </Link>
      </div>
    </section>
  );
}

export default function Home() {
  useLiveScores();
  const fixtures = useEffectiveFixtures();
  const featuredFixture = selectFeaturedFixture(fixtures);
  const featured = featuredFixture
    ? buildHomepageMatchView(featuredFixture)
    : undefined;

  const pool = selectHomepageFixtures(fixtures, featured?.fixtureId, 12);
  const liveMatches = pool.filter((m) => m.matchClass === "live").slice(0, 3);
  const upcomingMatches = pool.filter((m) => m.matchClass === "upcoming").slice(0, 3);
  const latestResults = pool.filter((m) => m.matchClass === "ft").slice(0, 3);
  // Show upcoming matches when no live games
  const liveOrUpcoming = liveMatches.length > 0 ? liveMatches : upcomingMatches;

  const { gamesPlayed, gamesLeft } = useTournamentStats();
  const totalMatches = WC26_TOURNAMENT.fixtureCount;

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

        <div className={styles.sectionBlock}>
          <AdSenseUnit slot="1234567890" className={styles.adUnit} />
        </div>

        <MatchListSection
          id="live-matches-heading"
          title={liveMatches.length > 0 ? "Live matches" : "Next up"}
          matches={liveOrUpcoming}
          emptyMessage="No upcoming matches available. Check the full fixtures for the schedule."
          moreHref="/live"
          moreLabel={liveMatches.length > 0 ? "Open live scores" : "View all fixtures"}
        />

        <MatchListSection
          id="latest-results-heading"
          title="Latest results"
          matches={latestResults}
          emptyMessage="No recent full-time results. Check back after matches finish."
          moreHref="/live"
          moreLabel="View all results"
          isResults={true}
        />

        <div className={styles.sectionBlock}>
          <AdSenseUnit slot="2345678901" className={styles.adUnit} />
        </div>

        <section className={styles.sectionBlock} aria-labelledby="wc26-nav-heading">
          <div className={styles.sectionHeader}>
            <h2 id="wc26-nav-heading" className={styles.sectionTitle}>
              World Cup 2026
            </h2>
            <Link href="/worldcup2026" className={styles.sectionLink}>
              Tournament hub
            </Link>
          </div>
          <p className={styles.sectionNote}>
            {WC26_TOURNAMENT.hosts.join(" · ")} · 11 Jun – 19 Jul 2026
          </p>
          <div className={styles.wcNav}>
            {WC26_NAV.map((item) => (
              <Link key={item.href} href={item.href} className={styles.wcNavLink}>
                <strong>{item.label}</strong>
                <span>{item.note}</span>
              </Link>
            ))}
          </div>
          <p className={styles.wcStats}>
            <span>
              <strong>{totalMatches}</strong> matches
            </span>
            <span>
              <strong>{gamesPlayed}</strong> played
            </span>
            <span>
              <strong>{gamesLeft}</strong> remaining
            </span>
          </p>
        </section>

        <section className={styles.sectionBlock} aria-labelledby="news-heading">
          <div className={styles.sectionHeader}>
            <h2 id="news-heading" className={styles.sectionTitle}>
              Latest news
            </h2>
            <Link href="/news" className={styles.sectionLink}>
              All football news
            </Link>
          </div>
          <div className={styles.newsGrid}>
            {HOME_NEWS.map((item) => (
              <Link key={item.category} href={item.href} className={styles.newsItem}>
                <div
                  className={`${styles.newsTag} ${item.editorial ? styles.newsTagEditorial : ""}`}
                >
                  {item.category}
                </div>
                <div className={styles.newsBody}>
                  <div className={styles.newsHeadline}>{item.headline}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
