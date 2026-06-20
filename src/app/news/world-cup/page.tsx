import type { Metadata } from "next";
import {
  buildComingSoonMetadata,
  ComingSoonPage,
} from "@/lib/coming-soon-page";

export const metadata: Metadata = buildComingSoonMetadata({
  title: "World Cup 2026 News",
  path: "/news/world-cup",
});

export default function WorldCupNewsPage() {
  return (
    <ComingSoonPage
      title="World Cup 2026 News"
      path="/news/world-cup"
      emoji="📰"
      description="World Cup 2026 news and daily round-ups are coming soon on GoalCurrent.live."
      links={[
        { href: "/news", label: "Latest News" },
        { href: "/worldcup2026", label: "WC26 Hub" },
        { href: "/worldcup2026/fixtures", label: "Fixtures" },
      ]}
      backHref="/news"
      backLabel="← Latest News"
    />
  );
}
