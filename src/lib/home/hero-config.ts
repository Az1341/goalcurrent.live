import { HOME_HERO_BG } from "@/lib/critical-assets";

export type HomeHeroVariant = "default" | "marquee";

export type HomeMarqueeHero = {
  readonly eyebrow: string;
  readonly headline: string;
  readonly subheadline?: string;
  readonly backgroundImage: string;
  readonly fixtureId?: string;
  readonly ctaHref?: string;
  readonly ctaLabel?: string;
};

export type HomeHeroConfig = {
  readonly variant: HomeHeroVariant;
  readonly marquee?: HomeMarqueeHero;
};

/**
 * Swap hero presentation by changing `variant` and optional `marquee` content.
 * `default` — flat themed background + tagline.
 * `marquee` — stadium photo + match-specific headline.
 */
export const HOME_HERO_CONFIG: HomeHeroConfig = {
  variant: "default",
  marquee: {
    eyebrow: "MATCH OF THE DAY",
    headline: "EL CLÁSICO",
    subheadline: "LIVE NOW",
    backgroundImage: HOME_HERO_BG,
    ctaLabel: "MATCH CENTRE",
    ctaHref: "/live",
  },
};
