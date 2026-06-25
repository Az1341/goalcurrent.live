import type { Metadata } from "next";
import { buildComingSoonMetadata, ComingSoonPage } from "@/lib/coming-soon-page";

export const metadata: Metadata = buildComingSoonMetadata({
  title: "Top Assists",
  path: "/statistics/assists",
});

export default function StatisticsAssistsPage() {
  return (
    <ComingSoonPage
      title="Top Assists"
      path="/statistics/assists"
      emoji="🎯"
      description="Assists leaders are coming soon on GoalCurrent.live."
      links={[
        { href: "/statistics/top-scorers", label: "Top Scorers" },
        { href: "/statistics/player-rankings", label: "Player Rankings" },
        { href: "/premier-league/statistics", label: "PL Statistics" },
      ]}
    />
  );
}
