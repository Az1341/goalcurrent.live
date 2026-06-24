import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { CONTENT_SECURITY_POLICY } from "@/lib/security/csp";

const LEGACY_GROUP_PATH = /^\/worldcup2026\/groups\/group-([a-l])$/i;

function applySecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("Content-Security-Policy", CONTENT_SECURITY_POLICY);
  return response;
}

/** Next.js 16 proxy — CSP on every route + legacy WC26 group redirects. */
export function proxy(request: NextRequest) {
  const legacy = LEGACY_GROUP_PATH.exec(request.nextUrl.pathname);
  if (legacy) {
    const url = request.nextUrl.clone();
    url.pathname = `/worldcup2026/groups/${legacy[1]!.toLowerCase()}`;
    return applySecurityHeaders(NextResponse.redirect(url, 307));
  }

  return applySecurityHeaders(NextResponse.next());
}

export const proxyConfig = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sw.js|OneSignalSDKWorker.js|manifest.json|ads.txt).*)",
  ],
};