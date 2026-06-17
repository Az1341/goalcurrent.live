import type { Metadata } from "next";
import NewsHub from "@/components/news/NewsHub";

export const metadata: Metadata = {
  title: "News",
  description:
    "Latest FIFA World Cup 2026 and football news from BBC Sport and ESPN on GoalCurrent.online.",
};

export default function NewsPage() {
  return <NewsHub />;
}
