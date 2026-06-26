import type { ContentItem } from "@/content/types";
import { contentIdFromUrl, plainTextFromHtml, truncateDescription } from "@/content/merge";

const GNEWS_BASE = "https://gnews.io/api/v4/search";

type GNewsArticle = {
  title?: string;
  description?: string;
  content?: string;
  url?: string;
  image?: string;
  publishedAt?: string;
  source?: { name?: string };
};

type GNewsResponse = {
  articles?: GNewsArticle[];
};

export async function fetchGNewsArticles(): Promise<ContentItem[]> {
  const apiKey = process.env.GNEWS_API_KEY?.trim();
  if (!apiKey) {
    return [];
  }

  const params = new URLSearchParams({
    q: "football OR Premier League OR World Cup 2026",
    lang: "en",
    max: "20",
    apikey: apiKey,
  });

  try {
    const response = await fetch(`${GNEWS_BASE}?${params.toString()}`, {
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const json = (await response.json()) as GNewsResponse;
    const items: ContentItem[] = [];

    for (const article of json.articles ?? []) {
      const url = article.url?.trim();
      const title = article.title?.trim();
      if (!url || !title) {
        continue;
      }

      const description = plainTextFromHtml(
        article.description?.trim() || article.content?.trim() || "",
      );

      items.push({
        id: contentIdFromUrl(url),
        title,
        description: truncateDescription(description),
        url,
        publishedAt: article.publishedAt
          ? new Date(article.publishedAt).toISOString()
          : new Date().toISOString(),
        source: article.source?.name?.trim() || "GNews",
        kind: "news",
        ...(article.image ? { thumbnail: article.image } : {}),
      });
    }

    return items;
  } catch {
    return [];
  }
}
