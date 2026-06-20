import { NextResponse } from "next/server";
import {
  fetchYouTubeVideos,
  parseVideoFeedCategory,
} from "@/lib/youtube-videos";
import type { VideosApiResponse } from "@/types/video";

export async function GET(request: Request): Promise<NextResponse<VideosApiResponse>> {
  const { searchParams } = new URL(request.url);
  const category = parseVideoFeedCategory(searchParams.get("category"));
  const limitRaw = searchParams.get("limit");
  const limit = limitRaw ? Number.parseInt(limitRaw, 10) : undefined;
  const maxResults =
    limit && Number.isFinite(limit) && limit > 0
      ? Math.min(limit, 24)
      : category === "all"
        ? 4
        : 12;

  const payload = await fetchYouTubeVideos(category, maxResults);

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=300",
    },
  });
}
