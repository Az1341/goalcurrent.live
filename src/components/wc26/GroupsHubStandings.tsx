"use client";

import StandingsTable from "@/components/wc26/StandingsTable";
import { useWc26Standings } from "@/lib/use-wc26-standings";
import { isGroupComplete } from "@/lib/wc26-standings";
import { useEffectiveFixtures } from "@/lib/use-effective-fixtures";
import { WC26_QUALIFYING_SPOTS } from "@/lib/wc26-groups";
import styles from "./wc26.module.css";

export default function GroupsHubStandings() {
  const standings = useWc26Standings();
  const fixtures = useEffectiveFixtures();

  return (
    <section aria-labelledby="groups-hub-standings-heading">
      <h2 id="groups-hub-standings-heading" className={styles.sectionTitle}>
        Live group standings
      </h2>
      <p className={styles.phaseNote}>
        All twelve groups update automatically when results enter the overlay.
      </p>
      <div className={styles.standingsGrid}>
        {standings.map((table) => (
          <StandingsTable
            key={table.groupId}
            standings={table}
            title={`Group ${table.groupId.toUpperCase()}`}
            qualifyingSpots={WC26_QUALIFYING_SPOTS}
            groupComplete={isGroupComplete(table.groupId, fixtures)}
          />
        ))}
      </div>
    </section>
  );
}
