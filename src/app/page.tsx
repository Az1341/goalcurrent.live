import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site-url";

const HomeClient = dynamic(() => import("@/app/HomeClient"), {
  ssr: true,
});

export const metadata: Metadata = buildPageMetadata({
  title: `${SITE_NAME} — Live Football Scores, Fixtures & News`,
  description: `${SITE_NAME} — live football scores, fixtures, results, standings and news from leagues and tournaments worldwide.`,
  path: "/",
  absoluteTitle: true,
});

export default function HomePage() {
  return <HomeClient />;
}
