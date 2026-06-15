import Link from "next/link";
import type { Metadata } from "next";
import Wc26Breadcrumb from "@/components/wc26/Wc26Breadcrumb";
import { WC26_TOURNAMENT } from "@/data/wc26";
import { WC26_SECTIONS } from "@/lib/wc26-sections";
import styles from "@/components/wc26/wc26.module.css";

export const metadata: Metadata = {
  title: "World Cup 2026",
  description:
    "FIFA World Cup 2026 hub — groups, fixtures, teams and standings on GoalCurrent.online.",
};

export default function WorldCupHubPage() {
  const hosts = WC26_TOURNAMENT.hosts.join(" · ");

  return (
    <main className={styles.wc26Content}>
      <Wc26Breadcrumb items={[{ label: "World Cup 2026" }]} />

      <h1 className={styles.pageTitle}>
        FIFA World Cup <span>2026</span>
      </h1>
      <p className={styles.pageIntro}>
        {hosts} · 11 June – 19 July 2026. Explore tournament sections below —
        powered by local typed data, no external APIs.
      </p>

      <div className={styles.hubStats}>
        {[
          [String(WC26_TOURNAMENT.teamCount), "Teams"],
          [String(WC26_TOURNAMENT.fixtureCount), "Matches"],
          [String(WC26_TOURNAMENT.venueCount), "Venues"],
          [String(WC26_TOURNAMENT.groupCount), "Groups"],
        ].map(([num, lbl]) => (
          <div key={lbl} className={styles.hubStatChip}>
            <div className={styles.hubStatNum}>{num}</div>
            <div className={styles.hubStatLbl}>{lbl}</div>
          </div>
        ))}
      </div>

      <h2 className={styles.sectionTitle}>Sections</h2>
      <div className={styles.hubGrid}>
        {WC26_SECTIONS.map(({ href, label, hubDescription }) => (
          <Link key={href} href={href} className={styles.hubCard}>
            <div className={styles.hubCardLabel}>{label}</div>
            <p className={styles.hubCardDesc}>{hubDescription}</p>
            <span className={styles.hubCardLink}>Open →</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
