import type { Metadata } from "next";
import PlFixturesClient from "@/components/pl/PlFixturesClient";
import { buildPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site-url";

export const metadata: Metadata = buildPageMetadata({
  title: "Premier League Fixtures 2026/27",
  description: `Premier League 2026/27 fixtures on ${SITE_NAME}.`,
  path: "/premier-league/fixtures",
});

export default function PremierLeagueFixturesPage() {
  return <PlFixturesClient />;
}
