"use client";

import { Link } from "@/i18n/navigation";
import styles from "./bracket.module.css";

type BracketPageBandProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  note: string;
  tabs: {
    bracket: string;
    schedule: string;
    results: string;
    groups: string;
    stats: string;
  };
};

const TAB_LINKS = [
  { key: "bracket" as const, href: "/worldcup2026/bracket", active: true },
  { key: "schedule" as const, href: "/worldcup2026/fixtures", active: false },
  { key: "results" as const, href: "/worldcup2026/fixtures", active: false },
  { key: "groups" as const, href: "/worldcup2026/groups", active: false },
  { key: "stats" as const, href: "/worldcup2026/standings", active: false },
];

export default function BracketPageBand({
  eyebrow,
  title,
  subtitle,
  note,
  tabs,
}: BracketPageBandProps) {
  return (
    <header className={styles.pageBand}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h1 className={styles.pageTitle}>{title}</h1>
      <p className={styles.pageSubtitle}>{subtitle}</p>
      <nav className={styles.tabNav} aria-label={title}>
        {TAB_LINKS.map((tab) => {
          const label = tabs[tab.key];
          if (tab.active) {
            return (
              <span key={tab.key} className={styles.tabActive} aria-current="page">
                {label}
              </span>
            );
          }
          return (
            <Link key={tab.key} href={tab.href} className={styles.tabLink}>
              {label}
            </Link>
          );
        })}
      </nav>
      <p className={styles.pageNote}>{note}</p>
    </header>
  );
}
