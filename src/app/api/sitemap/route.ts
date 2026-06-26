import { generateGoalCurrentSitemap } from "@/lib/seo/sitemap-entries";
import { buildSitemapXml } from "@/lib/seo/sitemap-xml";

export const runtime = "nodejs";

export function GET() {
  return new Response(buildSitemapXml(generateGoalCurrentSitemap()), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}