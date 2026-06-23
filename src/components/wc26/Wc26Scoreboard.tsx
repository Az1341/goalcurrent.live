"use client";

import { useEffect, useState } from "react";
import TeamFlag from "@/components/TeamFlag";
import type { Wc26LiveFixturePayload } from "@/types/fixture-overlay";
import styles from "./wc26.module.css";

const POLL_INTERVAL_MS = 30000;
const LIVE_FIXTURES_URL = "/api/wc26/fixtures?status=LIVE";

async function fetchLiveFixtures(): Promise<Wc26LiveFixturePayload[]> {
  const res = await fetch(LIVE_FIXTURES_URL, { cache: "no-store" });
  if (!res.ok) {
    return [];
  }

  const data: unknown = await res.json();
  return Array.isArray(data) ? (data as Wc26LiveFixturePayload[]) : [];
}

function formatMinute(elapsed: number | null): string {
  if (elapsed == null || elapsed < 0) {
    return "LIVE";
  }
  return `${elapsed}'`;
}

export default function Wc26Scoreboard() {
  const [fixtures, setFixtures] = useState<Wc26LiveFixturePayload[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load(): Promise<void> {
      try {
        const liveFixtures = await fetchLiveFixtures();
        if (!cancelled) {
          setFixtures(liveFixtures);
        }
      } catch {
        if (!cancelled) {
          setFixtures([]);
        }
      }
    }

    void load();
    const intervalId = window.setInterval(() => {
      void load();
    }, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, []);

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
