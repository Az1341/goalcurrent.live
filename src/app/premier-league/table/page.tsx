import type { Metadata } from "next";
import UnderConstruction from "@/components/UnderConstruction";
import { buildPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site-url";

export const metadata: Metadata = buildPageMetadata({
  title: "Premier League Table 2026/27",
  description: `Premier League 2026/27 standings on ${SITE_NAME}.`,
  path: "/premier-league/table",
});

export default function PremierLeagueTablePage() {
  return (
    <UnderConstruction
      title="Premier League Table 2026/27"
      emoji="📊"
      description={`${SITE_NAME} — Premier League standings for the 2026/27 season will appear here.`}
    />
  );
}
