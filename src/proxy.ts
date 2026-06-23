import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LEGACY_GROUP_PATH = /^\/worldcup2026\/groups\/group-([a-l])$/i;

/** 307 legacy /groups/group-a → canonical /groups/a (no duplicate content). */
export function proxy(request: NextRequest) {
  const legacy = LEGACY_GROUP_PATH.exec(request.nextUrl.pathname);
  if (!legacy) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/worldcup2026/groups/${legacy[1]!.toLowerCase()}`;
  return NextResponse.redirect(url, 307);
}

export const proxyConfig = {
  matcher: ["/worldcup2026/groups/:path*"],
};
