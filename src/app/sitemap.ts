import type { MetadataRoute } from "next";
import {
  articleHref,
  getAllCanonicalArticleSlugs,
} from "@/data/articles";
import { EDITORIAL_ARTICLES } from "@/data/editorial";
import { getAllClubSlugs } from "@/data/pl-clubs";
import {
  WC26_FIXTURES,
  WC26_GROUP_IDS,
  WC26_TEAMS,
} from "@/data/wc26";
import { groupHref } from "@/lib/wc26-groups";
import { matchHref } from "@/lib/wc26-match";
import { absoluteUrl } from "@/lib/site-url";
import { teamHref } from "@/lib/wc26-teams";

const STATIC_PATHS = [
  "/",
  "/live",
  "/favourites",
  "/news",
  "/news/world-cup",
  "/news/premier-league",
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
  "/premier-league",
  "/premier-league/table",
  "/premier-league/fixtures",
  "/premier-league/live",
  "/premier-league/clubs",
  "/premier-league/players",
  "/premier-league/statistics",
  "/premier-league/transfers",
  "/videos",
  "/videos/premier-league",
  "/videos/world-cup",
] as const;

function entry(
  path: string,
  lastModified: Date,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "daily",
): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(path === "/" ? "/" : path),
    lastModified,
    changeFrequency,
    priority,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticEntries = STATIC_PATHS.map((path) =>
    entry(
      path,
      lastModified,
      path === "/"
        ? 1
        : path.startsWith("/worldcup2026")
          ? 0.9
          : path.startsWith("/premier-league")
            ? 0.85
            : 0.7,
      path === "/" ? "hourly" : "daily",
    ),
  );

  const groupEntries = WC26_GROUP_IDS.map((groupId) =>
    entry(groupHref(groupId), lastModified, 0.85),
  );

  const teamEntries = WC26_TEAMS.map((team) =>
    entry(teamHref(team.id), lastModified, 0.75, "weekly"),
  );

  const matchEntries = WC26_FIXTURES.map((fixture) =>
    entry(matchHref(fixture.id), lastModified, 0.8),
  );

  const plClubEntries = getAllClubSlugs().map((slug) =>
    entry(`/premier-league/clubs/${slug}`, lastModified, 0.8, "weekly"),
  );

  const canonicalArticleSlugs = new Set(getAllCanonicalArticleSlugs());

  const editorialEntries = EDITORIAL_ARTICLES.filter(
    (article) => !canonicalArticleSlugs.has(article.slug),
  ).map((article) =>
    entry(article.path, new Date(article.publishedAt), 0.85, "weekly"),
  );

  const articlePageEntries = getAllCanonicalArticleSlugs().map((slug) =>
    entry(articleHref(slug), lastModified, 0.85, "weekly"),
  );

  return [
    ...staticEntries,
    ...articlePageEntries,
    ...editorialEntries,
    ...groupEntries,
    ...teamEntries,
    ...matchEntries,
    ...plClubEntries,
  ];
}
