"use client";

import { useMemo } from "react";
import TeamFlag from "@/components/TeamFlag";
import { getFixtureById, getTeamById } from "@/data/wc26";
import { useLiveScores } from "@/lib/client/useLiveScores";
import { isLiveOverlayStatus } from "@/lib/wc26-results-sync";
import type { Wc26ApiMatch, Wc26LiveFixturePayload } from "@/types/fixture-overlay";
import styles from "./wc26.module.css";

function formatMinute(elapsed: number | null): string {
  if (elapsed == null || elapsed < 0) {
    return "LIVE";
  }
  return `${elapsed}'`;
}

const SKELETON_MATCH_COUNT = 2;

function Wc26ScoreboardSkeletonMatch() {
  return (
    <article className={styles.scoreboardMatch} aria-hidden="true">
      <div className={styles.scoreboardTeam}>
        <div
          className={`${styles.scoreboardSkeletonBar} ${styles.scoreboardSkeletonFlag} animate-skeleton-shimmer`}
        />
        <div
          className={`${styles.scoreboardSkeletonBar} ${styles.scoreboardSkeletonTeamName} animate-skeleton-shimmer`}
        />
      </div>

      <div className={styles.scoreboardCenter}>
        <div
          className={`${styles.scoreboardSkeletonBar} ${styles.scoreboardSkeletonScore} animate-skeleton-shimmer`}
        />
        <div
          className={`${styles.scoreboardSkeletonBar} ${styles.scoreboardSkeletonMinute} animate-skeleton-shimmer`}
        />
      </div>

      <div className={`${styles.scoreboardTeam} ${styles.scoreboardTeamAway}`}>
        <div
          className={`${styles.scoreboardSkeletonBar} ${styles.scoreboardSkeletonTeamName} ${styles.scoreboardSkeletonTeamNameAway} animate-skeleton-shimmer`}
        />
        <div
          className={`${styles.scoreboardSkeletonBar} ${styles.scoreboardSkeletonFlag} animate-skeleton-shimmer`}
        />
      </div>
    </article>
  );
}

function Wc26ScoreboardSkeleton() {
  return (
    <section
      className={styles.scoreboard}
      aria-busy="true"
      aria-label="Loading live World Cup matches"
    >
      {Array.from({ length: SKELETON_MATCH_COUNT }, (_, index) => (
        <Wc26ScoreboardSkeletonMatch key={index} />
      ))}
    </section>
  );
}

function mapLiveMatch(match: Wc26ApiMatch): Wc26LiveFixturePayload | null {
  if (!isLiveOverlayStatus(match.status)) {
    return null;
  }

  const fixture = getFixtureById(match.fixtureId);
  if (!fixture) {
    return null;
  }

  const home = getTeamById(fixture.homeTeamId);
  const away = getTeamById(fixture.awayTeamId);

  return {
    fixtureId: match.fixtureId,
    homeTeamId: fixture.homeTeamId,
    awayTeamId: fixture.awayTeamId,
    home: {
      name: home?.name ?? fixture.homeTeamId,
      goals: match.homeScore ?? 0,
    },
    away: {
      name: away?.name ?? fixture.awayTeamId,
      goals: match.awayScore ?? 0,
    },
    fixture: {
      status: { elapsed: match.elapsed },
    },
  };
}

export default function Wc26Scoreboard() {
  const { data, isLoading } = useLiveScores();

  const fixtures = useMemo(() => {
    const matches = data?.matches ?? [];
    return matches
      .map(mapLiveMatch)
      .filter((row): row is Wc26LiveFixturePayload => row != null);
  }, [data]);

  if (isLoading && fixtures.length === 0) {
    return <Wc26ScoreboardSkeleton />;
  }

  if (fixtures.length === 0) {
    return null;
  }

  return (
    <section className={styles.scoreboard} aria-label="Live World Cup matches">
      {fixtures.map((match) => (
        <article key={match.fixtureId} className={styles.scoreboardMatch}>
          <div className={styles.scoreboardTeam}>
            <TeamFlag teamId={match.homeTeamId} size={22} />
            <span className={styles.scoreboardTeamName}>{match.home.name}</span>
          </div>

          <div className={styles.scoreboardCenter}>
            <span className={styles.scoreboardScore}>
              {match.home.goals} – {match.away.goals}
            </span>
            <span className={styles.scoreboardMinute}>
              <span className={styles.scoreboardLiveDot} aria-hidden="true" />
              {formatMinute(match.fixture.status.elapsed)}
            </span>
          </div>

          <div className={`${styles.scoreboardTeam} ${styles.scoreboardTeamAway}`}>
            <span className={styles.scoreboardTeamName}>{match.away.name}</span>
            <TeamFlag teamId={match.awayTeamId} size={22} />
          </div>
        </article>
      ))}
    </section>
  );
}
