import type { Metadata } from "next";
import { buildComingSoonMetadata, ComingSoonPage } from "@/lib/coming-soon-page";

const STATS_LINKS = [
  { href: "/statistics/live", label: "Live Match Stats" },
  { href: "/statistics/top-scorers", label: "Top Scorers" },
  { href: "/statistics/assists", label: "Top Assists" },
];

export const metadata: Metadata = buildComingSoonMetadata({
  title: "Live Match Stats",
  path: "/statistics/live",
});

export default function StatisticsLivePage() {
  return (
    <ComingSoonPage
      title="Live Match Stats"
      path="/statistics/live"
      emoji="📊"
      description="Live match statistics are coming soon on GoalCurrent.live."
      links={[{ href: "/live", label: "Live Scores" }, ...STATS_LINKS]}
    />
  );
}
