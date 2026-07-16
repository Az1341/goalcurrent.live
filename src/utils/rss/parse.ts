import type { ContentItem } from "@/content/types";
import { contentIdFromUrl, truncateDescription } from "@/content/merge";

export type ParsedRssItem = {
  title: string;
  link: string;
  description: string;
  publishedAt: string;
  thumbnail?: string;
  videoUrl?: string;
};

function decodeHtml(text: string): string {
  return text
    .replace(/<a[^>]*>([\s\S]*?)<\/a>/gi, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractYouTubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1).split("/")[0] || null;
    }
    if (parsed.hostname.includes("youtube.com")) {
      const fromQuery = parsed.searchParams.get("v");
      if (fromQuery) {
        return fromQuery;
      }
      const embedMatch = parsed.pathname.match(/\/embed\/([^/?]+)/);
      if (embedMatch?.[1]) {
        return embedMatch[1];
      }
    }
  } catch {
    return null;
  }
  return null;
}

export function parseRssItemXml(itemXml: string): ParsedRssItem | null {
  const titleMatch =
    itemXml.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/i) ||
    itemXml.match(/<title>([\s\S]*?)<\/title>/i);
  const linkMatch =
    itemXml.match(/<link>([\s\S]*?)<\/link>/i) ||
    itemXml.match(/<guid>([\s\S]*?)<\/guid>/i);
  const descMatch =
    itemXml.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/i) ||
    itemXml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/i) ||
    itemXml.match(/<description>([\s\S]*?)<\/description>/i);
  const pubDateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/);
  const imgMatch =
    itemXml.match(/<media:thumbnail[^>]+url="([^"]+)"/) ||
    itemXml.match(/<media:content[^>]+url="([^"]+)"/) ||
    itemXml.match(/<enclosure[^>]+url="([^"]+)"/);

  const title = decodeHtml(titleMatch?.[1] ?? "");
  const link = decodeHtml(linkMatch?.[1] ?? "");
  const description = decodeHtml(descMatch?.[1] ?? "");
  const pubDate = pubDateMatch?.[1] ?? "";
  const image = imgMatch?.[1] ? decodeHtml(imgMatch[1]) : "";

  if (!title || !link) {
    return null;
  }

  const videoFromDesc =
    description.match(/https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=[\w-]+|youtu\.be\/[\w-]+)/i)?.[0] ??
    link.match(/https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=[\w-]+|youtu\.be\/[\w-]+)/i)?.[0];

  const videoId = videoFromDesc ? extractYouTubeVideoId(videoFromDesc) : null;
  const videoUrl = videoId
    ? `https://www.youtube.com/watch?v=${videoId}`
    : undefined;

  return {
    title,
    link,
    description,
    publishedAt: pubDate
      ? new Date(pubDate).toISOString()
      : new Date().toISOString(),
    ...(image ? { thumbnail: image } : {}),
    ...(videoUrl ? { videoUrl } : {}),
  };
}

export function parseRssXml(xml: string): ParsedRssItem[] {
  const items = xml.match(/<item>([\s\S]*?)<\/item>/g) ?? [];
  const parsed: ParsedRssItem[] = [];

  for (const item of items) {
    const row = parseRssItemXml(item);
    if (row) {
      parsed.push(row);
    }
  }

  return parsed;
}

export function rssItemToContent(
  item: ParsedRssItem,
  source: string,
  kind: ContentItem["kind"] = "news",
): ContentItem {
  return {
    id: contentIdFromUrl(item.link),
    title: item.title,
    description: truncateDescription(item.description),
    url: item.link,
    publishedAt: item.publishedAt,
    source,
    kind,
    ...(item.thumbnail ? { thumbnail: item.thumbnail } : {}),
  };
}
