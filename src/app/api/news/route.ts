import { NextResponse } from "next/server";
import { fetchNewsFeed } from "@/lib/news-rss";
import type { NewsApiResponse } from "@/types/news";

export async function GET(): Promise<NextResponse<NewsApiResponse>> {
  try {
    const payload = await fetchNewsFeed();
    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
      },
    });
  } catch {
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
