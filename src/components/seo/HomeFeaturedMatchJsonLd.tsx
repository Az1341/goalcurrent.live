import JsonLd from "@/components/seo/JsonLd";
import { buildHomeFeaturedSportsEventSchema } from "@/lib/seo/home-featured-schema";
import type { EffectiveFixture } from "@/lib/wc26-fixture-overlay";

type HomeFeaturedMatchJsonLdProps = {
  fixture: EffectiveFixture;
  locale: string;
};

/** Server-rendered SportsEvent schema for the homepage featured match. */
export default function HomeFeaturedMatchJsonLd({
  fixture,
  locale,
}: HomeFeaturedMatchJsonLdProps) {
  return <JsonLd data={buildHomeFeaturedSportsEventSchema(fixture, locale)} />;
}