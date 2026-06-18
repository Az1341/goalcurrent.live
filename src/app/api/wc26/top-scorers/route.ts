import { NextResponse } from "next/server";
import { fetchWc26TopScorers } from "@/lib/server/wc26-top-scorers";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  try {
    const body = await fetchWc26TopScorers();

    return NextResponse.json(body, {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[api/wc26/top-scorers]", message);
    return NextResponse.json(
      { error: "Failed to fetch WC26 top scorers", detail: message },
      { status: 500 },
    );
  }
}
