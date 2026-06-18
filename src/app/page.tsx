import type { Metadata } from "next";
import HomeClient from "@/app/HomeClient";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = buildPageMetadata({
  title:
    "GoalCurrent.online — FIFA World Cup 2026 | Live Scores, News & Teams",
  description:
    "GoalCurrent.online — live scores, fixtures, groups, teams and standings for FIFA World Cup 2026.",
  path: "/",
  absoluteTitle: true,
});

export default function HomePage() {
  return <HomeClient />;
}
