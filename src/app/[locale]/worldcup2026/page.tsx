import Link from "next/link";
import type { Metadata } from "next";
import JsonLdScript from "@/components/seo/JsonLdScript";
import Wc26Breadcrumb from "@/components/wc26/Wc26Breadcrumb";
import Wc26HeroStats from "@/components/wc26/Wc26HeroStats";
import Wc26Scoreboard from "@/components/wc26/Wc26Scoreboard";
import Wc26TopScorers from "@/components/wc26/Wc26TopScorers";
import { WC26_TOURNAMENT } from "@/data/wc26";
import { WC26_SECTIONS } from "@/lib/wc26-sections";
import { buildPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME, absoluteUrl } from "@/lib/site-url";
import styles from "@/components/wc26/wc26.module.css";

export const metadata: Metadata = buildPageMetadata({
  title: "World Cup 2026",
  description:
    `FIFA World Cup 2026 hub — groups, fixtures, teams and standings on ${SITE_NAME}.`,
  path: "/worldcup2026",
});
export default function WorldCupHubPage() {
  const hosts = WC26_TOURNAMENT.hosts.join(" · ");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SportsOrganization",
        name: "FIFA World Cup 2026",
        sport: "Football",
        url: absoluteUrl("/worldcup2026"),
      },
      {
        "@type": "EventSeries",
        name: "FIFA World Cup 2026",
        startDate: WC26_TOURNAMENT.startUtc,
        endDate: WC26_TOURNAMENT.endUtc,
        url: absoluteUrl("/worldcup2026"),
      },
    ],
  };

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <main className={styles.wc26Content}>
      <Wc26Breadcrumb items={[{ label: "World Cup 2026" }]} />

      <h1 className={styles.pageTitle}>
        FIFA World Cup <span>2026</span>
      </h1>
      <p className={styles.pageIntro}>
        {hosts} · 11 June – 19 July 2026. Explore tournament sections below —
        base fixtures, groups, teams, and venues come from local typed data;
        live scores, results, standings overlays, and top scorers update from
        API data when available.
      </p>

      <Wc26Scoreboard />
      <Wc26HeroStats variant="hub" />
      <Wc26TopScorers />
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
    </>
  );
}
