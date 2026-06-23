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
  formatTickerMatchTitle,
  formatTickerTeamName,
  getRibbonVisibleLimit,
} from "@/lib/wc26-ticker-names";
import { useEffectiveFixtures } from "@/lib/use-effective-fixtures";
import styles from "./live-ribbon.module.css";

const FIXTURES_HREF = "/worldcup2026/fixtures";
const MOBILE_MAX_WIDTH = 767;

function formatScore(match: HomepageMatchView): string | null {
  if (!match.score) {
    return null;
  }
  return `${match.score.home}–${match.score.away}`;
}

function tickerStatusClass(matchClass: HomepageMatchView["matchClass"]) {
  if (matchClass === "live") return styles.liveMatchStatusLive;
  if (matchClass === "ft") return styles.liveMatchStatusFt;
  return styles.liveMatchStatusUpcoming;
}

function renderMatchItem(match: HomepageMatchView, keySuffix = "") {
  const score = formatScore(match);
  const homeName = formatTickerTeamName(match.homeTeamId, match.homeName);
  const awayName = formatTickerTeamName(match.awayTeamId, match.awayName);
  const isLive = match.matchClass === "live";
  const isFt = match.matchClass === "ft";
  const statusLabel = isLive
    ? match.elapsed != null
      ? `LIVE ${match.elapsed}'`
      : "LIVE"
    : isFt
      ? "FT"
      : match.statusLabel;
  const matchTitle = formatTickerMatchTitle(
    match.homeName,
    match.awayName,
    score,
  );

  return (
    <li
      key={`${match.fixtureId}${keySuffix}`}
      className={styles.liveRibbonItem}
    >
      <Link
        href={matchHref(match.fixtureId)}
        className={styles.liveMatch}
        title={matchTitle}
      >
        <TeamFlag teamId={match.homeTeamId} size={16} />
        <span className={styles.liveMatchTeams}>{homeName}</span>
        <span
          className={`${styles.liveMatchScore} ${tickerStatusClass(match.matchClass)}`}
        >
          {score ?? (isLive ? "LIVE" : "vs")}
        </span>
        <span className={styles.liveMatchTeams}>{awayName}</span>
        <TeamFlag teamId={match.awayTeamId} size={16} />
        <span
          className={`${styles.liveMatchStatus} ${tickerStatusClass(match.matchClass)}`}
        >
          {statusLabel}
        </span>
      </Link>
    </li>
  );
}

type LiveRibbonProps = {
  embedded?: boolean;
};

export default function LiveRibbon({ embedded = false }: LiveRibbonProps) {
  const fixtures = useEffectiveFixtures();
  const allMatches = selectRibbonFixtures(fixtures);
  const [isMobile, setIsMobile] = useState(false);
  const [visibleLimit, setVisibleLimit] = useState(3);

  useEffect(() => {
    function syncLayout() {
      const width = window.innerWidth;
      setIsMobile(width <= MOBILE_MAX_WIDTH);
      setVisibleLimit(getRibbonVisibleLimit(width));
    }

    syncLayout();
    window.addEventListener("resize", syncLayout);
    return () => window.removeEventListener("resize", syncLayout);
  }, []);

  if (allMatches.length === 0) {
    return (
      <div
        className={`${styles.liveRibbon} ${embedded ? styles.liveRibbonEmbedded : ""}`}
        role="region"
        aria-label="Live scores ticker"
      >
        <span className={styles.liveRibbonLabel}>WORLD CUP 2026</span>
        <span className={styles.liveRibbonMessage}>
          Fixtures from local schedule — scores when API sync is active
        </span>
      </div>
    );
  }

  const hasLive = allMatches.some((match) => match.matchClass === "live");
  const desktopMatches = allMatches.slice(0, visibleLimit);
  const desktopTrackMatches = [...desktopMatches, ...desktopMatches];
  const hiddenCount = Math.max(0, allMatches.length - visibleLimit);

  return (
    <div
      className={`${styles.liveRibbon} ${embedded ? styles.liveRibbonEmbedded : ""}`}
      role="region"
      aria-label="Live scores ticker"
    >
      <span className={styles.liveRibbonLabel}>
        {hasLive ? <span className={styles.liveDot} aria-hidden="true" /> : null}
        {hasLive ? "LIVE NOW" : "LATEST RESULTS"}
      </span>
      <div className={styles.tickerScroll}>
        <ul
          className={`${styles.tickerTrack} ${styles.liveRibbonList}`}
          aria-label={hasLive ? "Live matches" : "Latest results"}
        >
          {isMobile
            ? allMatches.map((match) => renderMatchItem(match))
            : desktopTrackMatches.map((match, index) =>
                renderMatchItem(match, `-loop-${index}`),
              )}
          {!isMobile && hiddenCount > 0 ? (
            <li className={styles.liveRibbonItem}>
              <Link
                href={FIXTURES_HREF}
                className={styles.liveRibbonMore}
                aria-label={`View ${hiddenCount} more matches`}
              >
                +{hiddenCount} More Matches
              </Link>
            </li>
          ) : null}
          {isMobile ? (
            <li className={styles.liveRibbonItem}>
              <Link
                href={FIXTURES_HREF}
                className={styles.liveRibbonMore}
                aria-label="View all fixtures"
              >
                ALL FIXTURES
              </Link>
            </li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}
