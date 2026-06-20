import type { Metadata } from "next";
import VideoCategoryFeed from "@/components/videos/VideoCategoryFeed";
import { fetchYouTubeVideos } from "@/lib/youtube-videos";
import { buildPageMetadata } from "@/lib/page-metadata";

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: "World Cup 2026 Videos | GoalCurrent.live",
  description:
    "FIFA World Cup 2026 previews and highlights on GoalCurrent.live.",
  path: "/videos/world-cup/",
  absoluteTitle: true,
});

export default async function WorldCupVideosPage() {
  const { videos } = await fetchYouTubeVideos("wc", 12);

  return (
    <VideoCategoryFeed
      heading="World Cup 2026"
      headingAccent="Videos"
      intro="World Cup 2026 previews and highlights from YouTube — refreshed hourly."
      videos={videos}
      emptyMessage="No World Cup videos available right now."
    />
  );
}
