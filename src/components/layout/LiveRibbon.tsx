"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TeamFlag from "@/components/TeamFlag";
import { matchHref } from "@/lib/wc26-match";
import {
  selectRibbonFixtures,
  type HomepageMatchView,
} from "@/lib/wc26-live";
import {
  formatTickerTeamName,
  getRibbonVisibleLimit,
} from "@/lib/wc26-ticker-names";
import { useEffectiveFixtures } from "@/lib/use-effective-fixtures";
import styles from "./master-chrome.module.css";

const FIXTURES_HREF = "/worldcup2026/fixtures";

function formatScore(match: HomepageMatchView): string | null {
  if (!match.score) {
    return null;
  }
  return `${match.score.home}–${match.score.away}`;
}

export default function LiveRibbon() {
  const fixtures = useEffectiveFixtures();
  const allMatches = selectRibbonFixtures(fixtures);
  const [visibleLimit, setVisibleLimit] = useState(3);

  useEffect(() => {
    function syncLimit() {
      setVisibleLimit(getRibbonVisibleLimit(window.innerWidth));
    }

    syncLimit();
    window.addEventListener("resize", syncLimit);
    return () => window.removeEventListener("resize", syncLimit);
  }, []);

  if (allMatches.length === 0) {
    return (
      <div className={styles.liveRibbon} role="region" aria-label="Live scores ticker">
        <span className={styles.liveRibbonLabel}>WORLD CUP 2026</span>
        <span className={styles.liveRibbonMessage}>
          Fixtures from local schedule — scores when API sync is active
        </span>
      </div>
    );
  }

  const hasLive = allMatches.some((match) => match.matchClass === "live");
  const visibleMatches = allMatches.slice(0, visibleLimit);
  const hiddenCount = Math.max(0, allMatches.length - visibleLimit);

  return (
    <div className={styles.liveRibbon} role="region" aria-label="Live scores ticker">
      <span className={styles.liveRibbonLabel}>
        {hasLive ? <span className={styles.liveDot} aria-hidden="true" /> : null}
        {hasLive ? "LIVE NOW" : "LATEST RESULTS"}
      </span>
      <ul className={styles.liveRibbonList}>
        {visibleMatches.map((match) => {
          const score = formatScore(match);
          const homeName = formatTickerTeamName(match.homeTeamId, match.homeName);
          const awayName = formatTickerTeamName(match.awayTeamId, match.awayName);
          const statusSuffix =
            match.matchClass === "live"
              ? ""
              : match.matchClass === "ft"
                ? " FT"
                : ` · ${match.statusLabel}`;

          return (
            <li key={match.fixtureId} className={styles.liveRibbonItem}>
              <Link href={matchHref(match.fixtureId)} className={styles.liveMatch}>
                <TeamFlag teamId={match.homeTeamId} size={16} />
                <span className={styles.liveMatchTeams}>
                  {homeName}
                  {score ? ` ${score} ` : " vs "}
                  {awayName}
                </span>
                <TeamFlag teamId={match.awayTeamId} size={16} />
                {statusSuffix ? (
                  <span className={styles.liveMatchStatus}>{statusSuffix}</span>
                ) : null}
              </Link>
            </li>
          );
        })}
        {hiddenCount > 0 ? (
          <li className={styles.liveRibbonItem}>
            <Link
              href={FIXTURES_HREF}
              className={styles.liveRibbonMore}
              aria-label={`View ${hiddenCount} more matches`}
            >
              +{hiddenCount} MORE MATCHES
            </Link>
          </li>
        ) : null}
      </ul>
    </div>
  );
}
