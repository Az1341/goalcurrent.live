import type { Metadata, Viewport } from "next";
import { Inter, Roboto_Condensed, Noto_Sans_Arabic, Vazirmatn } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { AdSenseScript } from "@/components/ads/AdSenseScript";
import { GA } from "@/components/analytics/GA";
import Layout from "@/components/layout/Layout";
import { OneSignalInit } from "@/components/push/OneSignalInit";
import SiteJsonLd from "@/components/seo/SiteJsonLd";
import { routing } from "@/i18n/routing";
import { getDirection } from "@/i18n/locales";
import { BRAND_THEME_COLOR } from "@/lib/site-integrations";
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_TWITTER_CARD,
} from "@/lib/seo/constants";
import { SITE_URL, SITE_NAME } from "@/lib/site-url";
import "../globals.css";

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

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-noto-arabic",
  weight: ["400", "500", "600", "700"],
  preload: false,
  adjustFontFallback: true,
});

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-vazirmatn",
  weight: ["400", "500", "600", "700"],
  preload: false,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: `%s - ${SITE_NAME}`,
    default: `${SITE_NAME} - FIFA World Cup 2026 | Live Scores, News & Teams`,
  },
  description: `${SITE_NAME} - live scores, fixtures, groups, teams and standings for FIFA World Cup 2026.`,
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

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const direction = getDirection(locale);
  const fontClass = `${inter.variable} ${robotoCondensed.variable} ${notoSansArabic.variable} ${vazirmatn.variable}`;
  const rtlFont =
    locale === "fa"
      ? "var(--font-vazirmatn)"
      : locale === "ar"
        ? "var(--font-noto-arabic)"
        : undefined;

  return (
    <html
      lang={locale}
      dir={direction}
      className={fontClass}
      style={rtlFont ? { fontFamily: `${rtlFont}, var(--font-inter), sans-serif` } : undefined}
    >
      <body>
        <NextIntlClientProvider messages={messages}>
          <SiteJsonLd locale={locale} />
          <Layout>{children}</Layout>
          <GA />
          <OneSignalInit />
          <AdSenseScript />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
