"use client";

import Link from "next/link";
import { useMemo } from "react";
import TeamFlag from "@/components/TeamFlag";
import MatchDetailLink from "@/components/match/MatchDetailLink";
import FixtureMatchRow from "@/components/match/FixtureMatchRow";
import TeamLink from "@/components/wc26/TeamLink";
import GroupStandingsSection from "@/components/wc26/GroupStandingsSection";
import MatchTvBroadcast from "@/components/wc26/MatchTvBroadcast";
import Wc26Breadcrumb from "@/components/wc26/Wc26Breadcrumb";
import {
  getTeamById,
  getTeamsByGroup,
  getVenueById,
  groupLabel,
  type Wc26GroupId,
} from "@/data/wc26";
import Wc26TopScorers from "@/components/wc26/Wc26TopScorers";
import {
  buildGroupTeamNamesList,
  buildHomepageMatchView,
  computeGroupHeaderStats,
  computeGroupMatchStats,
  computeTeamFormMap,
  filterNewsForGroup,
  partitionGroupFixtures,
  getActiveFinalMatchdayPair,
  selectNextGroupMatch,
} from "@/lib/wc26-group-hub";
import { GROUPS_HUB_HREF, WC26_HUB_HREF, WC26_QUALIFYING_SPOTS } from "@/lib/wc26-groups";
import {
  getGroupQualification,
  isGroupComplete,
  teamDisplayName,
} from "@/lib/wc26-standings";
import { matchHref } from "@/lib/wc26-match";
import { teamHref } from "@/lib/wc26-teams";
import { useEffectiveFixtures } from "@/lib/use-effective-fixtures";
import { useNewsFeed } from "@/lib/use-news-feed";
import { useLiveTopScorers } from "@/lib/client/useLiveTopScorers";
import { useWc26TvRegion } from "@/lib/use-wc26-tv-region";
import { formatKickoffUtc, formatVisitorKickoff } from "@/lib/wc26-format";
import { useIsClient } from "@/lib/use-is-client";
import styles from "./wc26.module.css";

/** SSR-stable UTC label; switches to visitor-local after mount to avoid hydration mismatch. */
function VisitorKickoffLabel({ iso }: { iso: string }) {
  const mounted = useIsClient();
  const label = mounted ? formatVisitorKickoff(iso) : formatKickoffUtc(iso);

  return <span>{label}</span>;
}

type GroupHubContentProps = {
  groupId: Wc26GroupId;
};

function formatNewsDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function GroupFixtureRow({
  fixture,
  tvRegion,
}: {
  fixture: ReturnType<typeof useEffectiveFixtures>[number];
  tvRegion: ReturnType<typeof useWc26TvRegion>["tvRegion"];
}) {
  const view = buildHomepageMatchView(fixture);
  const score =
    view.score != null ? `${view.score.home}–${view.score.away}` : null;

  return (
    <li className={styles.groupFixtureRow}>
      <FixtureMatchRow
        href={matchHref(fixture.id)}
        homeTeamId={view.homeTeamId}
        awayTeamId={view.awayTeamId}
        homeName={view.homeName}
        awayName={view.awayName}
        centrePrimary={score ?? view.statusLabel}
        centreSecondary={score ? view.statusLabel : undefined}
        flagSize={22}
        isLive={view.matchClass === "live"}
      />
      <div className={styles.groupFixtureMeta}>
        <VisitorKickoffLabel iso={fixture.kickoffUtc} />
        {view.venueLabel ? <span>{view.venueLabel}</span> : null}
        <MatchTvBroadcast
          tvRegion={tvRegion}
          matchNumber={fixture.matchNumber}
          variant="chips"
        />
        <MatchDetailLink
          fixtureId={fixture.id}
          label="Match centre →"
          className={styles.fixDetailLink}
        />
      </div>
    </li>
  );
}

export default function GroupHubContent({ groupId }: GroupHubContentProps) {
  const title = groupLabel(groupId);
  const teams = getTeamsByGroup(groupId);
  const fixtures = useEffectiveFixtures();
  const { data: topScorersData, isLoading: topScorersLoading } =
    useLiveTopScorers();
  const scorers = topScorersData?.scorers ?? [];
  const { articles, loading: newsLoading, usingFallback } = useNewsFeed();
  const { tvRegion } = useWc26TvRegion();

  const headerStats = useMemo(
    () => computeGroupHeaderStats(groupId, fixtures),
    [groupId, fixtures],
  );
  const formByTeamId = useMemo(
    () => computeTeamFormMap(groupId, fixtures),
    [groupId, fixtures],
  );
  const { upcoming, completed } = useMemo(
    () => partitionGroupFixtures(groupId, fixtures),
    [groupId, fixtures],
  );
  const activeFinalPair = useMemo(
    () => getActiveFinalMatchdayPair(groupId, fixtures),
    [groupId, fixtures],
  );
  const activeFinalPairIds = useMemo(
    () => new Set(activeFinalPair?.map((fixture) => fixture.id) ?? []),
    [activeFinalPair],
  );
  const upcomingFiltered = useMemo(
    () => upcoming.filter((fixture) => !activeFinalPairIds.has(fixture.id)),
    [upcoming, activeFinalPairIds],
  );
  const nextMatch = useMemo(
    () => selectNextGroupMatch(groupId, fixtures),
    [groupId, fixtures],
  );
  const matchStats = useMemo(
    () => computeGroupMatchStats(groupId, fixtures),
    [groupId, fixtures],
  );
  const groupNews = useMemo(
    () => filterNewsForGroup(articles, groupId, 6),
    [articles, groupId],
  );
  const groupComplete = useMemo(
    () => isGroupComplete(groupId, fixtures),
    [groupId, fixtures],
  );
  const groupQualification = useMemo(
    () => getGroupQualification(groupId, fixtures),
    [groupId, fixtures],
  );

  const nextMatchView = nextMatch ? buildHomepageMatchView(nextMatch) : null;
  const nextVenue = nextMatch ? getVenueById(nextMatch.venueId) : null;
  const teamNames = buildGroupTeamNamesList(groupId);

  return (
    <main className={styles.wc26Content}>
      <Wc26Breadcrumb
        items={[
          { label: "World Cup 2026", href: WC26_HUB_HREF },
          { label: "Groups", href: GROUPS_HUB_HREF },
          { label: title },
        ]}
      />

      <header className={styles.groupHubHeader}>
        <h1 className={styles.pageTitle}>
          FIFA World Cup 2026 — <span>{title}</span>
        </h1>
        <p className={styles.pageIntro}>
          {title} hub with live standings, fixtures, results, top scorers and
          news for {teamNames}.
        </p>

        <div className={styles.groupHubTeamStrip} aria-label={`${title} teams`}>
          {teams.map((team) => (
            <Link key={team.id} href={teamHref(team.id)} className={styles.groupHubTeamChip}>
              <TeamFlag teamId={team.id} size={28} />
              <span>{team.name}</span>
              <span className={styles.groupHubTeamCode}>{team.code}</span>
            </Link>
          ))}
        </div>

        <div className={styles.groupHubStats} aria-label={`${title} progress`}>
          <div className={styles.groupHubStat}>
            <b>{headerStats.gamesPlayed}</b>
            <span>Played</span>
          </div>
          <div className={styles.groupHubStat}>
            <b>{headerStats.gamesLeft}</b>
            <span>Left</span>
          </div>
          <div className={styles.groupHubStat}>
            <b>{headerStats.goalsScored}</b>
            <span>Goals</span>
          </div>
          <div className={styles.groupHubStat}>
            <b>{teams.length}</b>
            <span>Teams</span>
          </div>
        </div>
      </header>

      {groupComplete ? (
        <div className={styles.groupCompleteBanner} role="status">
          <p className={styles.groupCompleteBannerTitle}>
            {title} — group stage complete
          </p>
          <p className={styles.groupCompleteBannerText}>
            Final standings are locked. Qualified teams advance to the Round of 32.
          </p>
          <div className={styles.groupCompleteQualifiers} aria-label="Qualified teams">
            {groupQualification.winner ? (
              <span className={styles.groupCompleteQualifier}>
                <TeamFlag teamId={groupQualification.winner.teamId} size={22} />
                {teamDisplayName(groupQualification.winner.teamId)} [Qualified]
              </span>
            ) : null}
            {groupQualification.runnerUp ? (
              <span className={styles.groupCompleteQualifier}>
                <TeamFlag teamId={groupQualification.runnerUp.teamId} size={22} />
                {teamDisplayName(groupQualification.runnerUp.teamId)} [Qualified]
              </span>
            ) : null}
          </div>
        </div>
      ) : null}

      {nextMatchView ? (
        <section className={styles.groupNextMatch} aria-labelledby="group-next-match-heading">
          <h2 id="group-next-match-heading" className={styles.sectionTitle}>
            Next match in {title}
          </h2>
          <div className={styles.groupNextMatchCard}>
            <div className={styles.groupNextMatchTeams}>
              <span className={styles.groupNextMatchSide}>
                <TeamFlag teamId={nextMatchView.homeTeamId} size={32} />
                <strong>{nextMatchView.homeName}</strong>
              </span>
              <span className={styles.groupNextMatchVs}>
                {nextMatchView.score
                  ? `${nextMatchView.score.home}–${nextMatchView.score.away}`
                  : "vs"}
              </span>
              <span className={styles.groupNextMatchSide}>
                <strong>{nextMatchView.awayName}</strong>
                <TeamFlag teamId={nextMatchView.awayTeamId} size={32} />
              </span>
            </div>
            <p className={styles.groupNextMatchMeta}>
              {nextMatchView.statusLabel}
              {nextVenue ? ` · ${nextVenue.name}, ${nextVenue.city}` : ""}
            </p>
            {nextMatch ? (
              <div className={styles.groupNextMatchTv}>
                <MatchTvBroadcast
                  tvRegion={tvRegion}
                  matchNumber={nextMatch.matchNumber}
                  variant="chips"
                />
              </div>
            ) : null}
            <Link href={matchHref(nextMatchView.fixtureId)} className={styles.groupNextMatchLink}>
              Open match centre →
            </Link>
          </div>
        </section>
      ) : null}

      <GroupStandingsSection groupId={groupId} formByTeamId={formByTeamId} />

      {activeFinalPair ? (
        <section
          className={styles.groupFinalMatchday}
          aria-labelledby="group-final-matchday-heading"
        >
          <h2 id="group-final-matchday-heading" className={styles.sectionTitle}>
            Live — final matchday
          </h2>
          <p className={styles.groupFinalMatchdayNote}>
            Both group fixtures kick off simultaneously. Scores and standings update
            in real time.
          </p>
          <ul className={styles.groupFixtureList}>
            {activeFinalPair.map((fixture) => (
              <GroupFixtureRow key={fixture.id} fixture={fixture} tvRegion={tvRegion} />
            ))}
          </ul>
        </section>
      ) : null}

      <section aria-labelledby="group-upcoming-heading">
        <h2 id="group-upcoming-heading" className={styles.sectionTitle}>
          Upcoming matches
        </h2>
        {upcomingFiltered.length === 0 ? (
          <p className={styles.standingsEmpty}>No upcoming fixtures in {title}.</p>
        ) : (
          <ul className={styles.groupFixtureList}>
            {upcomingFiltered.map((fixture) => (
              <GroupFixtureRow key={fixture.id} fixture={fixture} tvRegion={tvRegion} />
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="group-completed-heading">
        <h2 id="group-completed-heading" className={styles.sectionTitle}>
          Completed matches
        </h2>
        {completed.length === 0 ? (
          <p className={styles.standingsEmpty}>No completed results in {title} yet.</p>
        ) : (
          <ul className={styles.groupFixtureList}>
            {completed.map((fixture) => (
              <GroupFixtureRow key={fixture.id} fixture={fixture} tvRegion={tvRegion} />
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="group-scorers-heading">
        <h2 id="group-scorers-heading" className={styles.sectionTitle}>
          Top scorers
        </h2>
        <Wc26TopScorers
          embedded
          scorers={scorers}
          loading={topScorersLoading}
          configured={topScorersData?.configured}
          matchesProcessed={topScorersData?.matchesProcessed}
          matchesWithVerifiedEvents={topScorersData?.matchesWithVerifiedEvents}
          fetchedAt={topScorersData?.fetchedAt}
        />
      </section>

      <section aria-labelledby="group-news-heading">
        <h2 id="group-news-heading" className={styles.sectionTitle}>
          {title} news
        </h2>
        <p className={styles.phaseNote}>
          Latest articles mentioning teams in {title} from BBC Sport and ESPN.
          {usingFallback ? " Showing fallback feed while live sources refresh." : ""}
        </p>
        {newsLoading ? (
          <p className={styles.standingsEmpty}>Loading group news…</p>
        ) : groupNews.length === 0 ? (
          <p className={styles.standingsEmpty}>
            No recent headlines mention {teamNames} yet. Check the{" "}
            <Link href="/news">news hub</Link> for tournament coverage.
          </p>
        ) : (
          <ul className={styles.groupNewsList}>
            {groupNews.map((article) => (
              <li key={`${article.link}-${article.title}`} className={styles.groupNewsItem}>
                <a
                  href={article.link}
                  className={styles.groupNewsLink}
                  target={article.link.startsWith("http") ? "_blank" : undefined}
                  rel={article.link.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  <span className={styles.groupNewsTitle}>{article.title}</span>
                  <span className={styles.groupNewsMeta}>
                    {formatNewsDate(article.date)} · {article.source}
                  </span>
                  {article.excerpt ? (
                    <span className={styles.groupNewsExcerpt}>{article.excerpt}</span>
                  ) : null}
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="group-stats-heading">
        <h2 id="group-stats-heading" className={styles.sectionTitle}>
          {title} statistics
        </h2>
        {matchStats.completedMatches === 0 ? (
          <p className={styles.standingsEmpty}>
            Group statistics will appear after the first completed matches in {title}.
          </p>
        ) : (
          <div className={styles.groupStatsGrid}>
            <div className={styles.groupStatCard}>
              <b>{matchStats.totalGoals}</b>
              <span>Total goals</span>
            </div>
            <div className={styles.groupStatCard}>
              <b>
                {matchStats.averageGoalsPerGame != null
                  ? matchStats.averageGoalsPerGame.toFixed(2)
                  : "—"}
              </b>
              <span>Avg goals / game</span>
            </div>
            <div className={styles.groupStatCard}>
              <b>{matchStats.cleanSheets}</b>
              <span>Clean sheets</span>
            </div>
            <div className={styles.groupStatCard}>
              <b>
                {matchStats.highestScoringMatch
                  ? matchStats.highestScoringMatch.totalGoals
                  : "—"}
              </b>
              <span>Highest-scoring match</span>
              {matchStats.highestScoringMatch ? (
                <Link
                  href={matchHref(matchStats.highestScoringMatch.fixtureId)}
                  className={styles.groupStatLink}
                >
                  {matchStats.highestScoringMatch.label}
                </Link>
              ) : null}
            </div>
          </div>
        )}
      </section>

      <nav className={styles.groupHubNav} aria-label={`${title} related links`}>
        <h2 className={styles.sectionTitle}>Explore {title}</h2>
        <div className={styles.groupHubNavGrid}>
          <Link href={WC26_HUB_HREF} className={styles.groupHubNavLink}>
            World Cup 2026 hub
          </Link>
          <Link href={GROUPS_HUB_HREF} className={styles.groupHubNavLink}>
            All groups
          </Link>
          <Link href="/worldcup2026/standings" className={styles.groupHubNavLink}>
            Full standings
          </Link>
          <Link href="/worldcup2026/fixtures" className={styles.groupHubNavLink}>
            All fixtures
          </Link>
          {teams.map((team) => (
            <Link key={team.id} href={teamHref(team.id)} className={styles.groupHubNavLink}>
              {team.name}
            </Link>
          ))}
          {completed.slice(0, 3).map((fixture) => {
            const home = getTeamById(fixture.homeTeamId);
            const away = getTeamById(fixture.awayTeamId);
            return (
              <Link
                key={fixture.id}
                href={matchHref(fixture.id)}
                className={styles.groupHubNavLink}
              >
                {home?.name ?? fixture.homeTeamId} vs {away?.name ?? fixture.awayTeamId}
              </Link>
            );
          })}
        </div>
        <p className={styles.phaseNote}>
          Top {WC26_QUALIFYING_SPOTS} teams in each group qualify automatically for
          the knockout stage.
        </p>
      </nav>

      <p className={styles.hubBack}>
        <Link href={GROUPS_HUB_HREF}>← Back to Groups hub</Link>
      </p>
    </main>
  );
}
