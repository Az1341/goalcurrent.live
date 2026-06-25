import type { Metadata } from "next";
import NewsHub from "@/components/news/NewsHub";
import { buildPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site-url";

export const metadata: Metadata = buildPageMetadata({
  title: "News",
  description:
    `Latest FIFA World Cup 2026 and football news from BBC Sport and ESPN on ${SITE_NAME}.`,
  path: "/news",
});
export default function NewsPage() {
  return <NewsHub />;
}
