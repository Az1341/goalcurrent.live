import { absoluteUrl } from "@/lib/site-url";

export function buildRobotsTxt(): string {
  return `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${absoluteUrl("/sitemap.xml")}
Sitemap: ${absoluteUrl("/sitemap-news.xml")}
`;
}