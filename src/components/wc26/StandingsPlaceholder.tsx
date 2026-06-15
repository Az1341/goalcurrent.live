import PlaceholderPanel from "./PlaceholderPanel";
import styles from "./wc26.module.css";

const STANDINGS_COLUMNS = ["Team", "P", "W", "D", "L", "GF", "GA", "GD", "Pts"];

export default function StandingsPlaceholder() {
  return (
    <section aria-labelledby="standings-heading">
      <h2 id="standings-heading" className={styles.sectionTitle}>
        Standings
      </h2>
      <div className={styles.standingsShell}>
        <div className={styles.standingsHead}>Group standings</div>
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
        <p className={styles.standingsEmpty}>
          Standings will appear here in a later phase. No data connected yet.
        </p>
      </div>
    </section>
  );
}
