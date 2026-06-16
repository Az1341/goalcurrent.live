import { NextRequest, NextResponse } from "next/server";
import { getFixtureById } from "@/data/wc26";
import { fetchWc26MatchDetail } from "@/lib/server/wc26-match-detail";

export const dynamic = "force-dynamic";

type RouteParams = {
  params: Promise<{ fixtureId: string }>;
};

export async function GET(
  _request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse> {
  const { fixtureId: rawId } = await params;
  const fixtureId = decodeURIComponent(rawId);

  if (!getFixtureById(fixtureId)) {
    return NextResponse.json({ error: "Fixture not found" }, { status: 404 });
  }

  const detail = await fetchWc26MatchDetail(fixtureId);

  return NextResponse.json(detail, {
    headers: {
      "Cache-Control": "s-maxage=30, stale-while-revalidate=30",
    },
  });
}
