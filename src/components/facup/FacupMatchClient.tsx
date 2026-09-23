"use client";

import { Link } from "@/i18n/navigation";
import { KickoffTime } from "@/components/KickoffTime";
import { PlTeamBadge } from "@/components/pl/PlShared";
import { useLiveFacupFixtures } from "@/lib/client/useLiveFacupFixtures";
import { formatMatchdayScore } from "@/lib/home/matchday";
import {
  FACUP_DISPLAY_NAME,
  FACUP_HUB_PATH,
  FACUP_SEASON_LABEL,
} from "@/lib/facup/constants";
import styles from "@/components/unl/UnlHub.module.css";

export default function FacupMatchClient({ fixtureId }: { fixtureId: number }) {
  const { data, error, isLoading } = useLiveFacupFixtures();
  const fixture = data?.fixtures?.find((row) => row.fixtureId === fixtureId);

  if (isLoading && !data) {
    return (
      <main className={styles.unlPage} data-gc-facup-match-loading>
        <p>Loading match...</p>
      </main>
    );
  }

  if (error && !fixture) {
    return (
      <main className={styles.unlPage} data-gc-facup-match-error>
        <Link href={FACUP_HUB_PATH} className={styles.backLink}>
          {"\u2190"} {FACUP_DISPLAY_NAME}
        </Link>
        <p>Unable to load FA Cup fixtures.</p>
      </main>
    );
  }

  if (!fixture) {
    return (
      <main className={styles.unlPage} data-gc-facup-match-missing>
        <Link href={FACUP_HUB_PATH} className={styles.backLink}>
          {"\u2190"} {FACUP_DISPLAY_NAME}
        </Link>
        <h1 className={styles.heroTitle}>Match not found</h1>
        <p className={styles.panelText}>
          No FA Cup fixture with id {fixtureId} is available in the current
          fixtures feed.
        </p>
      </main>
    );
  }

  const score = formatMatchdayScore(fixture.homeScore, fixture.awayScore);
  const wantsScore =
    fixture.status === "LIVE" ||
    fixture.status === "FT" ||
    fixture.status === "AET" ||
    fixture.status === "PEN" ||
    score.known;

  return (
    <main className={styles.unlPage} data-gc-facup-match={fixture.fixtureId}>
      <Link href={FACUP_HUB_PATH} className={styles.backLink}>
        {"\u2190"} FA Cup {FACUP_SEASON_LABEL}
      </Link>
      <header className={styles.hero}>
        <p className={styles.seasonBadge}>FA CUP {FACUP_SEASON_LABEL}</p>
        <h1 className={styles.heroTitle}>
          {fixture.homeTeamName} vs {fixture.awayTeamName}
        </h1>
        <p className={styles.heroSub}>
          {FACUP_DISPLAY_NAME}
          {fixture.roundLabel ? ` \u00b7 ${fixture.roundLabel}` : ""}
        </p>
      </header>
      <section className={styles.card}>
        <div className={styles.metaLine}>
          <span className={styles.statusUpcoming}>{fixture.status}</span>
          <span>
            {fixture.kickoffUtc ? (
              <KickoffTime utcDate={fixture.kickoffUtc} />
            ) : (
              "Kickoff TBC"
            )}
          </span>
        </div>
        <article className={styles.fixtureRow}>
          <div className={styles.team}>
            <PlTeamBadge
              name={fixture.homeTeamName}
              logo={fixture.homeTeamLogo}
              size={28}
            />
            <span className={styles.teamName}>{fixture.homeTeamName}</span>
          </div>
          <div className={styles.scoreBox}>
            {wantsScore && score.known
              ? `${score.home} - ${score.away}`
              : wantsScore
                ? "\u2013 - \u2013"
                : "VS"}
          </div>
          <div className={`${styles.team} ${styles.teamAway}`}>
            <PlTeamBadge
              name={fixture.awayTeamName}
              logo={fixture.awayTeamLogo}
              size={28}
            />
            <span className={styles.teamName}>{fixture.awayTeamName}</span>
          </div>
        </article>
        <p className={styles.panelText} style={{ marginTop: 12 }}>
          <Link href={`${FACUP_HUB_PATH}#facup-fixtures`}>
            View all FA Cup fixtures {"\u2192"}
          </Link>
        </p>
      </section>
    </main>
  );
}
