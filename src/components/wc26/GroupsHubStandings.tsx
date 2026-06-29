"use client";

import StandingsTable from "@/components/wc26/StandingsTable";
import { useWc26Standings } from "@/lib/use-wc26-standings";
import { getWc26FinalQualificationMap } from "@/lib/wc26-final-standings";
import styles from "./wc26.module.css";

export default function GroupsHubStandings() {
  const standings = useWc26Standings();

  return (
    <section aria-labelledby="groups-hub-standings-heading">
      <h2 id="groups-hub-standings-heading" className={styles.sectionTitle}>
        Final group standings
      </h2>
      <p className={styles.phaseNote}>
        Group stage complete — final tables for all twelve groups (A–L).
      </p>
      <div className={styles.standingsGrid}>
        {standings.map((table) => (
          <StandingsTable
            key={table.groupId}
            standings={table}
            title={`Group ${table.groupId.toUpperCase()}`}
            groupComplete
            qualificationByTeamId={getWc26FinalQualificationMap(table.groupId)}
          />
        ))}
      </div>
    </section>
  );
}
