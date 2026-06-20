import type { Metadata } from "next";
import UnderConstruction from "@/components/UnderConstruction";
import { PlAdSlot } from "@/components/pl/PlCommercialStrip";
import { buildPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site-url";

const PL_LINKS = [
  { href: "/premier-league", label: "PL Home" },
  { href: "/premier-league/table", label: "Table 26/27" },
  { href: "/premier-league/fixtures", label: "Fixtures 26/27" },
];

export const metadata: Metadata = buildPageMetadata({
  title: "Premier League Clubs 2026/27",
  description: `Premier League clubs on ${SITE_NAME} — coming soon.`,
  path: "/premier-league/clubs",
});

export default function PremierLeagueClubsPage() {
  return (
    <>
      <PlAdSlot slot="4567890123" />
      <UnderConstruction
        title="Premier League Clubs 2026/27"
        emoji="🏟️"
        description={`Club profiles for the 2026/27 Premier League season are coming soon on ${SITE_NAME}.`}
        links={PL_LINKS}
        backHref="/premier-league"
        backLabel="← Back to PL Home"
      />
    </>
  );
}
