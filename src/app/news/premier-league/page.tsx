import type { Metadata } from "next";
import {
  buildComingSoonMetadata,
  ComingSoonPage,
} from "@/lib/coming-soon-page";

export const metadata: Metadata = buildComingSoonMetadata({
  title: "Premier League News",
  path: "/news/premier-league",
});

export default function PremierLeagueNewsPage() {
  return (
    <ComingSoonPage
      title="Premier League News"
      path="/news/premier-league"
      emoji="📰"
      description="Premier League news round-ups are coming soon on GoalCurrent.live."
      links={[
        { href: "/news", label: "Latest News" },
        { href: "/premier-league", label: "PL Home" },
        { href: "/premier-league/transfers", label: "Transfers" },
      ]}
      backHref="/news"
      backLabel="← Latest News"
    />
  );
}
