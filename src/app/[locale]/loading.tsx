import styles from "./page.module.css";

export default function LocaleLoading() {
  return (
    <div className={styles.page} aria-busy="true" aria-live="polite">
      <div className={styles.sectionBlock} style={{ padding: "48px 16px", textAlign: "center" }}>
        <p style={{ color: "var(--gc-text-muted, #64748b)", margin: 0 }}>Loading…</p>
      </div>
    </div>
  );
}