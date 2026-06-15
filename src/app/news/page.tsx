import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import UnderConstruction from "@/components/UnderConstruction";

export const metadata: Metadata = {
  title: "News — GoalCurrent.online",
  description: "World Cup 2026 news on GoalCurrent.online.",
};

export default function NewsPage() {
  return (
    <SiteShell activeNav="news">
      <UnderConstruction
        title="Latest News"
        emoji="📰"
        description="World Cup 2026 news and updates will be published here soon."
      />
    </SiteShell>
  );
}
