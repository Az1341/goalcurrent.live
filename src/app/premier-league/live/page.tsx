import type { Metadata } from "next";
import { PlAdSlot } from "@/components/pl/PlCommercialStrip";
import {
  buildComingSoonMetadata,
  ComingSoonPage,
} from "@/lib/coming-soon-page";

export const metadata: Metadata = buildComingSoonMetadata({
  title: "Premier League Live Matches 2026/27",
  path: "/premier-league/live",
});

export default function PremierLeagueLivePage() {
  return (
    <>
      <PlAdSlot slot="9012345678" />
      <ComingSoonPage
        title="Premier League Live Matches 2026/27"
        path="/premier-league/live"
        emoji="🔴"
        description="Live Premier League match centre is coming soon on GoalCurrent.live."
        links={[
          { href: "/live", label: "Live Scores" },
          { href: "/premier-league/fixtures", label: "Fixtures" },
          { href: "/premier-league", label: "PL Home" },
        ]}
        backHref="/premier-league"
        backLabel="← Back to PL Home"
      />
    </>
  );
}
