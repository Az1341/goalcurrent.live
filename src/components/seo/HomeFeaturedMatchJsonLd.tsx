import JsonLd from "@/components/seo/JsonLd";
import { buildHomeFeaturedSportsEventSchema } from "@/lib/seo/home-featured-schema";
import type { EffectiveFixture } from "@/lib/wc26-fixture-overlay";

type HomeFeaturedMatchJsonLdProps = {
  fixture: EffectiveFixture;
};

/** Server-rendered SportsEvent schema for the homepage featured match. */
export default function HomeFeaturedMatchJsonLd({ fixture }: HomeFeaturedMatchJsonLdProps) {
  return <JsonLd data={buildHomeFeaturedSportsEventSchema(fixture)} />;
}