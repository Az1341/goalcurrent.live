import type { Metadata } from "next";
import VideoHub from "@/components/videos/VideoHub";
import { withVideoFallback } from "@/components/videos/videos-fallback";
import { fetchCachedVideos } from "@/content/readers";
import { buildPageMetadata } from "@/lib/page-metadata";

export const revalidate = 86400;

export const metadata: Metadata = buildPageMetadata({
  title: "Video & Audio | GoalCurrent.live",
  description:
    "Premier League and World Cup 2026 football videos on GoalCurrent.live.",
  path: "/videos/",
  absoluteTitle: true,
});

export default async function VideosHubPage() {
  const { videos } = await fetchCachedVideos(4);

  return <VideoHub latestVideos={withVideoFallback(videos, 4)} />;
}
