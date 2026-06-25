import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import HomeFeaturedMatchJsonLd from "@/components/seo/HomeFeaturedMatchJsonLd";
import { WC26_FIXTURES } from "@/data/wc26";
import { HOME_HERO_BG } from "@/lib/critical-assets";
import { buildPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site-url";
import { selectFeaturedFixtures } from "@/lib/wc26-live";

const HomeClient = dynamic(() => import("@/app/[locale]/HomeClient"), {
  ssr: true,
});

export const metadata: Metadata = buildPageMetadata({
  title: `${SITE_NAME} — Live Football Scores, Fixtures & News`,
  description: `${SITE_NAME} — live football scores, fixtures, results, standings and news from leagues and tournaments worldwide.`,
  path: "/",
  absoluteTitle: true,
});

export default async function HomePage() {
  const locale = await getLocale();
  const featuredSelection = selectFeaturedFixtures(WC26_FIXTURES);

  return (
    <>
      <link
        rel="preload"
        href={HOME_HERO_BG}
        as="image"
        fetchPriority="high"
      />
      {featuredSelection.fixtures.map((fixture) => (
        <HomeFeaturedMatchJsonLd
          key={fixture.id}
          fixture={fixture}
          locale={locale}
        />
      ))}
      <HomeClient />
    </>
  );
}
