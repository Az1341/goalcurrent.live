import { NextResponse } from "next/server";
import { captureRouteError } from "@/lib/log";
import {
  fetchNewsFeed,
  parseNewsFeedCategory,
} from "@/lib/news-rss";
import type { NewsApiResponse } from "@/types/news";

export async function GET(request: Request): Promise<NextResponse<NewsApiResponse>> {
  const { searchParams } = new URL(request.url);
  const category = parseNewsFeedCategory(searchParams.get("category"));

  try {
    const payload = await fetchNewsFeed(category);
    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    captureRouteError("api/news", error);
    const empty: NewsApiResponse = {
      articles: [],
      sources: [],
      count: 0,
      fetched: new Date().toISOString(),
      error: "Failed to fetch news",
    };
    return NextResponse.json(empty, {
      status: 500,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
      },
    });
  }
}
