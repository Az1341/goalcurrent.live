import type { Metadata } from "next";
import { PlAdSlot } from "@/components/pl/PlCommercialStrip";
import PlTransfersClient from "@/components/pl/PlTransfersClient";
import { buildPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site-url";

export const metadata: Metadata = buildPageMetadata({
  title: "Premier League Transfers 2026/27",
  description: `Premier League transfers for 2026/27 on ${SITE_NAME} when supported by the data source.`,
  path: "/premier-league/transfers",
});

export default function PremierLeagueTransfersPage() {
  return (
    <>
      <PlAdSlot slot="7890123456" />
      <PlTransfersClient />
    </>
  );
}
