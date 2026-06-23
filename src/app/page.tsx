import type { Metadata } from "next";
import HomeClient from "@/app/HomeClient";
import { buildPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site-url";

export const metadata: Metadata = buildPageMetadata({
  title: `${SITE_NAME} — Live Football Scores, Fixtures & News`,
  description: `${SITE_NAME} — live football scores, fixtures, results, standings and news from leagues and tournaments worldwide.`,
  path: "/",
  absoluteTitle: true,
});

export default function HomePage() {
  return <HomeClient />;
}
