import type { Metadata } from "next";
import { PlAdSlotTop } from "@/components/pl/PlCommercialStrip";
import PlStatisticsClient from "@/components/pl/PlStatisticsClient";
import { buildPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site-url";

export const metadata: Metadata = buildPageMetadata({
  title: "Premier League Statistics 2026/27",
  description: `Premier League statistics for 2026/27 on ${SITE_NAME} — top scorers, assists and more.`,
  path: "/premier-league/statistics",
});

export default function PremierLeagueStatisticsPage() {
  return (
    <>
      <PlAdSlotTop />
      <PlStatisticsClient />
    </>
  );
}
