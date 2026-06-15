import { WC26_PLACEHOLDER_STANDINGS } from "@/data/wc26";
import PlaceholderPanel from "./PlaceholderPanel";
import StandingsTable from "./StandingsTable";
import styles from "./wc26.module.css";

export default function StandingsSection() {
  return (
    <section aria-labelledby="standings-section-heading">
      <h2 id="standings-section-heading" className={styles.sectionTitle}>
        Group standings
      </h2>

      <PlaceholderPanel
        title="Standings calculation pending"
        description="Tables below use zeroed placeholder rows from local data. Standings will be calculated in a later phase — no live updates or results yet."
      />

      <div className={styles.standingsGrid}>
        {WC26_PLACEHOLDER_STANDINGS.map((standings) => (
          <StandingsTable
            key={standings.groupId}
            standings={standings}
            title={`Group ${standings.groupId.toUpperCase()}`}
          />
        ))}
      </div>
    </section>
  );
}
