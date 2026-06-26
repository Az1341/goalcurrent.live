import { unstable_cache } from "next/cache";
import type {
  ContentCacheBucket,
  ContentTimestamp,
  IngestResult,
  VideoItem,
} from "@/content/types";
import { ingestAllContent, ingestNewsBundle } from "@/content/ingest";
import {
  fallbackArticlesBucket,
  fallbackNewsBucket,
  fallbackVideosBucket,
} from "@/content/fallbacks";
import newsSeed from "@/utils/cache/news.json";
import videosSeed from "@/utils/cache/videos.json";
import articlesSeed from "@/utils/cache/articles.json";
import timestampSeed from "@/utils/cache/timestamp.json";

export type ContentBucketKey = "news" | "videos" | "articles";

const CACHE_TTL_SECONDS = 86_400;
const MEMORY_TTL_MS = 86_400_000;

type MemoryEntry = {
  data: ContentCacheBucket;
  at: number;
};

const memoryCache = new Map<ContentBucketKey, MemoryEntry>();

function isFresh(entry: MemoryEntry | undefined): boolean {
  return Boolean(entry && Date.now() - entry.at < MEMORY_TTL_MS);
}

function seedBucket(key: ContentBucketKey): ContentCacheBucket {
  if (key === "news") {
    return newsSeed as ContentCacheBucket;
  }
  if (key === "videos") {
    return videosSeed as ContentCacheBucket;
  }
  return articlesSeed as ContentCacheBucket;
}

function fallbackBucket(key: ContentBucketKey): ContentCacheBucket {
  if (key === "news") {
    return fallbackNewsBucket();
  }
  if (key === "videos") {
    return fallbackVideosBucket();
  }
  return fallbackArticlesBucket();
}

function resolveBucket(
  key: ContentBucketKey,
  candidate: ContentCacheBucket | null | undefined,
): ContentCacheBucket {
  if (candidate?.items?.length) {
    return candidate;
  }
  const seed = seedBucket(key);
  if (seed.items?.length) {
    return seed;
  }
  return fallbackBucket(key);
}

const cachedNewsBundle = unstable_cache(
  async () => ingestNewsBundle(),
  ["content-ingest-news"],
  {
    revalidate: CACHE_TTL_SECONDS,
    tags: ["content-news", "content-articles"],
  },
);

export function setMemoryCacheFromIngest(result: IngestResult): void {
  const now = Date.now();
  memoryCache.set("news", { data: result.news, at: now });
  memoryCache.set("videos", { data: result.videos, at: now });
  memoryCache.set("articles", { data: result.articles, at: now });
}

export async function refreshContentCache(): Promise<IngestResult> {
  console.log("[content] refreshContentCache: full ingest (YouTube not cached)");
  try {
    const result = await ingestAllContent();
    setMemoryCacheFromIngest(result);
    return result;
  } catch (error) {
    console.error("[content] refreshContentCache failed:", error);
    return {
      news: resolveBucket("news", memoryCache.get("news")?.data),
      videos: resolveBucket("videos", memoryCache.get("videos")?.data),
      articles: resolveBucket("articles", memoryCache.get("articles")?.data),
      timestamp: timestampSeed as ContentTimestamp,
    };
  }
}

export async function getIngestResult(): Promise<IngestResult> {
  const memoryNews = memoryCache.get("news");
  const memoryVideos = memoryCache.get("videos");
  const memoryArticles = memoryCache.get("articles");

  if (
    isFresh(memoryNews) &&
    isFresh(memoryVideos) &&
    isFresh(memoryArticles)
  ) {
    return {
      news: memoryNews!.data,
      videos: memoryVideos!.data,
      articles: memoryArticles!.data,
      timestamp: {
        news: memoryNews!.data.fetchedAt,
        videos: memoryVideos!.data.fetchedAt,
        articles: memoryArticles!.data.fetchedAt,
      },
    };
  }

  try {
    const cachedNews = await cachedNewsBundle();
    const ingested = await ingestAllContent({ cachedNews });
    setMemoryCacheFromIngest(ingested);
    return ingested;
  } catch (error) {
    console.error("[content] getIngestResult failed:", error);
    return {
      news: resolveBucket("news", memoryNews?.data),
      videos: resolveBucket("videos", memoryVideos?.data),
      articles: resolveBucket("articles", memoryArticles?.data),
      timestamp: timestampSeed as ContentTimestamp,
    };
  }
}

export async function getNewsCacheBucket(): Promise<ContentCacheBucket> {
  const result = await getIngestResult();
  return resolveBucket("news", result.news);
}

export async function getVideosCacheBucket(): Promise<ContentCacheBucket> {
  const result = await getIngestResult();
  return resolveBucket("videos", result.videos);
}

export async function getArticlesCacheBucket(): Promise<ContentCacheBucket> {
  const result = await getIngestResult();
  return resolveBucket("articles", result.articles);
}

export async function writeDevCacheSnapshots(result: IngestResult): Promise<void> {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  const fs = await import("node:fs/promises");
  const path = await import("node:path");

  const dir = path.join(process.cwd(), "src/utils/cache");
  const writes: Promise<void>[] = [
    fs.writeFile(
      path.join(dir, "news.json"),
      `${JSON.stringify(result.news, null, 2)}\n`,
      "utf8",
    ),
    fs.writeFile(
      path.join(dir, "articles.json"),
      `${JSON.stringify(result.articles, null, 2)}\n`,
      "utf8",
    ),
    fs.writeFile(
      path.join(dir, "timestamp.json"),
      `${JSON.stringify(result.timestamp, null, 2)}\n`,
      "utf8",
    ),
  ];

  if (result.videos.items.length > 0) {
    writes.push(
      fs.writeFile(
        path.join(dir, "videos.json"),
        `${JSON.stringify(result.videos, null, 2)}\n`,
        "utf8",
      ),
    );
  }

  await Promise.all(writes);
}

export function asVideoItems(bucket: ContentCacheBucket): VideoItem[] {
  return bucket.items as VideoItem[];
}
