import type { MetadataRoute } from "next";
import { escapeXml } from "@/lib/seo/xml";

function formatLastMod(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString();
  }
  return date.toISOString();
}

export function buildSitemapXml(entries: MetadataRoute.Sitemap): string {
  const urls = entries
    .map((entry) => {
      const lines = [
        "  <url>",
        `    <loc>${escapeXml(entry.url)}</loc>`,
      ];

      if (entry.alternates?.languages) {
        for (const [lang, href] of Object.entries(entry.alternates.languages)) {
          if (!href) continue;
          lines.push(
            `    <xhtml:link rel="alternate" hreflang="${escapeXml(lang)}" href="${escapeXml(href)}"/>`,
          );
        }
      }

      if (entry.lastModified) {
        lines.push(
          `    <lastmod>${escapeXml(formatLastMod(entry.lastModified))}</lastmod>`,
        );
      }

      if (entry.changeFrequency) {
        lines.push(
          `    <changefreq>${escapeXml(entry.changeFrequency)}</changefreq>`,
        );
      }

      if (entry.priority != null) {
        lines.push(`    <priority>${entry.priority}</priority>`);
      }

      lines.push("  </url>");
      return lines.join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
}