import type { Metadata } from "next";
import NewsHub from "@/components/news/NewsHub";
import { fetchNewsFeed } from "@/content/readers";
import { buildPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site-url";

export const revalidate = 86400;

export const metadata: Metadata = buildPageMetadata({
  title: "News",
  description:
    `Latest FIFA World Cup 2026 and football news from BBC Sport, ESPN, and partner feeds on ${SITE_NAME}.`,
  path: "/news",
});

export default async function NewsPage() {
  const initialData = await fetchNewsFeed("all");
  return <NewsHub initialData={initialData} />;
}
