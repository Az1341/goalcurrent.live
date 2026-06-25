import type { BracketRoundView } from "@/lib/wc26-standings";
import BracketMatch from "@/components/wc26/BracketMatch";
import styles from "./wc26.module.css";

type BracketRoundProps = {
  round: BracketRoundView;
};

export default function BracketRound({ round }: BracketRoundProps) {
  return (
    <section className={styles.bracketRoundBlock} aria-label={round.round}>
      <h3 className={styles.bracketRoundLabel}>{round.round}</h3>
      <div className={styles.bracketRoundGrid}>
        {round.matches.map((match) => (
          <BracketMatch key={match.matchNumber} match={match} />
        ))}
      </div>
    </section>
  );
}