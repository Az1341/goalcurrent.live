import { NEWS_FALLBACK_ARTICLES } from "@/components/news/news-fallback";
import { VIDEO_FALLBACK_ITEMS } from "@/components/videos/videos-fallback";
import type { ContentCacheBucket, ContentItem, VideoItem } from "@/content/types";
import { contentIdFromUrl } from "@/content/merge";
import { youtubeEmbedUrl } from "@/content/videos";

const SEED_FETCHED_AT = "2026-06-01T00:00:00.000Z";

function newsFallbackItems(): ContentItem[] {
  return NEWS_FALLBACK_ARTICLES.map((article) => ({
    id: contentIdFromUrl(article.link),
    title: article.title,
    description: article.excerpt,
    url: article.link,
    publishedAt: article.date,
    source: article.source,
    kind: "news" as const,
    ...(article.image ? { thumbnail: article.image } : {}),
  }));
}

function videoFallbackItems(): VideoItem[] {
  return VIDEO_FALLBACK_ITEMS.map((video) => ({
    id: contentIdFromUrl(video.url),
    title: video.title,
    description: video.description,
    url: video.url,
    thumbnail: video.thumbnail,
    publishedAt: video.publishedAt,
    source: video.channelTitle,
    kind: "video" as const,
    embedUrl: video.videoId.startsWith("wc26-fallback")
      ? video.url
      : youtubeEmbedUrl(video.videoId),
  }));
}

function articleFallbackItems(): ContentItem[] {
  return newsFallbackItems()
    .filter((item) => item.url.startsWith("http"))
    .map((item) => ({ ...item, kind: "article" as const }));
}

export function fallbackNewsBucket(): ContentCacheBucket {
  return {
    items: newsFallbackItems(),
    sources: ["GoalCurrent.live"],
    fetchedAt: SEED_FETCHED_AT,
  };
}

export function fallbackVideosBucket(): ContentCacheBucket {
  return {
    items: videoFallbackItems(),
    sources: ["GoalCurrent.live"],
    fetchedAt: SEED_FETCHED_AT,
  };
}

export function fallbackArticlesBucket(): ContentCacheBucket {
  return {
    items: articleFallbackItems(),
    sources: ["GoalCurrent.live"],
    fetchedAt: SEED_FETCHED_AT,
  };
}
