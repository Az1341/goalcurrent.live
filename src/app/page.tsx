import type { Metadata } from "next";
import HomeClient from "@/app/HomeClient";
import { buildPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site-url";

export const metadata: Metadata = buildPageMetadata({
  title: `${SITE_NAME} — FIFA World Cup 2026 | Live Scores, News & Teams`,
  description: `${SITE_NAME} — live scores, fixtures, groups, teams and standings for FIFA World Cup 2026.`,
  path: "/",
  absoluteTitle: true,
});

export default function HomePage() {
  return <HomeClient />;
}
