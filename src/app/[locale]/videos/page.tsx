import type { Metadata } from "next";
import VideoHub from "@/components/videos/VideoHub";
import { fetchYouTubeVideos } from "@/lib/youtube-videos";
import { buildPageMetadata } from "@/lib/page-metadata";

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: "Video & Audio | GoalCurrent.live",
  description:
    "Premier League and World Cup 2026 football videos on GoalCurrent.live.",
  path: "/videos/",
  absoluteTitle: true,
});

export default async function VideosHubPage() {
  const { videos } = await fetchYouTubeVideos("all", 4);

  return <VideoHub latestVideos={videos} />;
}
