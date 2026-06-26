import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { captureRouteError } from "@/lib/log";
import {
  refreshContentCache,
  writeDevCacheSnapshots,
} from "@/utils/cache/store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) {
    return process.env.NODE_ENV === "development";
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader === `Bearer ${secret}`) {
    return true;
  }

  return request.headers.get("x-cron-secret") === secret;
}

export async function GET(request: Request): Promise<NextResponse> {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("[cron] refresh-content start", {
      youtubeKeyPresent: Boolean(process.env.YOUTUBE_API_KEY?.trim()),
      nodeEnv: process.env.NODE_ENV,
    });

    const result = await refreshContentCache();
    await writeDevCacheSnapshots(result);

    revalidateTag("content-news", "days");
    revalidateTag("content-videos", "days");
    revalidateTag("content-articles", "days");

    return NextResponse.json({
      ok: true,
      refreshedAt: new Date().toISOString(),
      counts: {
        news: result.news.items.length,
        videos: result.videos.items.length,
        articles: result.articles.items.length,
      },
      sources: {
        news: result.news.sources,
        videos: result.videos.sources,
        articles: result.articles.sources,
      },
      debug: {
        youtubeKeyPresent: Boolean(process.env.YOUTUBE_API_KEY?.trim()),
      },
    });
  } catch (error) {
    captureRouteError("api/cron/refresh-content", error);
    return NextResponse.json(
      {
        ok: true,
        usedSeed: true,
        refreshedAt: new Date().toISOString(),
        error: "Refresh failed - serving cached seed content",
      },
      { status: 200 },
    );
  }
}
