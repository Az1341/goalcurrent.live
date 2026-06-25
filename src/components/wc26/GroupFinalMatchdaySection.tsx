"use client";

import type { Wc26GroupId } from "@/types/group";
import type { EffectiveFixture } from "@/lib/wc26-fixture-overlay";
import MatchCardFinalRound from "@/components/wc26/MatchCardFinalRound";
import styles from "./wc26.module.css";

type GroupFinalMatchdaySectionProps = {
  groupId: Wc26GroupId;
  fixtures: readonly [EffectiveFixture, EffectiveFixture];
  title: string;
};

/** Side-by-side (desktop) or stacked (mobile) final matchday decider board. */
export default function GroupFinalMatchdaySection({
  groupId,
  fixtures,
  title,
}: GroupFinalMatchdaySectionProps) {
  return (
    <section
      className={styles.groupFinalMatchday}
      aria-labelledby={`group-final-matchday-${groupId}`}
    >
      <h2 id={`group-final-matchday-${groupId}`} className={styles.sectionTitle}>
        {title}
      </h2>
      <p className={styles.groupFinalMatchdayNote}>
        Both group fixtures kick off simultaneously on the final matchday. Scores
        and standings update in real time as results come in.
      </p>
      <div className={styles.finalRoundGrid}>
        {fixtures.map((fixture) => (
          <MatchCardFinalRound key={fixture.id} fixture={fixture} />
        ))}
      </div>
    </section>
  );
}
