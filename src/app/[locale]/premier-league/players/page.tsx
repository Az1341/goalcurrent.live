import type { Metadata } from "next";
import { PlAdSlotTop } from "@/components/pl/PlCommercialStrip";
import PlPlayersClient from "@/components/pl/PlPlayersClient";
import { buildPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site-url";

export const metadata: Metadata = buildPageMetadata({
  title: "Premier League Players 2026/27",
  description: `Premier League players for 2026/27 on ${SITE_NAME} — from official API data.`,
  path: "/premier-league/players",
});

export default function PremierLeaguePlayersPage() {
  return (
    <>
      <PlAdSlotTop />
      <PlPlayersClient />
    </>
  );
}
