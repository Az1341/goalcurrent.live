"use client";

import Link from "next/link";
import TeamFlag from "@/components/TeamFlag";
import { getTeamById } from "@/data/wc26";
import {
  getFixtureScore,
  isEffectiveFixtureCompleted,
  type EffectiveFixture,
} from "@/lib/wc26-fixture-overlay";
import { formatVisitorKickoffTime } from "@/lib/wc26-format";
import {
  formatFixtureStatusLabel,
  isLiveMatchStatus,
} from "@/lib/wc26-live";
import { matchHref } from "@/lib/wc26-match";
import styles from "./live.module.css";

type LiveMatchCardProps = {
  fixture: EffectiveFixture;
};

function statusColumnLabel(fixture: EffectiveFixture, isLive: boolean, isCompleted: boolean): string {
  if (isLive) {
    if (fixture.elapsed != null) {
      return `${fixture.elapsed}'`;
    }
    return "LIVE";
  }
  if (isCompleted) {
    return "FT";
  }
  return formatVisitorKickoffTime(fixture.kickoffUtc);
}

export default function LiveMatchCard({ fixture }: LiveMatchCardProps) {
  const home = getTeamById(fixture.homeTeamId);
  const away = getTeamById(fixture.awayTeamId);
  const isLive = isLiveMatchStatus(fixture.status);
  const isCompleted = isEffectiveFixtureCompleted(fixture);
  const score = getFixtureScore(fixture);
  const label = `${home?.name ?? fixture.homeTeamId} vs ${away?.name ?? fixture.awayTeamId}`;

  const centreLabel =
    isLive || isCompleted
      ? score
        ? `${score.home} - ${score.away}`
        : "-"
      : "vs";

  const statusLabel = isLive
    ? formatFixtureStatusLabel(fixture.status)
    : isCompleted
      ? "Full Time"
      : "Upcoming";

  return (
    <li className={styles.matchRowItem}>
      <Link
        href={matchHref(fixture.id)}
        className={`${styles.matchRow} ${isLive ? styles.matchRowLive : ""}`}
        aria-label={`${label} - ${statusLabel}`}
      >
        <span
          className={`${styles.matchRowStatus} ${isLive ? styles.matchRowStatusLive : ""} ${isCompleted ? styles.matchRowStatusFt : ""}`}
        >
          {statusColumnLabel(fixture, isLive, isCompleted)}
        </span>

        <span className={styles.matchRowMain}>
          <span className={styles.matchRowHomeName}>
            {home?.name ?? fixture.homeTeamId}
          </span>
          <span className={styles.matchRowFlag}>
            {home ? <TeamFlag teamId={home.id} size={22} /> : null}
          </span>
          <span className={`${styles.matchRowScore} ${isLive ? styles.matchRowScoreLive : ""}`}>
            {centreLabel}
          </span>
          <span className={styles.matchRowFlag}>
            {away ? <TeamFlag teamId={away.id} size={22} /> : null}
          </span>
          <span className={styles.matchRowAwayName}>
            {away?.name ?? fixture.awayTeamId}
          </span>
        </span>

        <span className={styles.matchRowMore} aria-hidden="true">
          ...
        </span>
      </Link>
    </li>
  );
}