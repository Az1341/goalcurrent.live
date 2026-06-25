import type { Metadata } from "next";
import { buildComingSoonMetadata, ComingSoonPage } from "@/lib/coming-soon-page";

export const metadata: Metadata = buildComingSoonMetadata({
  title: "Disciplinary Statistics",
  path: "/statistics/disciplinary",
});

export default function StatisticsDisciplinaryPage() {
  return (
    <ComingSoonPage
      title="Disciplinary Statistics"
      path="/statistics/disciplinary"
      emoji="🟨"
      description="Cards and disciplinary records are coming soon on GoalCurrent.live."
      links={[
        { href: "/statistics/teams", label: "Team Stats" },
        { href: "/statistics/players", label: "Player Stats" },
        { href: "/premier-league/statistics", label: "PL Statistics" },
      ]}
    />
  );
}
