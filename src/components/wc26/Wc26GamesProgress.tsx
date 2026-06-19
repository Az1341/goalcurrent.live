"use client";

import { useTournamentStats } from "@/lib/use-tournament-stats";
import styles from "./wc26.module.css";

/** Games played + games left — reactive to fixture overlay updates. */
export default function Wc26GamesProgress() {
  const { gamesPlayed, gamesLeft } = useTournamentStats();

  return (
    <div
      className={`${styles.fixMetrics} ${styles.fixMetricsProgress}`}
      aria-label="Tournament progress"
    >
      <div className={`${styles.fixMetric} ${styles.fixMetricPlayed}`}>
        <b>{gamesPlayed}</b>
        <span>Games Played</span>
      </div>
      <div className={`${styles.fixMetric} ${styles.fixMetricLeft}`}>
        <b>{gamesLeft}</b>
        <span>Games Left</span>
      </div>
    </div>
  );
}
