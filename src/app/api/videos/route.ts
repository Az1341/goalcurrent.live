import { NextResponse } from "next/server";
import { parseSearchParams } from "@/lib/api/response";
import { captureRouteError } from "@/lib/log";
import { fetchCachedVideos } from "@/content/readers";
import { parseVideoFeedCategory } from "@/lib/youtube-videos";
import { videoCategoryQuerySchema } from "@/lib/validation/schemas";
import type { VideosApiResponse } from "@/types/video";

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const parsed = parseSearchParams(searchParams, videoCategoryQuerySchema);
  if ("error" in parsed) {
    return parsed.error;
  }
  const category = parseVideoFeedCategory(parsed.data.category);
  const maxResults =
    parsed.data.limit ??
    (category === "all" ? 4 : 12);

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
