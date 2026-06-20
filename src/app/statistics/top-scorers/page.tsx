import type { Metadata } from "next";
import { buildComingSoonMetadata, ComingSoonPage } from "@/lib/coming-soon-page";

export const metadata: Metadata = buildComingSoonMetadata({
  title: "Top Scorers",
  path: "/statistics/top-scorers",
});

export default function StatisticsTopScorersPage() {
  return (
    <ComingSoonPage
      title="Top Scorers"
      path="/statistics/top-scorers"
      emoji="⚽"
      description="Top scorers tables are coming soon on GoalCurrent.live."
      links={[
        { href: "/statistics/assists", label: "Top Assists" },
        { href: "/worldcup2026", label: "WC26 Hub" },
        { href: "/premier-league/table", label: "PL Table" },
      ]}
    />
  );
}
