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
  title: "Premier League Players 2026/27",
  description: `Premier League players on ${SITE_NAME} — coming soon.`,
  path: "/premier-league/players",
});

export default function PremierLeaguePlayersPage() {
  return (
    <>
      <PlAdSlot slot="5678901234" />
      <UnderConstruction
        title="Premier League Players 2026/27"
        emoji="👤"
        description={`Player profiles and squad lists for 2026/27 are coming soon on ${SITE_NAME}.`}
        links={PL_LINKS}
        backHref="/premier-league"
        backLabel="← Back to PL Home"
      />
    </>
  );
}
