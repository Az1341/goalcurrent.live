"use client";

import { useMemo } from "react";
import BracketRound from "@/components/wc26/BracketRound";
import { useEffectiveFixtures } from "@/lib/use-effective-fixtures";
import {
  areAllGroupStagesComplete,
  buildKnockoutBracketRounds,
  computeRankedThirdPlaceTeams,
} from "@/lib/wc26-standings";
import styles from "./wc26.module.css";

export default function BracketSection() {
  const fixtures = useEffectiveFixtures();
  const rounds = useMemo(
    () => buildKnockoutBracketRounds(fixtures),
    [fixtures],
  );
  const allGroupsComplete = useMemo(
    () => areAllGroupStagesComplete(fixtures),
    [fixtures],
  );
  const rankedThirds = useMemo(
    () => computeRankedThirdPlaceTeams(fixtures),
    [fixtures],
  );

  return (
    <section aria-labelledby="bracket-section-heading">
      <h2 id="bracket-section-heading" className={styles.sectionTitle}>
        Knockout bracket
      </h2>

      <p className={styles.phaseNote}>
        Round of 32 slots fill from final group standings as matches finish. Later
        rounds advance automatically when knockout results are available from the
        live overlay.
      </p>

      {rounds.map((round) => (
        <div key={round.round} className={styles.bracketShell}>
          <BracketRound round={round} />
        </div>
      ))}

      {allGroupsComplete ? (
        <div className={styles.bracketShell}>
          <div className={styles.shellHead}>Best third-placed teams</div>
          <ul className={styles.bracketThirdList}>
            {rankedThirds.slice(0, 8).map((entry, index) => (
              <li key={entry.groupId}>
                {index + 1}. Group {entry.groupId.toUpperCase()} —{" "}
                {entry.row.points} pts · GD {entry.row.goalDifference}
              </li>
            ))}
          </ul>
          <p className={styles.bracketGroupBNote}>
            Third-place slot assignments follow FIFA&apos;s predetermined scenario
            matrix once all twelve groups are complete.
          </p>
        </div>
      ) : (
        <p className={styles.standingsEmpty}>
          Third-place qualifiers are listed after every group-stage match is
          full-time.
        </p>
      )}
    </section>
  );
}
