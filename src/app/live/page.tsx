import type { Metadata } from "next";

import LiveMatchCentre from "@/components/live/LiveMatchCentre";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Live Scores",
  description: "World Cup 2026 live scores on GoalCurrent.online.",
  path: "/live",
});

export default function LivePage() {
  return <LiveMatchCentre />;
}

