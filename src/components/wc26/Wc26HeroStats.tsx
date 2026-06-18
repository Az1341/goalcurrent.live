"use client";

import { WC26_TOURNAMENT } from "@/data/wc26";
import { useTournamentStats } from "@/lib/use-tournament-stats";
import { useWc26TopScorers } from "@/lib/use-wc26-top-scorers";
import styles from "./wc26.module.css";

type StatItem = {
  value: number | string;
  label: string;
  accent?: boolean;
  goals?: boolean;
};

type Wc26HeroStatsProps = {
  /** Hub shows Groups; homepage hero shows Hosts. */
  variant?: "home" | "hub";
};

export default function Wc26HeroStats({ variant = "hub" }: Wc26HeroStatsProps) {
  const { gamesPlayed, gamesLeft } = useTournamentStats();
  const { data: topScorers, loading: goalsLoading } = useWc26TopScorers();

  const fourthStat: StatItem =
    variant === "home"
      ? { value: WC26_TOURNAMENT.hosts.length, label: "Hosts" }
      : { value: WC26_TOURNAMENT.groupCount, label: "Groups" };

  const goalsPending =
    goalsLoading ||
    (topScorers.configured &&
      topScorers.totalGoals === 0 &&
      topScorers.matchesWithVerifiedEvents === 0);

  const goalsValue = goalsPending ? "…" : topScorers.totalGoals;

  const stats: StatItem[] = [
    { value: WC26_TOURNAMENT.teamCount, label: "Teams" },
    { value: WC26_TOURNAMENT.fixtureCount, label: "Matches" },
    { value: WC26_TOURNAMENT.venueCount, label: "Venues" },
    fourthStat,
    { value: gamesPlayed, label: "Games Played" },
    { value: gamesLeft, label: "Games Left To Play", accent: true },
    {
      value: goalsValue,
      label: "Goals Scored",
      goals: true,
    },
  ];

  return (
    <div className={styles.hubStats}>
      {stats.map(({ value, label, accent, goals }) => (
        <div
          key={label}
          className={[
            styles.hubStatChip,
            accent ? styles.hubStatChipAccent : "",
            goals ? styles.hubStatChipGoals : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div
            className={[
              styles.hubStatNum,
              accent ? styles.hubStatNumAccent : "",
              goals ? styles.hubStatNumGoals : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {value}
          </div>
          <div
            className={[
              styles.hubStatLbl,
              goals ? styles.hubStatLblGoals : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}
