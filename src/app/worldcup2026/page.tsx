import Link from "next/link";
import type { Metadata } from "next";
import Wc26Breadcrumb from "@/components/wc26/Wc26Breadcrumb";
import { GROUPS_HUB_HREF } from "@/lib/wc26-groups";
import styles from "@/components/wc26/wc26.module.css";

export const metadata: Metadata = {
  title: "World Cup 2026",
  description:
    "FIFA World Cup 2026 hub — groups, fixtures, teams and standings on GoalCurrent.online.",
};

const HUB_SECTIONS = [
  {
    href: GROUPS_HUB_HREF,
    label: "Groups",
    description: "All 12 groups (A–L) for the 48-team tournament.",
  },
];

export default function WorldCupHubPage() {
  return (
    <main className={styles.wc26Content}>
      <Wc26Breadcrumb items={[{ label: "World Cup 2026" }]} />

      <h1 className={styles.pageTitle}>
        FIFA World Cup <span>2026</span>
      </h1>
      <p className={styles.pageIntro}>
        USA · Mexico · Canada · 11 June – 19 July 2026. Explore tournament
        sections below — content will be added in later phases.
      </p>

      <h2 className={styles.sectionTitle}>Sections</h2>
      <div className={styles.hubGrid}>
        {HUB_SECTIONS.map(({ href, label, description }) => (
          <Link key={href} href={href} className={styles.hubCard}>
            <div className={styles.hubCardLabel}>{label}</div>
            <p className={styles.hubCardDesc}>{description}</p>
            <span className={styles.hubCardLink}>Open →</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
