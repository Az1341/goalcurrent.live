import type {
  ContentCacheBucket,
  ContentItem,
  IngestResult,
  VideoItem,
} from "@/content/types";
import { mergeContentSources } from "@/content/merge";
import {
  fetchScoreBatVideos,
  rssVideoItemsToVideoItems,
  youTubeVideoToItem,
} from "@/content/videos";
import { fetchGNewsArticles } from "@/utils/api-news/gnews";
import { fetchRssNewsItems } from "@/utils/rss/fetch";
import type { ParsedRssItem } from "@/utils/rss/parse";
import type { VideosApiResponse } from "@/types/video";

function bucket(
  items: ContentItem[] | VideoItem[],
  sources: string[],
): ContentCacheBucket {
  return {
    items,
    sources,
    fetchedAt: new Date().toISOString(),
  };
}

function syndicatedArticles(items: ContentItem[]): ContentItem[] {
  return items
    .filter((item) => item.url.startsWith("http"))
    .map((item) => ({ ...item, kind: "article" as const }))
    .slice(0, 20);
}

export type NewsIngestBundle = {
  newsItems: ContentItem[];
  newsSources: string[];
  articleItems: ContentItem[];
  videoRssItems: ParsedRssItem[];
};

/** RSS + GNews only — safe to wrap in unstable_cache. */
export async function ingestNewsBundle(): Promise<NewsIngestBundle> {
  const [rssResult, apiItems] = await Promise.all([
    fetchRssNewsItems(),
    fetchGNewsArticles(),
  ]);

  const newsItems = mergeContentSources(rssResult.items, apiItems);
  const newsSources = [
    ...rssResult.sources,
    ...(apiItems.length > 0 ? ["GNews"] : []),
  ];

  return {
    newsItems,
    newsSources,
    articleItems: syndicatedArticles(newsItems),
    videoRssItems: rssResult.videoRssItems,
  };
}

/**
 * Always runs at request/cron time (never inside unstable_cache).
 * Dynamic import keeps youtube-videos in the runtime server bundle.
 */
export async function fetchYouTubeForIngest(
  maxResults = 12,
): Promise<VideosApiResponse> {
  console.log("[ingest] fetchYouTubeForIngest start", {
    maxResults,
    youtubeKeyPresent: Boolean(process.env.YOUTUBE_API_KEY?.trim()),
  });

  const { fetchYouTubeVideos } = await import("@/lib/youtube-videos");
  const result = await fetchYouTubeVideos("all", maxResults);

  console.log("[ingest] fetchYouTubeForIngest done", {
    count: result.count,
    error: result.error,
  });

  return result;
}

function buildVideoBucket(
  youtubeResult: VideosApiResponse,
  scoreBatVideos: VideoItem[],
  videoRssItems: ParsedRssItem[],
): ContentCacheBucket {
  const rssVideos = rssVideoItemsToVideoItems(videoRssItems, "BBC Sport");
  const youtubeVideos = youtubeResult.videos.map(youTubeVideoToItem);

  const videoItems = mergeContentSources(
    [...youtubeVideos, ...scoreBatVideos] as ContentItem[],
    rssVideos as ContentItem[],
    24,
  ) as VideoItem[];

  const videoSources = [
    ...(youtubeVideos.length > 0 ? ["YouTube"] : []),
    ...(scoreBatVideos.length > 0 ? ["ScoreBat"] : []),
    ...(rssVideos.length > 0 ? ["BBC Sport"] : []),
  ];

  return bucket(videoItems, videoSources);
}

export type IngestOptions = {
  /** Pre-fetched news from unstable_cache (videos always fetched fresh). */
  cachedNews?: NewsIngestBundle;
};

export async function ingestAllContent(
  options: IngestOptions = {},
): Promise<IngestResult> {
  const now = new Date().toISOString();

  console.log("[ingest] ingestAllContent start", {
    hasCachedNews: Boolean(options.cachedNews),
    youtubeKeyPresent: Boolean(process.env.YOUTUBE_API_KEY?.trim()),
  });

  const newsBundle =
    options.cachedNews ?? (await ingestNewsBundle());

  const [youtubeResult, scoreBatVideos] = await Promise.all([
    fetchYouTubeForIngest(12),
    fetchScoreBatVideos(),
  ]);

  console.log("[ingest] ingestAllContent assembled", {
    newsCount: newsBundle.newsItems.length,
    youtubeCount: youtubeResult.count,
    scoreBatCount: scoreBatVideos.length,
    rssVideoCount: newsBundle.videoRssItems.length,
  });

  return {
    news: bucket(newsBundle.newsItems, newsBundle.newsSources),
    videos: buildVideoBucket(
      youtubeResult,
      scoreBatVideos,
      newsBundle.videoRssItems,
    ),
    articles: bucket(newsBundle.articleItems, newsBundle.newsSources),
    timestamp: {
      news: now,
      videos: now,
      articles: now,
    },
  };
}
