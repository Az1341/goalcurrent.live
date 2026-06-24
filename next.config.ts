import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import { REMOTE_IMAGE_HOSTNAMES } from "./src/lib/images";

type RouteRedirect = NonNullable<
  Awaited<ReturnType<NonNullable<NextConfig["redirects"]>>>
>[number];

/** CSP is applied per-request in src/proxy.ts (Next.js 16 middleware). */
const SITE_REDIRECTS: RouteRedirect[] = [
  { source: "/video", destination: "/videos", permanent: true },
  { source: "/video/:path*", destination: "/videos/:path*", permanent: true },
  {
    source: "/worldcup2026/favourites",
    destination: "/favourites",
    permanent: true,
  },
  { source: "/news/articles", destination: "/articles", permanent: true },
  {
    source: "/news/articles/:slug",
    destination: "/articles/:slug",
    permanent: true,
  },
  {
    source: "/news/alireza-beiranvand-iran-world-cup-hero",
    destination: "/articles/alireza-beiranvand-iran-world-cup-hero",
    permanent: true,
  },
  {
    source: "/worldcup2026/match/:fixtureId",
    destination: "/match/:fixtureId",
    permanent: true,
  },
  {
    source: "/:path*",
    has: [{ type: "host", value: "goalcurrent.online" }],
    destination: "https://goalcurrent.live/:path*",
    permanent: true,
  },
  {
    source: "/:path*",
    has: [{ type: "host", value: "www.goalcurrent.online" }],
    destination: "https://goalcurrent.live/:path*",
    permanent: true,
  },
];

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1600],
    imageSizes: [16, 24, 32, 48, 64, 96, 128, 256],
    remotePatterns: REMOTE_IMAGE_HOSTNAMES.map((hostname) => ({
      protocol: "https" as const,
      hostname,
      pathname: "/**",
    })),
  },
  async redirects() {
    return SITE_REDIRECTS;
  },
  async headers() {
    return [
      {
        source: "/.well-known/assetlinks.json",
        headers: [
          { key: "Content-Type", value: "application/json" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Cache-Control", value: "no-cache" },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          { key: "Service-Worker-Allowed", value: "/" },
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          { key: "Content-Type", value: "application/javascript" },
        ],
      },
      {
        source: "/OneSignalSDKWorker.js",
        headers: [
          { key: "Service-Worker-Allowed", value: "/" },
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          { key: "Content-Type", value: "application/javascript" },
        ],
      },
      {
        source: "/manifest.json",
        headers: [
          { key: "Content-Type", value: "application/manifest+json" },
          { key: "Cache-Control", value: "no-cache" },
        ],
      },
      {
        source: "/ads.txt",
        headers: [
          { key: "Content-Type", value: "text/plain; charset=utf-8" },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "geolocation=(), microphone=(), camera=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
  },
});
