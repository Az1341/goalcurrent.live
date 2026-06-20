import type { Metadata } from "next";
import { buildComingSoonMetadata, ComingSoonPage } from "@/lib/coming-soon-page";

export const metadata: Metadata = buildComingSoonMetadata({
  title: "Team Stats",
  path: "/statistics/teams",
});

export default function StatisticsTeamsPage() {
  return (
    <ComingSoonPage
      title="Team Stats"
      path="/statistics/teams"
      emoji="🏟️"
      description="Team statistics are coming soon on GoalCurrent.live."
      links={[
        { href: "/premier-league/table", label: "PL Table" },
        { href: "/worldcup2026/standings", label: "WC26 Standings" },
        { href: "/statistics/clean-sheets", label: "Clean Sheets" },
      ]}
    />
  );
}
