import { WC26_GROUPS, groupLabel } from "@/lib/wc26-groups";
import PlaceholderPanel from "./PlaceholderPanel";
import styles from "./wc26.module.css";

const STANDINGS_COLUMNS = ["Team", "P", "W", "D", "L", "GF", "GA", "GD", "Pts"];

export default function StandingsSection() {
  return (
    <section aria-labelledby="standings-section-heading">
      <h2 id="standings-section-heading" className={styles.sectionTitle}>
        Group standings
      </h2>

      <PlaceholderPanel
        title="Tournament-wide standings"
        description="Live tables for all twelve groups will appear here. Standings are not calculated yet — no data connected."
      />

      <div className={styles.standingsGrid}>
        {WC26_GROUPS.map((groupId) => (
          <div key={groupId} className={styles.standingsShell}>
            <div className={styles.standingsHead}>{groupLabel(groupId)}</div>
            <table className={styles.standingsTable}>
              <thead>
                <tr>
                  {STANDINGS_COLUMNS.map((col) => (
                    <th key={col} scope="col">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
            </table>
            <p className={styles.standingsEmpty}>No data yet</p>
          </div>
        ))}
      </div>
    </section>
  );
}
