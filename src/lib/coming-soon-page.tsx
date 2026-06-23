import type { Metadata } from "next";
import UnderConstruction, {
  type ComingSoonLink,
} from "@/components/UnderConstruction";
import { buildPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site-url";

export type ComingSoonConfig = {
  title: string;
  path: string;
  description?: string;
  emoji?: string;
  links?: ComingSoonLink[];
  backHref?: string;
  backLabel?: string;
};

export function buildComingSoonMetadata(config: ComingSoonConfig): Metadata {
  return {
    ...buildPageMetadata({
      title: config.title,
      description:
        config.description ??
        `${config.title} on ${SITE_NAME} — coming soon.`,
      path: config.path,
    }),
    robots: { index: false, follow: true },
  };
}

export function ComingSoonPage(config: ComingSoonConfig) {
  return (
    <UnderConstruction
      title={config.title}
      emoji={config.emoji}
      description={
        config.description ??
        `${config.title} is coming soon on ${SITE_NAME}.`
      }
      links={config.links ?? []}
      backHref={config.backHref}
      backLabel={config.backLabel}
    />
  );
}
