import type { Metadata } from "next";
import UnderConstruction from "@/components/UnderConstruction";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "About",
  description: "About GoalCurrent.online — independent World Cup 2026 fan site.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <UnderConstruction
      title="About"
      emoji="ℹ️"
      description="Learn more about GoalCurrent.online — who we are and what we're building."
    />
  );
}
