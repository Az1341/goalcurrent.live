import type { Metadata } from "next";
import { PlAdSlot } from "@/components/pl/PlCommercialStrip";
import PlLiveClient from "@/components/pl/PlLiveClient";
import { buildPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site-url";

export const metadata: Metadata = buildPageMetadata({
  title: "Premier League Live Matches 2026/27",
  description: `Live Premier League matches for 2026/27 on ${SITE_NAME}.`,
  path: "/premier-league/live",
});

export default function PremierLeagueLivePage() {
  return (
    <>
      <PlAdSlot slot="9012345678" />
      <PlLiveClient />
    </>
  );
}
