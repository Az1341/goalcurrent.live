import type { Metadata } from "next";
import BracketPageClient from "@/components/wc26/bracket/BracketPageClient";
import { buildPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: `World Cup 2026 Archive · Final Bracket — ${SITE_NAME}`,
  description:
    "World Cup 2026 Archive — final knockout bracket from Round of 32 to the Final. Historical results from curated GoalCurrent data.",
  path: "/worldcup2026/bracket",
});

export default function BracketPage() {
  return <BracketPageClient />;
}