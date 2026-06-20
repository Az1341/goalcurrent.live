import type { Metadata } from "next";
import UnderConstruction from "@/components/UnderConstruction";
import { buildPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site-url";

export const metadata: Metadata = buildPageMetadata({
  title: "Premier League Fixtures 2026/27",
  description: `Premier League 2026/27 fixtures on ${SITE_NAME}.`,
  path: "/premier-league/fixtures",
});

export default function PremierLeagueFixturesPage() {
  return (
    <UnderConstruction
      title="Premier League Fixtures 2026/27"
      emoji="📅"
      description={`${SITE_NAME} — Premier League fixtures for the 2026/27 season will appear here.`}
    />
  );
}
