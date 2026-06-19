import type { Metadata } from "next";
import UnderConstruction from "@/components/UnderConstruction";
import { buildPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site-url";

export const metadata: Metadata = buildPageMetadata({
  title: "About",
  description: `About ${SITE_NAME} — independent World Cup 2026 fan site.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <UnderConstruction
      title="About"
      emoji="ℹ️"
      description={`Learn more about ${SITE_NAME} — who we are and what we're building.`}
    />
  );
}
