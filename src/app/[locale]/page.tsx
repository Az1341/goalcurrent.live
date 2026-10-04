export const revalidate = 600;
import { getFootballSnapshot } from "@/lib/free-football/server";

import HomeClient from "@/app/[locale]/HomeClient";
import type { Metadata } from "next";
import { HOME_HERO_BG } from "@/lib/critical-assets";
import { buildPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site-url";
import { normalizePageTitleText } from "@/lib/seo/canonical-titles";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    title: normalizePageTitleText(
      `${SITE_NAME} | Football Results, Fixtures and News`,
    ),
    description: `${SITE_NAME} | delayed final football results, upcoming fixtures, news and videos from supported competitions.`,
    path: "/",
    absoluteTitle: true,
    locale,
  });
}

export default async function HomePage() {
  const snapshot = await getFootballSnapshot();
  return (
    <>
      <link
        rel="preload"
        href={HOME_HERO_BG}
        as="image"
        fetchPriority="high"
        media="(min-width: 768px)"
      />
      <HomeClient snapshot={snapshot} />
    </>
  );
}
