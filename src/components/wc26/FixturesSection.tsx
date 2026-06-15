import PlaceholderPanel from "./PlaceholderPanel";
import styles from "./wc26.module.css";

export default function FixturesSection() {
  return (
    <section aria-labelledby="fixtures-section-heading">
      <h2 id="fixtures-section-heading" className={styles.sectionTitle}>
        Match schedule
      </h2>

      <div className={styles.shellCard}>
        <div className={styles.shellHead}>Filter by date · stage · group</div>
        <div className={styles.shellBody}>
          <div className={styles.filterRow} aria-hidden="true">
            <span className={styles.filterChip}>All dates</span>
            <span className={styles.filterChip}>Group stage</span>
            <span className={styles.filterChip}>Knockout</span>
          </div>
          <PlaceholderPanel
            title="104 tournament fixtures"
            description="The full World Cup 2026 schedule will be listed here — dates, kickoffs, teams and venues. No fixture data connected yet."
          />
        </div>
      </div>
    </section>
  );
}
