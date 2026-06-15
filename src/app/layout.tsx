import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.goalcurrent.online"),
  title: "GoalCurrent.online — FIFA World Cup 2026 | Live Scores, News & Teams",
  description:
    "GoalCurrent.online — live scores, fixtures, groups, teams and standings for FIFA World Cup 2026.",
  openGraph: {
    title: "GoalCurrent.online — FIFA World Cup 2026",
    description:
      "Live scores, fixtures, groups, teams and standings for FIFA World Cup 2026.",
    url: "https://www.goalcurrent.online/",
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
      <body className={`${barlow.variable} ${barlowCondensed.variable}`}>
        {children}
      </body>
    </html>
  );
}
