import type { NextConfig } from "next";

/** Ported from GoalCurrent.live vercel.json - headers only (no legacy routes/rewrites). */
const INTEGRATION_CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://cdn.onesignal.com https://*.onesignal.com https://onesignal.com https://api.onesignal.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://fundingchoicesmessages.google.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.onesignal.com https://*.onesignal.com https://onesignal.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: https:",
  "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://analytics.google.com https://onesignal.com https://*.onesignal.com https://api.onesignal.com https://cdn.onesignal.com https://fundingchoicesmessages.google.com https://*.google.com",
  "frame-src https://www.youtube.com https://googleads.g.doubleclick.net https://td.doubleclick.net https://fundingchoicesmessages.google.com",
  "worker-src 'self' blob: https://cdn.onesignal.com",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'self'",
].join("; ");

const nextConfig: NextConfig = {
  async redirects() {
    return [
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
  },
  async headers() {
    return [
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
          { key: "Content-Security-Policy", value: INTEGRATION_CSP },
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

export default nextConfig;

