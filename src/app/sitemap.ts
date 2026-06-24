import type { MetadataRoute } from "next";
import {
  articleHref,
  ARTICLE_INDEX,
  getAllCanonicalArticleSlugs,
  getArticleBySlug,
} from "@/data/articles";
import { EDITORIAL_ARTICLES } from "@/data/editorial";
import { getAllClubSlugs } from "@/data/pl-clubs";
import {
  WC26_FIXTURES,
  WC26_GROUP_IDS,
  WC26_TEAMS,
} from "@/data/wc26";
import { fetchPlFixtures } from "@/lib/pl/api";
import { groupHref } from "@/lib/wc26-groups";
import { matchHref } from "@/lib/wc26-match";
import { absoluteUrl } from "@/lib/site-url";
import { teamHref } from "@/lib/wc26-teams";

/** Indexable static routes (exclude redirect sources such as /video/*). */
const STATIC_PATHS = [
  "/",
  "/live",
  "/favourites",
  "/favourites/clubs",
  "/favourites/players",
  "/news",
  "/news/world-cup",
  "/news/premier-league",
  "/news/transfers",
  "/articles",
  "/about",
  "/contact",
  "/terms",
  "/privacy",
  "/cookies",
  "/affiliate-disclosure",
  "/worldcup2026",
  "/worldcup2026/groups",
  "/worldcup2026/fixtures",
  "/worldcup2026/standings",
  "/worldcup2026/teams",
  "/worldcup2026/venues",
  "/worldcup2026/bracket",
  "/worldcup2026/players",
  "/premier-league",
  "/premier-league/table",
  "/premier-league/2025-26/table",
  "/premier-league/fixtures",
  "/premier-league/live",
  "/premier-league/clubs",
  "/premier-league/players",
  "/premier-league/statistics",
  "/premier-league/transfers",
  "/videos",
  "/videos/premier-league",
  "/videos/world-cup",
  "/transfers",
  "/transfers/rumours",
  "/transfers/completed",
  "/transfers/free-agents",
  "/statistics/assists",
  "/statistics/clean-sheets",
  "/statistics/disciplinary",
  "/statistics/live",
  "/statistics/player-rankings",
  "/statistics/players",
  "/statistics/teams",
  "/statistics/top-scorers",
] as const;

type SitemapEntry = MetadataRoute.Sitemap[number];
type ChangeFrequency = NonNullable<SitemapEntry["changeFrequency"]>;

function parseArticleDate(date: string): Date {
  const iso = Date.parse(date);
  if (!Number.isNaN(iso)) {
    return new Date(iso);
  }
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function articleLastModified(slug: string, fallback: Date): Date {
  const article = getArticleBySlug(slug);
  if (article?.date) {
    return parseArticleDate(article.date);
  }
  const indexEntry = ARTICLE_INDEX.find((entry) => entry.slug === slug);
  if (indexEntry?.date) {
    return parseArticleDate(indexEntry.date);
  }
  return fallback;
}

function entry(
  path: string,
  lastModified: Date,
  priority: number,
  changeFrequency: ChangeFrequency = "daily",
): SitemapEntry {
  return {
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
  };
}

function staticPriority(path: string): number {
  if (path === "/") return 1;
  if (path.startsWith("/worldcup2026")) return 0.9;
  if (path.startsWith("/premier-league")) return 0.85;
  if (path.startsWith("/articles") || path.startsWith("/news")) return 0.8;
  if (path.startsWith("/live")) return 0.9;
  return 0.7;
}

function staticChangeFrequency(path: string): ChangeFrequency {
  if (path === "/" || path === "/live") return "hourly";
  if (path.startsWith("/statistics") || path.startsWith("/transfers")) {
    return "weekly";
  }
  return "daily";
}

function dedupeByUrl(entries: SitemapEntry[]): SitemapEntry[] {
  const byUrl = new Map<string, SitemapEntry>();
  for (const item of entries) {
    byUrl.set(item.url, item);
  }
  return [...byUrl.values()];
}

async function plMatchEntries(fallback: Date): Promise<SitemapEntry[]> {
  try {
    const body = await fetchPlFixtures();
    if (!body.fixtures?.length) {
      return [];
    }
    return body.fixtures.map((fixture) =>
      entry(
        `/premier-league/match/${fixture.fixtureId}`,
        fallback,
        0.75,
        "daily",
      ),
    );
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const staticEntries = STATIC_PATHS.map((path) =>
    entry(
      path,
      lastModified,
      staticPriority(path),
      staticChangeFrequency(path),
    ),
  );

  const groupEntries = WC26_GROUP_IDS.map((groupId) =>
    entry(groupHref(groupId), lastModified, 0.85, "weekly"),
  );

  const teamEntries = WC26_TEAMS.map((team) =>
    entry(teamHref(team.id), lastModified, 0.8, "weekly"),
  );

  const wc26MatchEntries = WC26_FIXTURES.map((fixture) =>
    entry(
      matchHref(fixture.id),
      new Date(fixture.kickoffUtc),
      0.8,
      "daily",
    ),
  );

  const plClubEntries = getAllClubSlugs().map((slug) =>
    entry(`/premier-league/clubs/${slug}`, lastModified, 0.8, "weekly"),
  );

  const canonicalArticleSlugs = new Set(getAllCanonicalArticleSlugs());

  const articlePageEntries = getAllCanonicalArticleSlugs().map((slug) =>
    entry(
      articleHref(slug),
      articleLastModified(slug, lastModified),
      0.85,
      "weekly",
    ),
  );

  const editorialEntries = EDITORIAL_ARTICLES.filter(
    (article) => !canonicalArticleSlugs.has(article.slug),
  ).map((article) =>
    entry(
      article.path,
      new Date(article.publishedAt),
      0.85,
      "weekly",
    ),
  );

  const plMatches = await plMatchEntries(lastModified);

  return dedupeByUrl([
    ...staticEntries,
    ...articlePageEntries,
    ...editorialEntries,
    ...groupEntries,
    ...teamEntries,
    ...wc26MatchEntries,
    ...plClubEntries,
    ...plMatches,
  ]);
}
