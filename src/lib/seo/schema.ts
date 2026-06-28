import { routing } from "@/i18n/routing";
import { localizedUrl } from "@/lib/i18n/urls";
import {
  DEFAULT_OG_IMAGE_ALT,
  EDITORIAL_AUTHOR,
  EDITORIAL_PUBLISHER,
} from "@/lib/seo/constants";
import { toIsoDate } from "@/lib/seo/dates";
import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/site-url";
import { defaultOgImageUrl } from "@/lib/seo/constants";

export type ArticleSchemaInput = {
  path: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  image?: string;
  locale?: string;
};

export type SportsEventSchemaInput = {
  name: string;
  startDate: string;
  path: string;
  homeTeamName: string;
  awayTeamName: string;
  venueName?: string;
  eventStatus?: string;
  description?: string;
  locale?: string;
  country?: string;
  competition?: string;
};

export type SportsTeamSchemaInput = {
  name: string;
  url: string;
  sport?: string;
  memberOfName: string;
  memberOfType?: "SportsEvent" | "SportsOrganization";
  locationName?: string;
};

type SchemaNode = Record<string, unknown>;

function stripContext(node: SchemaNode): SchemaNode {
  const { "@context": _context, ...rest } = node;
  return rest;
}

/** Combine multiple schema.org nodes without duplicate @context keys. */
export function combineSchemaGraph(
  nodes: (SchemaNode | null | undefined)[],
): SchemaNode {
  const valid = nodes.filter(
    (node): node is SchemaNode =>
      node != null && Object.keys(node).length > 0,
  );
  if (valid.length === 0) {
    return { "@context": "https://schema.org" };
  }
  if (valid.length === 1) {
    return valid[0]["@context"]
      ? valid[0]
      : { "@context": "https://schema.org", ...valid[0] };
  }
  return {
    "@context": "https://schema.org",
    "@graph": valid.map((node) => stripContext(node)),
  };
}

export function organizationSchema(): SchemaNode {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/icons/icon-192.png"),
  };
}

export function webSiteSchema(locale = "en"): SchemaNode {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: locale,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/worldcup2026/teams?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function siteGraphSchema(locale = "en"): SchemaNode {
  return combineSchemaGraph([organizationSchema(), webSiteSchema(locale)]);
}

export function newsArticleSchema(input: ArticleSchemaInput): SchemaNode {
  const locale = input.locale ?? routing.defaultLocale;
  const url = localizedUrl(input.path, locale);
  const published = toIsoDate(input.datePublished);
  const modified = toIsoDate(input.dateModified ?? input.datePublished);

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: input.headline,
    description: input.description,
    datePublished: published,
    dateModified: modified,
    inLanguage: locale,
    image: [input.image ?? defaultOgImageUrl()],
    author: {
      "@type": "Person",
      name: input.author ?? EDITORIAL_AUTHOR,
    },
    publisher: {
      "@type": "Organization",
      name: EDITORIAL_PUBLISHER,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/icons/icon-192.png"),
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
  };
}

export function sportsEventSchema(
  input: SportsEventSchemaInput,
): SchemaNode | null {
  const homeTeam = input.homeTeamName?.trim() ?? "";
  const awayTeam = input.awayTeamName?.trim() ?? "";

  if (!homeTeam && !awayTeam) {
    return null;
  }

  const locale = input.locale ?? routing.defaultLocale;
  const url = localizedUrl(input.path, locale);
  const startDate = input.startDate || new Date().toISOString();

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "@id": url,
    url,
    name: `${homeTeam || "Home"} vs ${awayTeam || "Away"}`,
    startDate,
    eventStatus: input.eventStatus ?? "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: input.venueName || "TBD",
      address: {
        "@type": "PostalAddress",
        addressCountry: input.country || "TBD",
      },
    },
    performer: [
      { "@type": "SportsTeam", name: homeTeam || "" },
      { "@type": "SportsTeam", name: awayTeam || "" },
    ],
    organizer: {
      "@type": "Organization",
      name: input.competition || "Football",
    },
  };
}

export function sportsTeamSchema(input: SportsTeamSchemaInput): SchemaNode {
  const memberOfType = input.memberOfType ?? "SportsOrganization";

  return {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    name: input.name,
    sport: input.sport ?? "Soccer",
    url: input.url,
    memberOf: {
      "@type": memberOfType,
      name: input.memberOfName,
    },
    location: input.locationName
      ? {
          "@type": "Place",
          name: input.locationName,
        }
      : undefined,
    logo: defaultOgImageUrl(),
  };
}

export { DEFAULT_OG_IMAGE_ALT };
