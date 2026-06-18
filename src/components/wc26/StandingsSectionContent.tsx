"use client";

import StandingsTable from "@/components/wc26/StandingsTable";
import Wc26TopScorers from "@/components/wc26/Wc26TopScorers";
import { useWc26Standings } from "@/lib/use-wc26-standings";
import { WC26_QUALIFYING_SPOTS } from "@/lib/wc26-groups";
import styles from "./wc26.module.css";

export default function StandingsSectionContent() {
  const standings = useWc26Standings();

  return (
    <section aria-labelledby="standings-section-heading">
      <h2 id="standings-section-heading" className={styles.sectionTitle}>
        Group standings
      </h2>

      <p className={styles.phaseNote}>
        Tables calculated from completed group-stage results in the live overlay.
        Top {WC26_QUALIFYING_SPOTS} in each group are highlighted for
        qualification.
      </p>

      <div className={styles.standingsGrid}>
        {standings.map((table) => (
          <StandingsTable
            key={table.groupId}
            standings={table}
            title={`Group ${table.groupId.toUpperCase()}`}
            qualifyingSpots={WC26_QUALIFYING_SPOTS}
          />
        ))}
      </div>

      <Wc26TopScorers />
    </section>
  );
}
