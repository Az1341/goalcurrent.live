/**
 * Google News sitemap data and XML builder.
 * Served at `/sitemap-news.xml` via `src/app/sitemap-news.xml/route.ts`.
 */
export {
  buildNewsSitemapXml,
  getNewsSitemapEntries,
  type NewsSitemapEntry,
} from "@/lib/seo/news-sitemap";
