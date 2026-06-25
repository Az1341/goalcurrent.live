import type { Metadata } from "next";
import { PlAdSlotTop } from "@/components/pl/PlCommercialStrip";
import styles from "@/components/pl/PlCommercialStrip.module.css";
import PlFixturesClient from "@/components/pl/PlFixturesClient";
import { buildPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site-url";

export const metadata: Metadata = buildPageMetadata({
  title: "Premier League Fixtures 2026/27",
  description: `Premier League 2026/27 fixtures on ${SITE_NAME}.`,
  path: "/premier-league/fixtures",
});

export default function PremierLeagueFixturesPage() {
  return (
    <>
      <PlAdSlotTop className={styles.adWrapDesktopOnly} />
      <PlFixturesClient />
    </>
  );
}
