import type { Metadata } from "next";
import VideoCategoryFeed from "@/components/videos/VideoCategoryFeed";
import { withVideoFallback } from "@/components/videos/videos-fallback";
import { fetchYouTubeVideos } from "@/lib/youtube-videos";
import { buildPageMetadata } from "@/lib/page-metadata";

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: "Premier League Videos 2026/27 | GoalCurrent.live",
  description:
    "Premier League 2026/27 highlights and clips on GoalCurrent.live.",
  path: "/videos/premier-league/",
  absoluteTitle: true,
});

export default async function PremierLeagueVideosPage() {
  const { videos } = await fetchYouTubeVideos("pl", 12);

  return (
    <VideoCategoryFeed
      heading="Premier League"
      headingAccent="Videos"
      intro="Premier League 2026/27 highlights from YouTube — refreshed hourly."
      videos={withVideoFallback(videos, 12)}
      emptyMessage="No PL videos available right now."
    />
  );
}
