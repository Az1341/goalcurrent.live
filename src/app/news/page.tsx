import type { Metadata } from "next";
import UnderConstruction from "@/components/UnderConstruction";

export const metadata: Metadata = {
  title: "News",
  description: "World Cup 2026 news on GoalCurrent.online.",
};

export default function NewsPage() {
  return (
    <UnderConstruction
      title="Latest News"
      emoji="📰"
      description="World Cup 2026 news and updates will be published here soon."
    />
  );
}
