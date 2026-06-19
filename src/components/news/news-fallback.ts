import type { NewsArticle } from "@/types/news";
import { SITE_NAME } from "@/lib/site-url";

/** Safe fallback when RSS fetch fails — page never blank. */
export const NEWS_FALLBACK_ARTICLES: readonly NewsArticle[] = [
  {
    title: "World Cup 2026 Is Underway — Follow Live Scores & Results",
    link: "/live",
    excerpt:
      "Group-stage matches are in progress across USA, Mexico and Canada. Scores refresh on our live scores page.",
    date: new Date().toISOString(),
    source: SITE_NAME,
    tag: "BREAKING",
  },
  {
    title: "Group Stage Standings — All 12 Tables Updated After Each Match",
    link: "/worldcup2026/standings",
    excerpt:
      "Points, goals and qualification positions for every group. Tables update as results are confirmed.",
    date: new Date().toISOString(),
    source: SITE_NAME,
    tag: "NEWS",
  },
  {
    title: "England vs Croatia: Group L Preview — Three Lions Eye Strong Start",
    link: "https://www.bbc.co.uk/sport/football/world-cup",
    excerpt:
      "England face Croatia in Dallas. Bellingham and Kane expected to lead the attack as England begin their World Cup campaign.",
    date: "2026-06-10T12:00:00.000Z",
    source: "BBC Sport",
    tag: "PREVIEW",
  },
  {
    title: "Portugal Round Off World Cup Preparations Before Group Stage Opener",
    link: "https://www.espn.com/soccer/story/_/id/world-cup-2026",
    excerpt:
      "Portugal target a strong group-stage run as the tournament gets underway across North America.",
    date: "2026-06-12T12:00:00.000Z",
    source: "ESPN",
    tag: "PREVIEW",
  },
  {
    title: "Brazil's Golden Generation Ready to End 24-Year Wait",
    link: "https://www.bbc.co.uk/sport/football/world-cup",
    excerpt:
      "With Vinicius Jr., Rodrygo and Raphinha in peak form, Brazil arrive as one of the favourites to lift the trophy again.",
    date: "2026-06-09T12:00:00.000Z",
    source: "BBC Sport",
    tag: "SQUAD",
  },
  {
    title: "Full World Cup 2026 Schedule — All Group-Stage Fixtures",
    link: "/worldcup2026/fixtures",
    excerpt:
      "Complete fixture list with kickoff times in your local timezone, venues and broadcasters for every match.",
    date: new Date().toISOString(),
    source: SITE_NAME,
    tag: "PREVIEW",
  },
];
