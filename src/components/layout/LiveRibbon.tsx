import type { PlaceholderMatch } from "@/data/placeholder-matches";
import TeamFlag from "@/components/TeamFlag";
import styles from "./master-chrome.module.css";

type LiveRibbonProps = {
  matches: readonly PlaceholderMatch[];
};

function formatScore(match: PlaceholderMatch) {
  const { homeGoals, awayGoals } = match;
  if (homeGoals == null || awayGoals == null) return null;
  return `${homeGoals}–${awayGoals}`;
}

export default function LiveRibbon({ matches }: LiveRibbonProps) {
  const hasLive = matches.some((match) => match.status === "live");

  return (
    <div className={styles.liveRibbon} role="region" aria-label="Live scores ticker">
      <span className={styles.liveRibbonLabel}>
        {hasLive && <span className={styles.liveDot} aria-hidden="true" />}
        {hasLive ? "LIVE NOW" : "RESULTS"}
      </span>
      {matches.map((match, index) => {
        const score = formatScore(match);
        const status =
          match.status === "live"
            ? ""
            : match.status === "ft"
              ? " FT"
              : ` · ${match.statusLabel}`;

        return (
          <span key={match.id} className={styles.liveItem}>
            {index > 0 ? " • " : ""}
            <span className={styles.liveMatch}>
              <TeamFlag teamName={match.home} size={16} />
              <span className={styles.liveMatchTeams}>
                {match.home}
                {score ? ` ${score} ` : " vs "}
                {match.away}
              </span>
              <TeamFlag teamName={match.away} size={16} />
              {status ? <span className={styles.liveMatchStatus}>{status}</span> : null}
            </span>
          </span>
        );
      })}
    </div>
  );
}
