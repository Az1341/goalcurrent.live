import {
  ARTICLE_INDEX,
  ARTICLES,
  articleHref,
  type Article,
} from "@/data/articles";
import { EDITORIAL_ARTICLES } from "@/data/editorial";
import {
  NEWS_PUBLICATION_LANGUAGE,
  NEWS_PUBLICATION_NAME,
} from "@/lib/seo/constants";
import { toNewsPublicationDate } from "@/lib/seo/dates";
import { absoluteUrl } from "@/lib/site-url";

export type NewsSitemapEntry = {
  loc: string;
  title: string;
  publicationDate: string;
};

const MIN_CONTENT_LENGTH = 280;

function isSubstantiveArticle(article: Article): boolean {
  const text = article.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text.length >= MIN_CONTENT_LENGTH;
}

function indexEntryToNews(entry: (typeof ARTICLE_INDEX)[number]): NewsSitemapEntry {
  return {
    loc: absoluteUrl(articleHref(entry.slug)),
    title: entry.title,
    publicationDate: toNewsPublicationDate(entry.date),
  };
}

function articleToNews(article: Article): NewsSitemapEntry {
  return {
    loc: absoluteUrl(articleHref(article.slug)),
    title: article.title,
    publicationDate: toNewsPublicationDate(article.date),
  };
}

/** Article and news URLs eligible for Google News sitemap. */
export function getNewsSitemapEntries(): NewsSitemapEntry[] {
  const byUrl = new Map<string, NewsSitemapEntry>();

  for (const entry of ARTICLE_INDEX) {
    byUrl.set(articleHref(entry.slug), indexEntryToNews(entry));
  }

  for (const article of ARTICLES) {
    if (!isSubstantiveArticle(article)) {
      continue;
    }
    byUrl.set(articleHref(article.slug), articleToNews(article));
  }

  for (const editorial of EDITORIAL_ARTICLES) {
    byUrl.set(editorial.path, {
      loc: absoluteUrl(editorial.path),
      title: editorial.title,
      publicationDate: toNewsPublicationDate(editorial.publishedAt),
    });
  }

  return [...byUrl.values()].sort(
    (a, b) => Date.parse(b.publicationDate) - Date.parse(a.publicationDate),
  );
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function buildNewsSitemapXml(): string {
  const entries = getNewsSitemapEntries();
  const urls = entries
    .map(
      (entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(NEWS_PUBLICATION_NAME)}</news:name>
        <news:language>${NEWS_PUBLICATION_LANGUAGE}</news:language>
      </news:publication>
      <news:publication_date>${escapeXml(entry.publicationDate)}</news:publication_date>
      <news:title>${escapeXml(entry.title)}</news:title>
    </news:news>
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>
`;
}
