import type { VideosApiResponse, YouTubeVideo } from "@/types/video";

export type VideoFeedCategory = "pl" | "wc" | "all";

const YT_BASE = "https://www.googleapis.com/youtube/v3";
const FIFA_CHANNEL = "UCpcTrCXblq78GZrTUTLWeBw";

const DEFAULT_SEARCH_QUERY = "FIFA World Cup 2026 match preview";
const FALLBACK_SEARCH_QUERY = "FIFA World Cup 2026 preview";

const CATEGORY_QUERIES: Record<Exclude<VideoFeedCategory, "all">, string> = {
  pl: "Premier League 2026 highlights",
  wc: "World Cup 2026 highlights",
};

type YouTubeSearchItem = {
  id?: { videoId?: string } | string;
  snippet?: {
    title?: string;
    description?: string;
    publishedAt?: string;
    channelTitle?: string;
    thumbnails?: {
      maxres?: { url?: string };
      high?: { url?: string };
      medium?: { url?: string };
    };
  };
};

function emptyResponse(error?: string): VideosApiResponse {
  return {
    videos: [],
    count: 0,
    fetchedAt: new Date().toISOString(),
    ...(error ? { error } : {}),
  };
}

function formatItems(items: YouTubeSearchItem[]): YouTubeVideo[] {
  return items
    .filter((item) => {
      const id = item.id;
      return id && (typeof id === "object" ? id.videoId : typeof id === "string");
    })
    .map((item) => {
      const videoId =
        typeof item.id === "object" ? (item.id?.videoId ?? "") : String(item.id);
      const snippet = item.snippet ?? {};
      const thumbs = snippet.thumbnails ?? {};
      const thumbnail =
        thumbs.maxres?.url ??
        thumbs.high?.url ??
        thumbs.medium?.url ??
        `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

      return {
        videoId,
        title: snippet.title ?? "",
        description: snippet.description ?? "",
        publishedAt: snippet.publishedAt ?? "",
        thumbnail,
        channelTitle: snippet.channelTitle ?? "YouTube",
        url: `https://www.youtube.com/watch?v=${videoId}`,
      };
    })
    .filter((video) => video.videoId && video.title);
}

async function ytFetch(path: string, apiKey: string): Promise<unknown> {
  const url = `${YT_BASE}${path}`;
  const safePath = path.replace(/key=[^&]+/i, "key=***");
  console.log("[YouTube] Fetch:", safePath);

  const response = await fetch(url, {
    signal: AbortSignal.timeout(8000),
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    const body = await response.text();
    console.error("[YouTube] HTTP error:", response.status, body.slice(0, 500));
    throw new Error(`YouTube API ${response.status}: ${body.slice(0, 200)}`);
  }

  const data = await response.json();
  console.log("[YouTube] Response:", JSON.stringify(data).slice(0, 800));
  return data;
}

async function searchVideos(
  apiKey: string,
  query: string,
  maxResults: number,
  channelId?: string,
): Promise<YouTubeVideo[]> {
  const params = new URLSearchParams({
    part: "snippet",
    q: query,
    type: "video",
    order: "date",
    maxResults: String(maxResults),
    key: apiKey,
  });

  if (channelId) {
    params.set("channelId", channelId);
  }

  console.log("[YouTube] Query:", query, {
    channelId: channelId ?? "(any)",
    maxResults,
  });

  const data = (await ytFetch(`/search?${params.toString()}`, apiKey)) as {
    items?: YouTubeSearchItem[];
    error?: { message?: string; code?: number; errors?: unknown[] };
    pageInfo?: { totalResults?: number };
  };

  const items = data.items ?? [];
  console.log("[YouTube] Search result:", {
    itemCount: items.length,
    totalResults: data.pageInfo?.totalResults,
    apiError: data.error?.message,
  });

  return formatItems(items);
}

async function fetchDefaultVideos(
  apiKey: string,
  maxResults: number,
): Promise<YouTubeVideo[]> {
  const channelResults = await searchVideos(
    apiKey,
    DEFAULT_SEARCH_QUERY,
    Math.max(maxResults * 2, 8),
    FIFA_CHANNEL,
  );

  if (channelResults.length > 0) {
    console.log("[YouTube] Using FIFA channel results:", channelResults.length);
    return channelResults.slice(0, maxResults);
  }

  console.log("[YouTube] FIFA channel empty — trying fallback query");
  const fallback = await searchVideos(
    apiKey,
    FALLBACK_SEARCH_QUERY,
    maxResults,
  );
  console.log("[YouTube] Fallback query returned:", fallback.length);
  return fallback.slice(0, maxResults);
}

export function parseVideoFeedCategory(
  raw: string | null | undefined,
): VideoFeedCategory {
  if (raw === "pl" || raw === "premier-league") {
    return "pl";
  }
  if (raw === "wc" || raw === "world-cup") {
    return "wc";
  }
  if (raw === "all") {
    return "all";
  }
  return "all";
}

export async function fetchYouTubeVideos(
  category: VideoFeedCategory = "all",
  maxResults = category === "all" ? 4 : 12,
): Promise<VideosApiResponse> {
  const rawKey = process.env.YOUTUBE_API_KEY;
  const apiKey = rawKey?.trim();

  console.log("[YouTube] fetchYouTubeVideos called", {
    category,
    maxResults,
    apiKeyPresent: Boolean(apiKey),
    apiKeyLength: apiKey?.length ?? 0,
  });

  if (!apiKey) {
    console.warn("[YouTube] YOUTUBE_API_KEY missing or empty after trim");
    return emptyResponse("YOUTUBE_API_KEY not configured");
  }

  try {
    let videos: YouTubeVideo[];

    if (category === "all") {
      videos = await fetchDefaultVideos(apiKey, maxResults);
    } else {
      videos = await searchVideos(
        apiKey,
        CATEGORY_QUERIES[category],
        maxResults,
      );
    }

    console.log("[YouTube] fetchYouTubeVideos done", {
      category,
      count: videos.length,
      titles: videos.slice(0, 3).map((v) => v.title),
    });

    return {
      videos,
      count: videos.length,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("[YouTube] fetchYouTubeVideos failed:", error);
    return emptyResponse("Failed to fetch videos");
  }
}
