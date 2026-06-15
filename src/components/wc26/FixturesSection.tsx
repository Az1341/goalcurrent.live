import { WC26_FIXTURES, WC26_TOURNAMENT } from "@/data/wc26";
import FixturesList from "./FixturesList";
import styles from "./wc26.module.css";

export default function FixturesSection() {
  return (
    <section aria-labelledby="fixtures-section-heading">
      <h2 id="fixtures-section-heading" className={styles.sectionTitle}>
        Match schedule
      </h2>

      <p className={styles.phaseNote}>
        Showing {WC26_FIXTURES.length} sample group-stage fixtures from local
        data. Full {WC26_TOURNAMENT.fixtureCount}-match slate coming in a later
        phase — no scores or results.
      </p>

      <div className={styles.shellCard}>
        <div className={styles.shellHead}>Scheduled fixtures</div>
        <div className={styles.shellBody}>
          <FixturesList fixtures={WC26_FIXTURES} />
        </div>
      </div>
    </section>
  );
}
