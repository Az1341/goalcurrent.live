/**
 * Google News sitemap data and XML builder.
 * Served at `/sitemap-news.xml` via rewrite to `/api/sitemap-news`.
 */
export {
  buildNewsSitemapXml,
  getNewsSitemapEntries,
  type NewsSitemapEntry,
} from "@/lib/seo/news-sitemap";
