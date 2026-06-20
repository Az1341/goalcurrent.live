import type { Metadata } from "next";
import { PlAdSlot } from "@/components/pl/PlCommercialStrip";
import PlHubClient from "@/components/pl/PlHubClient";
import { buildPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site-url";

export const metadata: Metadata = buildPageMetadata({
  title: "Premier League 2026/27",
  description: `Premier League 2026/27 hub — table, fixtures, clubs and stats on ${SITE_NAME}.`,
  path: "/premier-league",
});

export default function PremierLeagueHubPage() {
  return (
    <>
      <PlAdSlot slot="5678901234" />
      <PlHubClient />
    </>
  );
}
