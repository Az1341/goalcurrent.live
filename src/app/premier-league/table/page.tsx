import type { Metadata } from "next";
import { PlAdSlotTop } from "@/components/pl/PlCommercialStrip";
import PlTableClient from "@/components/pl/PlTableClient";
import { buildPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site-url";

export const metadata: Metadata = buildPageMetadata({
  title: "Premier League Table 2026/27",
  description: `Premier League 2026/27 standings on ${SITE_NAME}.`,
  path: "/premier-league/table",
});

export default function PremierLeagueTablePage() {
  return (
    <>
      <PlAdSlotTop />
      <PlTableClient />
    </>
  );
}
