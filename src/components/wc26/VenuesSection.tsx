import PlaceholderPanel from "./PlaceholderPanel";
import styles from "./wc26.module.css";

const VENUE_SLOTS = 16;

export default function VenuesSection() {
  return (
    <section aria-labelledby="venues-section-heading">
      <h2 id="venues-section-heading" className={styles.sectionTitle}>
        Host stadiums
      </h2>

      <PlaceholderPanel
        title={`${VENUE_SLOTS} venues`}
        description="Stadium guides across USA, Mexico and Canada — capacity, city, host matches and maps. Venue data will be added in a later phase."
      />

      <div className={styles.venueGrid}>
        {Array.from({ length: VENUE_SLOTS }, (_, i) => (
          <div key={i} className={styles.venueCard}>
            <div className={styles.venueIcon}>🏟</div>
            <div className={styles.venueLabel}>Venue {i + 1}</div>
            <div className={styles.venueSub}>City · Country</div>
          </div>
        ))}
      </div>
      <p className={styles.gridNote}>
        Placeholder slots only — venue names and details coming in a later phase.
      </p>
    </section>
  );
}
