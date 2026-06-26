import type { ContentItem } from "@/content/types";
import { FOOTBALL_RSS_FEEDS, VIDEO_RSS_FEEDS } from "@/utils/rss/feeds";
import {
  parseRssXml,
  rssItemToContent,
  type ParsedRssItem,
} from "@/utils/rss/parse";

async function fetchFeedXml(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "GoalCurrent/1.0 RSS Reader" },
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (!response.ok) {
      return null;
    }
    return await response.text();
  } catch {
    return null;
  }
}

function itemsFromFeeds(
  results: Array<{ source: string; items: ParsedRssItem[] }>,
  kind: ContentItem["kind"],
): ContentItem[] {
  const out: ContentItem[] = [];
  for (const { source, items } of results) {
    for (const item of items) {
      out.push(rssItemToContent(item, source, kind));
    }
  }
  return out;
}

export async function fetchRssNewsItems(): Promise<{
  items: ContentItem[];
  sources: string[];
  videoRssItems: ParsedRssItem[];
}> {
  const feedResults = await Promise.all(
    FOOTBALL_RSS_FEEDS.map(async (feed) => {
      const xml = await fetchFeedXml(feed.url);
      return {
        source: feed.source,
        items: xml ? parseRssXml(xml) : [],
      };
    }),
  );

  const videoFeedResults = await Promise.all(
    VIDEO_RSS_FEEDS.map(async (feed) => {
      const xml = await fetchFeedXml(feed.url);
      return {
        source: feed.source,
        items: xml ? parseRssXml(xml) : [],
      };
    }),
  );

  const sources = feedResults
    .filter((result) => result.items.length > 0)
    .map((result) => result.source);

  const videoRssItems = videoFeedResults.flatMap((result) =>
    result.items.filter((item) => item.videoUrl),
  );

  return {
    items: itemsFromFeeds(feedResults, "news"),
    sources,
    videoRssItems,
  };
}
