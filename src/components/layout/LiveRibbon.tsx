import type { PlaceholderMatch } from "@/data/placeholder-matches";
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
  const items = matches.map((match) => {
    const score = formatScore(match);
    const teams = score
      ? `${match.home} ${score} ${match.away}`
      : `${match.home} vs ${match.away}`;
    const status =
      match.status === "live"
        ? ""
        : match.status === "ft"
          ? " FT"
          : ` · ${match.statusLabel}`;
    return {
      id: match.id,
      text: `${teams}${status}`,
      isLive: match.status === "live",
    };
  });

  const hasLive = items.some((item) => item.isLive);

  return (
    <div className={styles.liveRibbon} role="region" aria-label="Live scores ticker">
      <span className={styles.liveRibbonLabel}>
        {hasLive && <span className={styles.liveDot} aria-hidden="true" />}
        {hasLive ? "LIVE NOW" : "RESULTS"}
      </span>
      {items.map((item, index) => (
        <span key={item.id} className={styles.liveItem}>
          {index > 0 ? " • " : ""}
          {item.text}
        </span>
      ))}
    </div>
  );
}
