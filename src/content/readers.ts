import { contentItemToNewsArticle, videoItemToYouTubeVideo } from "@/content/adapters";
import type { ContentItem, VideoItem } from "@/content/types";
import {
  asVideoItems,
  getArticlesCacheBucket,
  getNewsCacheBucket,
  getVideosCacheBucket,
} from "@/utils/cache/store";
import type { NewsApiResponse } from "@/types/news";
import type { VideosApiResponse } from "@/types/video";

export type NewsFeedCategory = "wc26" | "pl" | "all";

const WC26_FILTER_KEYWORDS = [
  "world cup",
  "wc26",
  "wc2026",
  "fifa",
  "group stage",
  "knockout",
];

const PL_FILTER_KEYWORDS = [
  "premier league",
  "epl",
  "man city",
  "arsenal",
  "liverpool",
  "chelsea",
  "transfer",
];

function matchesCategory(
  title: string,
  description: string,
  category: NewsFeedCategory,
): boolean {
  if (category === "all") {
    return true;
  }

  const text = `${title} ${description}`.toLowerCase();
  const keywords =
    category === "wc26" ? WC26_FILTER_KEYWORDS : PL_FILTER_KEYWORDS;
  return keywords.some((keyword) => text.includes(keyword));
}

export function parseNewsFeedCategory(
  raw: string | null | undefined,
): NewsFeedCategory {
  if (raw === "wc26" || raw === "world-cup") {
    return "wc26";
  }
  if (raw === "pl" || raw === "premier-league") {
    return "pl";
  }
  if (raw === "all") {
    return "all";
  }
  return "all";
}

function filterNewsItems(
  items: ContentItem[],
  category: NewsFeedCategory,
): ContentItem[] {
  return items.filter((item) =>
    matchesCategory(item.title, item.description, category),
  );
}

export async function fetchNewsFeed(
  category: NewsFeedCategory = "all",
): Promise<NewsApiResponse> {
  const bucket = await getNewsCacheBucket();
  const filtered = filterNewsItems(bucket.items as ContentItem[], category);
  const articles = filtered.map(contentItemToNewsArticle);

  return {
    articles,
    sources: bucket.sources,
    count: articles.length,
    fetched: bucket.fetchedAt,
  };
}

export async function fetchCachedVideos(
  limit = 12,
): Promise<VideosApiResponse> {
  const bucket = await getVideosCacheBucket();
  const seenIds = new Set<string>();
  const videos = asVideoItems(bucket)
    .filter((item) => {
      if (seenIds.has(item.id)) return false;
      seenIds.add(item.id);
      return true;
    })
    .slice(0, limit)
    .map(videoItemToYouTubeVideo);

  return {
    videos,
    count: videos.length,
    fetchedAt: bucket.fetchedAt,
  };
}

export async function fetchCachedVideoItems(limit = 12): Promise<VideoItem[]> {
  const bucket = await getVideosCacheBucket();
  return asVideoItems(bucket).slice(0, limit);
}

export async function fetchSyndicatedArticles(): Promise<ContentItem[]> {
  const bucket = await getArticlesCacheBucket();
  return bucket.items as ContentItem[];
}

export { getNewsCacheBucket, getVideosCacheBucket, getArticlesCacheBucket };
