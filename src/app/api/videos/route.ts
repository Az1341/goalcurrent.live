import { NextResponse } from "next/server";
import { captureRouteError } from "@/lib/log";
import { fetchCachedVideos } from "@/content/readers";
import { parseVideoFeedCategory } from "@/lib/youtube-videos";
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

  try {
    const payload = await fetchCachedVideos(maxResults);

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    captureRouteError("api/videos", error);
    const empty: VideosApiResponse = {
      videos: [],
      count: 0,
      fetchedAt: new Date().toISOString(),
      error: "Failed to fetch videos",
    };
    return NextResponse.json(empty, {
      status: 500,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
      },
    });
  }
}
