"use client";

import { Link } from "@/i18n/navigation";
import StandingsTable from "@/components/wc26/StandingsTable";
import { useWc26Standings } from "@/lib/use-wc26-standings";
import { getWc26FinalQualificationMap } from "@/lib/wc26-final-standings";
import styles from "./wc26.module.css";

export default function StandingsSectionContent() {
  const standings = useWc26Standings();

  return (
    <section aria-labelledby="standings-section-heading">
      <h2 id="standings-section-heading" className={styles.sectionTitle}>
        Group standings
      </h2>

      <p className={styles.phaseNote}>
        Final group stage standings — all 48 teams, group stage complete.{" "}
        <Link href="/worldcup2026/bracket#top-scorers">
          See top scorers on the Bracket page →
        </Link>
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
