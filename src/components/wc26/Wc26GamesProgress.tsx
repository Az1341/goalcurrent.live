"use client";

import { useTournamentStats } from "@/lib/use-tournament-stats";
import styles from "./wc26.module.css";

/** Games played + games left chips — reactive to future fixture overlay updates. */
export default function Wc26GamesProgress() {
  const { gamesPlayed, gamesLeft } = useTournamentStats();

  return (
    <div className={styles.hubStats} aria-label="Tournament progress">
      <div className={styles.hubStatChip}>
        <div className={styles.hubStatNum}>{gamesPlayed}</div>
        <div className={styles.hubStatLbl}>Games Played</div>
      </div>
      <div className={`${styles.hubStatChip} ${styles.hubStatChipAccent}`}>
        <div className={`${styles.hubStatNum} ${styles.hubStatNumAccent}`}>
          {gamesLeft}
        </div>
        <div className={styles.hubStatLbl}>Games Left To Play</div>
      </div>
    </div>
  );
}
