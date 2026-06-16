"use client";

import Link from "next/link";
import TeamFlag from "@/components/TeamFlag";
import MatchDetailLink from "@/components/match/MatchDetailLink";
import { matchHref } from "@/lib/wc26-match";
import {
  selectRibbonFixtures,
  type HomepageMatchView,
} from "@/lib/wc26-live";
import { useEffectiveFixtures } from "@/lib/use-effective-fixtures";
import styles from "./master-chrome.module.css";

function formatScore(match: HomepageMatchView): string | null {
  if (!match.score) {
    return null;
  }
  return `${match.score.home}–${match.score.away}`;
}

export default function LiveRibbon() {
  const fixtures = useEffectiveFixtures();
  const matches = selectRibbonFixtures(fixtures);
  const hasLive = matches.some((match) => match.matchClass === "live");

  if (matches.length === 0) {
    return (
      <div className={styles.liveRibbon} role="region" aria-label="Live scores ticker">
        <span className={styles.liveRibbonLabel}>WORLD CUP 2026</span>
        <span className={styles.liveItem}>Fixtures from local schedule — scores when API sync is active</span>
      </div>
    );
  }

  return (
    <div className={styles.liveRibbon} role="region" aria-label="Live scores ticker">
      <span className={styles.liveRibbonLabel}>
        {hasLive && <span className={styles.liveDot} aria-hidden="true" />}
        {hasLive ? "LIVE NOW" : "RESULTS"}
      </span>
      {matches.map((match, index) => {
        const score = formatScore(match);
        const statusSuffix =
          match.matchClass === "live"
            ? ""
            : match.matchClass === "ft"
              ? " FT"
              : ` · ${match.statusLabel}`;

        return (
          <span key={match.fixtureId} className={styles.liveItem}>
            {index > 0 ? " • " : ""}
            <Link href={matchHref(match.fixtureId)} className={styles.liveMatch}>
              <TeamFlag teamId={match.homeTeamId} size={16} />
              <span className={styles.liveMatchTeams}>
                {match.homeName}
                {score ? ` ${score} ` : " vs "}
                {match.awayName}
              </span>
              <TeamFlag teamId={match.awayTeamId} size={16} />
              {statusSuffix ? (
                <span className={styles.liveMatchStatus}>{statusSuffix}</span>
              ) : null}
            </Link>
          </span>
        );
      })}
    </div>
  );
}
