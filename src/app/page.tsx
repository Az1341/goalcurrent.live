import dynamic from "next/dynamic";
import type { Metadata } from "next";
import HomeFeaturedMatchJsonLd from "@/components/seo/HomeFeaturedMatchJsonLd";
import { WC26_FIXTURES } from "@/data/wc26";
import { HOME_HERO_BG } from "@/lib/critical-assets";
import { buildPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site-url";
import { selectFeaturedFixture } from "@/lib/wc26-live";

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
  const featuredFixture = selectFeaturedFixture(WC26_FIXTURES);

  return (
    <>
      <link
        rel="preload"
        href={HOME_HERO_BG}
        as="image"
        fetchPriority="high"
      />
      {featuredFixture ? <HomeFeaturedMatchJsonLd fixture={featuredFixture} /> : null}
      <HomeClient />
    </>
  );
}
