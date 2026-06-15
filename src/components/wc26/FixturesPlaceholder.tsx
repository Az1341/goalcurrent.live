import PlaceholderPanel from "./PlaceholderPanel";
import styles from "./wc26.module.css";

export default function FixturesPlaceholder() {
  return (
    <section aria-labelledby="fixtures-heading">
      <h2 id="fixtures-heading" className={styles.sectionTitle}>
        Fixtures
      </h2>
      <PlaceholderPanel
        title="Group fixtures"
        description="Match fixtures for this group will be listed here in a later phase. No fixture data connected yet."
      />
    </section>
  );
}
