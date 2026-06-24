import type { Metadata, Viewport } from "next";
import { Inter, Roboto_Condensed } from "next/font/google";
import { AdSenseScript } from "@/components/ads/AdSenseScript";
import { GA } from "@/components/analytics/GA";
import Layout from "@/components/layout/Layout";
import { OneSignalInit } from "@/components/push/OneSignalInit";
import SiteJsonLd from "@/components/seo/SiteJsonLd";
import { BRAND_THEME_COLOR } from "@/lib/site-integrations";
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_TWITTER_CARD,
} from "@/lib/seo/constants";
import { SITE_URL, SITE_NAME } from "@/lib/site-url";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  preload: true,
  adjustFontFallback: true,
});

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-condensed",
  weight: ["400", "700"],
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: `%s - ${SITE_NAME}`,
    default:
      `${SITE_NAME} - FIFA World Cup 2026 | Live Scores, News & Teams`,
  },
  description:
    `${SITE_NAME} - live scores, fixtures, groups, teams and standings for FIFA World Cup 2026.`,
  openGraph: {
    title: `${SITE_NAME} - FIFA World Cup 2026`,
    description:
      "Live scores, fixtures, groups, teams and standings for FIFA World Cup 2026.",
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    images: [
      {
        url: DEFAULT_OG_IMAGE.url,
        width: DEFAULT_OG_IMAGE.width,
        height: DEFAULT_OG_IMAGE.height,
        alt: DEFAULT_OG_IMAGE.alt,
      },
    ],
  },
  twitter: {
    card: DEFAULT_TWITTER_CARD,
    title: `${SITE_NAME} - FIFA World Cup 2026`,
    description:
      "Live scores, fixtures, groups, teams and standings for FIFA World Cup 2026.",
    images: [DEFAULT_OG_IMAGE.url],
  },
  alternates: {
    canonical: SITE_URL,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "GoalCurrent",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/icon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "192x192" }],
  },
  other: {
    "msapplication-TileColor": BRAND_THEME_COLOR,
    "msapplication-TileImage": "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: BRAND_THEME_COLOR,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoCondensed.variable}`}>
      <body>
        <SiteJsonLd />
        <Layout>{children}</Layout>
        <GA />
        <OneSignalInit />
        <AdSenseScript />
      </body>
    </html>
  );
}

