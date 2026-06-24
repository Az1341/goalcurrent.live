import type { NextConfig } from "next";

type RouteRedirect = NonNullable<
  Awaited<ReturnType<NonNullable<NextConfig["redirects"]>>>
>[number];

/**
 * Content-Security-Policy for GoalCurrent.live integrations.
 *
 * script-src 'unsafe-inline' — required for Next.js inline bootstrap, Google tag/AdSense
 *   loader snippets, and OneSignal SDK injection (no nonce pipeline on Netlify/Vercel static).
 * unsafe-eval omitted — not required for GA, AdSense, or OneSignal in production.
 */
const INTEGRATION_CSP = [
  "default-src 'self'",
  [
    "script-src 'self' 'unsafe-inline'",
    "https://www.googletagmanager.com", // Google Analytics / Tag Manager
    "https://www.google-analytics.com", // gtag.js
    "https://cdn.onesignal.com", // OneSignal Web SDK
    "https://*.onesignal.com",
    "https://onesignal.com",
    "https://api.onesignal.com",
    "https://pagead2.googlesyndication.com", // Google AdSense
    "https://googleads.g.doubleclick.net", // AdSense / Google Ads frames
    "https://fundingchoicesmessages.google.com", // AdSense consent / FC messages
  ].join(" "),
  [
    "style-src 'self' 'unsafe-inline'",
    "https://fonts.googleapis.com", // Google Fonts CSS
    "https://cdn.onesignal.com",
    "https://*.onesignal.com",
    "https://onesignal.com",
  ].join(" "),
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: https:", // flags, team logos, article images, ad creatives
  [
    "connect-src 'self'",
    "https://www.google-analytics.com",
    "https://region1.google-analytics.com",
    "https://analytics.google.com",
    "https://onesignal.com",
    "https://*.onesignal.com",
    "https://api.onesignal.com",
    "https://cdn.onesignal.com",
    "https://fundingchoicesmessages.google.com",
    "https://*.google.com", // AdSense / GA beacons
  ].join(" "),
  [
    "frame-src",
    "https://www.youtube.com", // embedded highlights
    "https://googleads.g.doubleclick.net",
    "https://td.doubleclick.net",
    "https://fundingchoicesmessages.google.com",
  ].join(" "),
  "worker-src 'self' blob: https://cdn.onesignal.com",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'self'",
].join("; ");

/** All site redirects — single source of truth (vercel.json redirects removed). */
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
    has: [{ type: "host", value: "goalcurrent.live" }],
    destination: "https://www.goalcurrent.live/:path*",
    permanent: true,
  },
  {
    source: "/:path*",
    has: [{ type: "host", value: "goalcurrent.online" }],
    destination: "https://www.goalcurrent.live/:path*",
    permanent: true,
  },
  {
    source: "/:path*",
    has: [{ type: "host", value: "www.goalcurrent.online" }],
    destination: "https://www.goalcurrent.live/:path*",
    permanent: true,
  },
];

const nextConfig: NextConfig = {
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
          { key: "
