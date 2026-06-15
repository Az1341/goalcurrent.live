import PlaceholderPanel from "./PlaceholderPanel";
import styles from "./wc26.module.css";

const TEAM_SLOTS = 48;

export default function TeamsSection() {
  return (
    <section aria-labelledby="teams-section-heading">
      <h2 id="teams-section-heading" className={styles.sectionTitle}>
        Qualified nations
      </h2>

      <PlaceholderPanel
        title={`${TEAM_SLOTS} teams`}
        description="Profiles for all qualified nations — flags, groups, squads and quick links. Team data will be added in a later phase."
      />

      <div className={styles.tileGrid}>
        {Array.from({ length: TEAM_SLOTS }, (_, i) => (
          <div key={i} className={styles.tileCard}>
            <div className={styles.tileIcon}>⚽</div>
            <div className={styles.tileLabel}>Team {i + 1}</div>
          </div>
        ))}
      </div>
      <p className={styles.gridNote}>
        Placeholder slots only — team names and data coming in a later phase.
      </p>
    </section>
  );
}
