import { buildNewsSitemapXml } from "@/lib/seo/news-sitemap";

export const runtime = "nodejs";

export function GET() {
  return new Response(buildNewsSitemapXml(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
