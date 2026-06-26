import type { ContentItem, VideoItem } from "@/content/types";
import type { NewsArticle, NewsTag } from "@/types/news";
import type { YouTubeVideo } from "@/types/video";

function tagFromText(text: string): NewsTag {
  const low = text.toLowerCase();
  if (
    low.includes("injur") ||
    low.includes("fitness") ||
    low.includes("doubt") ||
    low.includes("ruled out")
  ) {
    return "INJURY";
  }
  if (
    low.includes("squad") ||
    low.includes("named") ||
    low.includes("call-up") ||
    low.includes("callup")
  ) {
    return "SQUAD";
  }
  if (low.includes("preview") || low.includes("prediction")) {
    return "PREVIEW";
  }
  if (
    low.includes("result") ||
    low.includes(" win") ||
    low.includes("beat") ||
    low.includes("score") ||
    low.includes("goal")
  ) {
    return "RESULT";
  }
  if (
    low.includes("breaking") ||
    low.includes("confirm") ||
    low.includes("official")
  ) {
    return "BREAKING";
  }
  if (
    low.includes("transfer") ||
    low.includes("sign") ||
    low.includes("deal")
  ) {
    return "TRANSFER";
  }
  return "NEWS";
}

export function contentItemToNewsArticle(item: ContentItem): NewsArticle {
  return {
    title: item.title,
    link: item.url,
    excerpt: item.description,
    date: item.publishedAt,
    source: item.source,
    tag: tagFromText(`${item.title} ${item.description}`),
    ...(item.thumbnail ? { image: item.thumbnail } : {}),
  };
}

export function videoItemToYouTubeVideo(item: VideoItem): YouTubeVideo {
  const videoIdMatch = item.embedUrl.match(/\/embed\/([^/?]+)/);
  const videoId =
    videoIdMatch?.[1] ??
    (item.id.startsWith("c-") ? item.id : item.id.replace(/^c-/, ""));

  return {
    videoId,
    title: item.title,
    description: item.description,
    publishedAt: item.publishedAt,
    thumbnail: item.thumbnail ?? "/images/football-hero-bg.jpg",
    channelTitle: item.source,
    url: item.url,
  };
}

export function youTubeVideoToVideoItem(video: YouTubeVideo): VideoItem {
  const embedUrl = video.videoId.startsWith("wc26-fallback")
    ? video.url
    : `https://www.youtube.com/embed/${video.videoId}`;

  return {
    id: `c-${video.videoId}`,
    title: video.title,
    description: video.description,
    url: video.url,
    thumbnail: video.thumbnail,
    publishedAt: video.publishedAt,
    source: video.channelTitle,
    kind: "video",
    embedUrl,
  };
}
