"use client";

import StandingsTable from "@/components/wc26/StandingsTable";
import { groupLabel, type Wc26GroupId } from "@/data/wc26";
import { WC26_QUALIFYING_SPOTS } from "@/lib/wc26-groups";
import { useWc26GroupStandings } from "@/lib/use-wc26-standings";
import styles from "./wc26.module.css";

type GroupStandingsSectionProps = {
  groupId: Wc26GroupId;
};

export default function GroupStandingsSection({
  groupId,
}: GroupStandingsSectionProps) {
  const title = groupLabel(groupId);
  const standings = useWc26GroupStandings(groupId);

  return (
    <section aria-labelledby="standings-heading">
      <h2 id="standings-heading" className={styles.sectionTitle}>
        Standings
      </h2>
      <p className={styles.phaseNote}>
        Calculated from completed group matches. Top {WC26_QUALIFYING_SPOTS}{" "}
        highlighted for qualification.
      </p>
      <StandingsTable
        standings={standings}
        title={`${title} table`}
        qualifyingSpots={WC26_QUALIFYING_SPOTS}
      />
    </section>
  );
}
