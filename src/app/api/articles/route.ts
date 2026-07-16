import { NextResponse } from "next/server";
import { respondError } from "@/lib/api/response";
import { validateGetQuery } from "@/lib/api/response";
import { emptyQuerySchema } from "@/lib/validation/schemas";
import { captureRouteError } from "@/lib/log";
import { fetchSyndicatedArticles } from "@/content/readers";

export async function GET(request: Request): Promise<NextResponse> {
  const validated = validateGetQuery(request, emptyQuerySchema);
  if ("error" in validated) {
    return validated.error;
  }

  try {
    const articles = await fetchSyndicatedArticles();
    return NextResponse.json(
      {
        articles,
        count: articles.length,
        fetched: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
        },
      },
    );
  } catch (error) {
    captureRouteError("api/articles", error);
    return NextResponse.json(
      {
        articles: [],
        count: 0,
        fetched: new Date().toISOString(),
        error: "Failed to fetch articles",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
        },
      },
    );
  }
}