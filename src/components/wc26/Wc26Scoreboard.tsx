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
    return null;
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
