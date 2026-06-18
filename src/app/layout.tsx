import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Layout from "@/components/layout/Layout";
import { SITE_URL } from "@/lib/site-url";
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
    template: "%s — GoalCurrent.online",
    default:
      "GoalCurrent.online — FIFA World Cup 2026 | Live Scores, News & Teams",
  },
  description:
    "GoalCurrent.online — live scores, fixtures, groups, teams and standings for FIFA World Cup 2026.",
  openGraph: {
    title: "GoalCurrent.online — FIFA World Cup 2026",
    description:
      "Live scores, fixtures, groups, teams and standings for FIFA World Cup 2026.",
    url: SITE_URL,
    siteName: "GoalCurrent.online",
    type: "website",
  },
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
      </body>
    </html>
  );
}
