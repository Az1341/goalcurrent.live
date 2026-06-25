import type { Metadata } from "next";
import { buildComingSoonMetadata, ComingSoonPage } from "@/lib/coming-soon-page";

export const metadata: Metadata = buildComingSoonMetadata({
  title: "Player Stats",
  path: "/statistics/players",
});

export default function StatisticsPlayersPage() {
  return (
    <ComingSoonPage
      title="Player Stats"
      path="/statistics/players"
      emoji="👤"
      description="Player statistics hub is coming soon on GoalCurrent.live."
      links={[
        { href: "/statistics/top-scorers", label: "Top Scorers" },
        { href: "/statistics/assists", label: "Top Assists" },
        { href: "/premier-league/players", label: "PL Players" },
      ]}
    />
  );
}
