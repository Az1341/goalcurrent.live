import type { Metadata } from "next";
import BracketPageClient from "@/components/wc26/bracket/BracketPageClient";
import { buildPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site-url";

export const metadata: Metadata = buildPageMetadata({
  title: `World Cup 2026 Bracket | Road to the Final — ${SITE_NAME}`,
  description:
    "Live World Cup 2026 knockout bracket. Track all 64 matches from Round of 32 to the Final. Scores, fixtures and results updated in real time.",
  path: "/worldcup2026/bracket",
});

export default function BracketPage() {
  return <BracketPageClient />;
}
