"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { getTeamById } from "@/data/wc26";
import { useTournamentStats } from "@/lib/use-tournament-stats";
import { useEffectiveFixtures } from "@/lib/use-effective-fixtures";
import { useLiveScores } from "@/lib/use-live-scores";
import {
  buildHomepageMatchView,
  isLiveMatchStatus,
  selectFeaturedFixture,
  selectHomepageFixtures,
  selectUpcomingHomepageFixtures,
  type HomepageMatchView,
} from "@/lib/wc26-live";
import type { EffectiveFixture } from "@/lib/wc26-fixture-overlay";
import { useWc26GroupStandings } from "@/lib/use-wc26-standings";
import TeamFlag from "@/components/TeamFlag";
import { FavouriteMatchButton } from "@/components/FavouriteButton";
import { matchHref } from "@/lib/wc26-match";
import { SITE_NAME } from "@/lib/site-url";
import AdSenseUnit from "@/components/AdSenseUnit";
import LiveRibbon from "@/components/layout/LiveRibbon";
import HomeFavouritesStrip from "@/components/home/HomeFavouritesStrip";
import HomeNewsSection from "@/components/home/HomeNewsSection";
import styles from "@/app/page.module.css";

const FEATURED_FLAG = 72;
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

function FeaturedMatchHero({
  match,
  fixture,
}: {
  match: HomepageMatchView;
  fixture: EffectiveFixture;
}) {
  const score = formatScore(match);
  const isLive = match.matchClass === "live";
  const halfLabel = formatHalfIndicator(fixture);
  const detailHref = matchHref(match.fixtureId);

  return (
    <article className={styles.featuredHero}>
      <div className={styles.featuredHeroTop}>
        <span className={styles.featuredComp}>
          FIFA World Cup 2026 · {match.roundLabel}
        </span>
        <FavouriteMatchButton
          matchId={match.fixtureId}
          label={`${match.homeName} vs ${match.awayName}`}
          className={styles.favBtnInline}
        />
      </div>

      <div className={styles.featuredHeroBody}>
        <div className={styles.featuredMainRow}>
          <div className={`${styles.featuredSide} ${styles.featuredSideHome}`}>
            <TeamFlag teamId={match.homeTeamId} size={FEATURED_FLAG} />
            <span className={styles.featuredTeamName}>{match.homeName}</span>
          </div>

          <div className={styles.featuredScorebox}>
            {isLive && halfLabel ? (
              <span className={styles.featuredHalf}>{halfLabel}</span>
            ) : null}
            {score ? (
              <div
                className={`${styles.featuredScore} ${isLive ? styles.featuredScoreLive : ""}`}
              >
                <span>{match.score!.home}</span>
                <span className={styles.featuredScoreSep}>–</span>
                <span>{match.score!.away}</span>
              </div>
            ) : (
              <span className={styles.featuredVs}>vs</span>
            )}
            {isLive && match.elapsed != null ? (
              <span className={styles.featuredMinute}>{match.elapsed}&apos;</span>
            ) : !isLive && !score ? (
              <span className={styles.featuredKickoffPill}>{match.statusLabel}</span>
            ) : null}
          </div>

          <div className={`${styles.featuredSide} ${styles.featuredSideAway}`}>
            <TeamFlag teamId={match.awayTeamId} size={FEATURED_FLAG} />
            <span className={styles.featuredTeamName}>{match.awayName}</span>
          </div>

          <Link href={detailHref} className={styles.featuredMatchCentre}>
            Match Centre →
          </Link>
        </div>
      </div>

      <p className={styles.featuredMeta}>
        {match.kickoffLabel}
        {match.venueLabel ? ` · ${match.venueLabel}` : ""}
      </p>
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

function HomeGroupHStandings() {
  const standings = useWc26GroupStandings("h");

  return (
    <div className={styles.homeStandingsWrap}>
      <table className={styles.homeStandingsTable}>
        <thead>
          <tr>
            <th>#</th>
            <th>Team</th>
            <th>P</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>GD</th>
            <th>Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.rows.map((row, index) => {
            const team = getTeamById(row.teamId);
            const gd =
              row.goalDifference > 0
                ? `+${row.goalDifference}`
                : String(row.goalDifference);
            return (
              <tr key={row.teamId}>
                <td>{index + 1}</td>
                <td>
                  <span className={styles.standingsTeam}>
                    {team ? <TeamFlag teamId={team.id} size={18} /> : null}
                    <span>{team?.name ?? row.teamId}</span>
                  </span>
                </td>
                <td>{row.played}</td>
                <td>{row.won}</td>
                <td>{row.drawn}</td>
                <td>{row.lost}</td>
                <td>{gd}</td>
                <td className={styles.standingsPts}>{row.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
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
  const liveMatches = pool.filter((m) => m.matchClass === "live").slice(0, 4);
  const latestResults = pool.filter((m) => m.matchClass === "ft").slice(0, 4);
  const upcomingMatches = selectUpcomingHomepageFixtures(
    fixtures,
    featured?.fixtureId,
    6,
  );

  const { gamesPlayed, gamesLeft } = useTournamentStats();

  return (
    <div className={styles.homeRoot}>
      <section className={styles.homeHeroWrap} aria-labelledby="home-hero-heading">
        <div className={styles.homeHero}>
          <div className={styles.homeHeroInner}>
            <div className={styles.homeHeroCopy}>
              <h1 id="home-hero-heading">Football live scores &amp; match centre</h1>
              <p>
                Live football scores, fixtures, results, standings, transfer news and
                match coverage from around the world — updated throughout the day on{" "}
                {SITE_NAME}.
              </p>
              <Link href="/live" className={styles.homeHeroCta}>
                Live Scores &amp; Fixtures
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main className={styles.homeMain}>
        <section className={styles.featuredSection} aria-label="Featured match">
          {featured && featuredFixture ? (
            <FeaturedMatchHero match={featured} fixture={featuredFixture} />
          ) : (
            <p className={styles.columnEmpty}>No World Cup fixtures loaded.</p>
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

          <ColumnCard
            title="Group H Standings"
            footerHref="/worldcup2026/groups/h"
            footerLabel="View Group H"
            emptyMessage=""
            isEmpty={false}
          >
            <HomeGroupHStandings />
          </ColumnCard>
        </div>

        <div className={styles.sectionBlock}>
          <AdSenseUnit slot="1234567890" className={styles.adUnit} />
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

        <div className={styles.sectionBlock}>
          <AdSenseUnit slot="2345678901" className={styles.adUnit} />
        </div>
      </main>
    </div>
  );
}
