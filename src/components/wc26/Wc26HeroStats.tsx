"use client";

import { WC26_TOURNAMENT } from "@/data/wc26";
import { useTournamentStats } from "@/lib/use-tournament-stats";
import styles from "./wc26.module.css";

type StatItem = {
  value: number;
  label: string;
  accent?: boolean;
};

type Wc26HeroStatsProps = {
  /** Hub shows Groups; homepage hero shows Hosts. */
  variant?: "home" | "hub";
};

export default function Wc26HeroStats({ variant = "hub" }: Wc26HeroStatsProps) {
  const { gamesPlayed, gamesLeft } = useTournamentStats();

  const fourthStat: StatItem =
    variant === "home"
      ? { value: WC26_TOURNAMENT.hosts.length, label: "Hosts" }
      : { value: WC26_TOURNAMENT.groupCount, label: "Groups" };

  const stats: StatItem[] = [
    { value: WC26_TOURNAMENT.teamCount, label: "Teams" },
    { value: WC26_TOURNAMENT.fixtureCount, label: "Matches" },
    { value: WC26_TOURNAMENT.venueCount, label: "Venues" },
    fourthStat,
    { value: gamesPlayed, label: "Games Played" },
    { value: gamesLeft, label: "Games Left To Play", accent: true },
  ];

  return (
    <div className={styles.hubStats}>
      {stats.map(({ value, label, accent }) => (
        <div
          key={label}
          className={`${styles.hubStatChip} ${accent ? styles.hubStatChipAccent : ""}`}
        >
          <div
            className={`${styles.hubStatNum} ${accent ? styles.hubStatNumAccent : ""}`}
          >
            {value}
          </div>
          <div className={styles.hubStatLbl}>{label}</div>
        </div>
      ))}
    </div>
  );
}
