import Link from "next/link";
import type { Metadata } from "next";
import { PL_NAV } from "@/lib/nav";
import { buildPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site-url";
import styles from "@/components/layout/layout.module.css";

export const metadata: Metadata = buildPageMetadata({
  title: "Premier League 2026/27",
  description: `Premier League 2026/27 hub — table and fixtures on ${SITE_NAME}.`,
  path: "/premier-league",
});

export default function PremierLeagueHubPage() {
  return (
    <main className={styles.content}>
      <div className={styles.stub}>
        <span className={styles.stubEmoji} aria-hidden="true">
          ⚽
        </span>
        <h1>Premier League 2026/27</h1>
        <p>
          {SITE_NAME} — Premier League hub. Table and fixtures pages are being
          prepared.
        </p>
        <nav
          aria-label="Premier League sections"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          {PL_NAV.map((item) => (
            <Link key={item.href} href={item.href} className={styles.stubBtn}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/" className={styles.stubBtn}>
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}
