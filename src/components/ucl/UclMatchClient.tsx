"use client";

import { Link } from "@/i18n/navigation";
import { KickoffTime } from "@/components/KickoffTime";
import { PlTeamBadge } from "@/components/pl/PlShared";
import { useLiveUclFixtures } from "@/lib/client/useLiveUclFixtures";
import { formatMatchdayScore } from "@/lib/home/matchday";
import { UCL_DISPLAY_NAME, UCL_HUB_PATH, UCL_SEASON_LABEL } from "@/lib/ucl/constants";
import styles from "@/components/unl/UnlHub.module.css";

export default function UclMatchClient({ fixtureId }: { fixtureId: number }) {
  const { data, error, isLoading } = useLiveUclFixtures();
  const fixture = data?.fixtures?.find((row) => row.fixtureId === fixtureId);

  if (isLoading && !data) {
    return (
      <main className={styles.unlPage} data-gc-ucl-match-loading>
        <p>Loading match...</p>
      </main>
    );
  }

  if (error && !fixture) {
    return (
      <main className={styles.unlPage} data-gc-ucl-match-error>
        <Link href={UCL_HUB_PATH} className={styles.backLink}>
          {"\u2190"} {UCL_DISPLAY_NAME}
        </Link>
        <p>Unable to load Champions League fixtures.</p>
      </main>
    );
  }

  if (!fixture) {
    return (
      <main className={styles.unlPage} data-gc-ucl-match-missing>
        <Link href={UCL_HUB_PATH} className={styles.backLink}>
          {"\u2190"} {UCL_DISPLAY_NAME}
        </Link>
        <h1 className={styles.heroTitle}>Match not found</h1>
        <p className={styles.panelText}>
          No Champions League fixture with id {fixtureId} is available in the
          current fixtures feed.
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
    <main className={styles.unlPage} data-gc-ucl-match={fixture.fixtureId}>
      <Link href={UCL_HUB_PATH} className={styles.backLink}>
        {"\u2190"} Champions League {UCL_SEASON_LABEL}
      </Link>
      <header className={styles.hero}>
        <p className={styles.seasonBadge}>CHAMPIONS LEAGUE {UCL_SEASON_LABEL}</p>
        <h1 className={styles.heroTitle}>
          {fixture.homeTeamName} vs {fixture.awayTeamName}
        </h1>
        <p className={styles.heroSub}>
          {UCL_DISPLAY_NAME}
          {fixture.round ? ` \u00b7 ${fixture.round}` : ""}
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
          <Link href={`${UCL_HUB_PATH}#ucl-fixtures`}>
            View all Champions League fixtures {"\u2192"}
          </Link>
        </p>
      </section>
    </main>
  );
}
