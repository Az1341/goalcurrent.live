import type { BracketGridView } from "@/lib/wc26/bracket-view";
import BracketRoundColumn from "./BracketRoundColumn";
import styles from "./bracket.module.css";

type BracketGridProps = {
  grid: BracketGridView;
  roundLabels: Record<string, string>;
  viewMatchCenterLabel: string;
  liveLabel: string;
};

const COMPACT_ROUNDS = new Set(["qf", "sf"]);

export default function BracketGrid({
  grid,
  roundLabels,
  viewMatchCenterLabel,
  liveLabel,
}: BracketGridProps) {
  return (
    <div className={styles.gridScroll}>
      <div className={styles.bracketGrid}>
        {grid.columns.map((column) => (
          <BracketRoundColumn
            key={column.roundKey}
            column={column}
            roundLabel={roundLabels[column.roundKey] ?? column.roundLabel}
            compact={COMPACT_ROUNDS.has(column.roundKey)}
            viewMatchCenterLabel={viewMatchCenterLabel}
            liveLabel={liveLabel}
          />
        ))}
      </div>
    </div>
  );
}
