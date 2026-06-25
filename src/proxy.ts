import createIntlMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { CONTENT_SECURITY_POLICY } from "@/lib/security/csp";

const LEGACY_GROUP_PATH = /^\/worldcup2026\/groups\/group-([a-l])$/i;
const LOCALE_PREFIX = /^\/(en|fa|ar|fr|de|nl|es|pt|it)(\/|$)/;
const LOCALE_NEXT_ASSET =
  /^\/(en|fa|ar|fr|de|nl|es|pt|it)\/_next\/(.+)$/;

const handleI18n = createIntlMiddleware(routing);

const SITE_REDIRECTS: Array<{ source: RegExp; destination: (match: RegExpMatchArray, localePrefix: string) => string }> = [
  {
    source: /^\/home\/?$/,
    destination: (_m, prefix) => prefix || "/",
  },
  {
    source: /^\/video\/?$/,
    destination: (_m, prefix) => `${prefix}/videos`,
  },
  {
    source: /^\/video\/(.+)$/,
    destination: (m, prefix) => `${prefix}/videos/${m[1]}`,
  },
  {
    source: /^\/worldcup2026\/favourites\/?$/,
    destination: (_m, prefix) => `${prefix}/favourites`,
  },
  {
    source: /^\/news\/articles\/?$/,
    destination: (_m, prefix) => `${prefix}/articles`,
  },
  {
    source: /^\/news\/articles\/(.+)$/,
    destination: (m, prefix) => `${prefix}/articles/${m[1]}`,
  },
  {
    source: /^\/news\/alireza-beiranvand-iran-world-cup-hero\/?$/,
    destination: (_m, prefix) =>
      `${prefix}/articles/alireza-beiranvand-iran-world-cup-hero`,
  },
  {
    source: /^\/worldcup2026\/match\/(.+)$/,
    destination: (m, prefix) => `${prefix}/match/${m[1]}`,
  },
];

function applySecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("Content-Security-Policy", CONTENT_SECURITY_POLICY);
  return response;
}

function localePrefixFromPath(pathname: string): string {
  const match = LOCALE_PREFIX.exec(pathname);
  if (!match) return "";
  const locale = match[1];
  return locale === routing.defaultLocale ? "" : `/${locale}`;
}

function applyLegacyRedirects(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;
  const localePrefix = localePrefixFromPath(pathname);
  const pathWithoutLocale = localePrefix
    ? pathname.slice(localePrefix.length) || "/"
    : pathname;

  const legacyGroup = LEGACY_GROUP_PATH.exec(pathWithoutLocale);
  if (legacyGroup) {
    const url = request.nextUrl.clone();
    url.pathname = `${localePrefix}/worldcup2026/groups/${legacyGroup[1]!.toLowerCase()}`;
    return applySecurityHeaders(NextResponse.redirect(url, 307));
  }

  for (const rule of SITE_REDIRECTS) {
    const match = rule.source.exec(pathWithoutLocale);
    if (match) {
      const url = request.nextUrl.clone();
      url.pathname = rule.destination(match, localePrefix);
      return applySecurityHeaders(NextResponse.redirect(url, 308));
    }
  }

  return null;
}

/** Next.js 16 proxy — locale routing, legacy redirects, CSP. */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Client navigations sometimes request /{locale}/_next/* — rewrite to /_next/*
  const localeAsset = LOCALE_NEXT_ASSET.exec(pathname);
  if (localeAsset) {
    const url = request.nextUrl.clone();
    url.pathname = `/_next/${localeAsset[2]}`;
    return NextResponse.rewrite(url);
  }

  if (pathname.startsWith("/_next/")) {
    return NextResponse.next();
  }

  const legacyRedirect = applyLegacyRedirects(request);
  if (legacyRedirect) {
    return legacyRedirect;
  }

  const response = handleI18n(request);
  return applySecurityHeaders(response);
}

export const proxyConfig = {
  matcher: [
    "/((?!api|_next|_vercel|favicon.ico|sw.js|OneSignalSDKWorker.js|manifest.json|ads.txt|.*\\..*).*)",
  ],
};
