import type { MetadataRoute } from "next";
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
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: absoluteUrl(path === "/" ? "/" : path),
    lastModified,
    changeFrequency: path === "/" ? "hourly" : "daily",
    priority: path === "/" ? 1 : path.startsWith("/worldcup2026") ? 0.9 : 0.7,
  }));

  const groupEntries: MetadataRoute.Sitemap = WC26_GROUP_IDS.map((groupId) => ({
    url: absoluteUrl(groupHref(groupId)),
    lastModified,
    changeFrequency: "daily",
    priority: 0.85,
  }));

  const teamEntries: MetadataRoute.Sitemap = WC26_TEAMS.map((team) => ({
    url: absoluteUrl(teamHref(team.id)),
    lastModified,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  const matchEntries: MetadataRoute.Sitemap = WC26_FIXTURES.map((fixture) => ({
    url: absoluteUrl(matchHref(fixture.id)),
    lastModified,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [...staticEntries, ...groupEntries, ...teamEntries, ...matchEntries];
}
