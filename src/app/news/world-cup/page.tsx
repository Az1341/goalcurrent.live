import type { Metadata } from "next";
import NewsCategoryFeed from "@/components/news/NewsCategoryFeed";
import { fetchNewsFeed } from "@/lib/news-rss";
import { mergeEditorialFirst } from "@/lib/editorial-news";
import { buildPageMetadata } from "@/lib/page-metadata";

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: "World Cup 2026 News | GoalCurrent.live",
  description:
    "Latest FIFA World Cup 2026 news from BBC Sport and ESPN on GoalCurrent.live.",
  path: "/news/world-cup/",
  absoluteTitle: true,
});

export default async function WorldCupNewsPage() {
  const { articles, sources } = await fetchNewsFeed("wc26");

  return (
    <NewsCategoryFeed
      heading="World Cup 2026"
      headingAccent="News"
      intro="World Cup 2026 headlines from BBC Sport and ESPN — refreshed hourly."
      articles={mergeEditorialFirst(articles)}
      sources={sources}
      emptyMessage="No World Cup news available right now. Check back soon."
    />
  );
}
