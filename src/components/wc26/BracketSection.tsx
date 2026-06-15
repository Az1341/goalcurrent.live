import PlaceholderPanel from "./PlaceholderPanel";
import styles from "./wc26.module.css";

const KNOCKOUT_ROUNDS = [
  "Round of 32",
  "Round of 16",
  "Quarter-finals",
  "Semi-finals",
  "Third place",
  "Final",
];

export default function BracketSection() {
  return (
    <section aria-labelledby="bracket-section-heading">
      <h2 id="bracket-section-heading" className={styles.sectionTitle}>
        Knockout bracket
      </h2>

      <PlaceholderPanel
        title="Tournament bracket"
        description="Interactive knockout bracket from the Round of 32 to the final. Match pairings and results will be added in a later phase."
      />

      <div className={styles.bracketShell}>
        <div className={styles.shellHead}>Knockout stage</div>
        <div className={styles.bracketRounds}>
          {KNOCKOUT_ROUNDS.map((round) => (
            <div key={round} className={styles.bracketRound}>
              <div className={styles.bracketRoundLabel}>{round}</div>
              <div className={styles.bracketSlot}>TBD vs TBD</div>
              <div className={styles.bracketSlot}>TBD vs TBD</div>
            </div>
          ))}
        </div>
        <p className={styles.standingsEmpty}>
          Bracket pairings are placeholders only — no match data connected yet.
        </p>
      </div>
    </section>
  );
}
