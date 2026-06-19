import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Layout from "@/components/layout/Layout";
import StagingIntegrations from "@/components/layout/StagingIntegrations";
import { BRAND_THEME_COLOR } from "@/lib/site-integrations";
import { SITE_URL, SITE_NAME } from "@/lib/site-url";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
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
    <html lang="en">
      <body className={inter.variable}>
        <Layout>{children}</Layout>
        <StagingIntegrations />
      </body>
    </html>
  );
}

