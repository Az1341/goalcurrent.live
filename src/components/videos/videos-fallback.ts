import type { YouTubeVideo } from "@/types/video";
import { SITE_NAME } from "@/lib/site-url";

export const VIDEO_FALLBACK_ITEMS: readonly YouTubeVideo[] = [
  {
    videoId: "wc26-fallback-1",
    title: "FIFA World Cup 2026 — Match Highlights Hub",
    description: "Follow every goal and big moment on GoalCurrent.live.",
    publishedAt: new Date().toISOString(),
    thumbnail: "/images/football-hero-bg.jpg",
    channelTitle: SITE_NAME,
    url: "https://www.youtube.com/results?search_query=FIFA+World+Cup+2026+highlights",
  },
  {
    videoId: "wc26-fallback-2",
    title: "Premier League 2026/27 — Latest Highlights",
    description: "PL goals and analysis on GoalCurrent.live.",
    publishedAt: new Date().toISOString(),
    thumbnail: "/images/hero-home.png",
    channelTitle: SITE_NAME,
    url: "https://www.youtube.com/results?search_query=Premier+League+2026+highlights",
  },
  {
    videoId: "wc26-fallback-3",
    title: "World Cup 2026 — Group Stage Previews",
    description: "Team-by-team previews for all 12 groups.",
    publishedAt: new Date().toISOString(),
    thumbnail: "/images/football-hero-bg.jpg",
    channelTitle: "FIFA",
    url: "https://www.youtube.com/@FIFA",
  },
  {
    videoId: "wc26-fallback-4",
    title: "Live Scores and Lineups — GoalCurrent",
    description: "Watch live with tactical lineups on match pages.",
    publishedAt: new Date().toISOString(),
    thumbnail: "/images/hero-home.png",
    channelTitle: SITE_NAME,
    url: "/live",
  },
];

export function withVideoFallback(
  videos: readonly YouTubeVideo[],
  limit = 4,
): YouTubeVideo[] {
  if (videos.length > 0) {
    return [...videos].slice(0, limit);
  }
  return [...VIDEO_FALLBACK_ITEMS].slice(0, limit);
}