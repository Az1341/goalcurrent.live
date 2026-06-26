import type { BracketColumnView } from "@/lib/wc26/bracket-view";
import BracketMatchCard from "./BracketMatchCard";
import styles from "./bracket.module.css";

type BracketRoundColumnProps = {
  column: BracketColumnView;
  roundLabel: string;
  compact?: boolean;
  viewMatchCenterLabel: string;
  liveLabel: string;
};

export default function BracketRoundColumn({
  column,
  roundLabel,
  compact = false,
  viewMatchCenterLabel,
  liveLabel,
}: BracketRoundColumnProps) {
  return (
    <section
      className={styles.roundColumn}
      aria-label={roundLabel}
    >
      <h2 className={styles.roundLabel}>{roundLabel}</h2>
      <div className={styles.matchList}>
        {column.matches.map((match) => (
          <BracketMatchCard
            key={match.matchNumber}
            match={match}
            size={compact ? "compact" : "default"}
            viewMatchCenterLabel={viewMatchCenterLabel}
            liveLabel={liveLabel}
          />
        ))}
      </div>
    </section>
  );
}
