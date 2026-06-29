import { GROUPS_HUB_HREF, WC26_HUB_HREF } from "./wc26-groups";

export type Wc26Section = {
  id: string;
  href: string;
  label: string;
  breadcrumb: string;
  titleHighlight: string;
  description: string;
  hubDescription: string;
};

export const WC26_SECTIONS: Wc26Section[] = [
  {
    id: "groups",
    href: GROUPS_HUB_HREF,
    label: "Groups",
    breadcrumb: "Groups",
    titleHighlight: "Groups",
    description:
      "All twelve groups for the expanded 48-team tournament. Browse each group for live standings, fixtures and qualified teams.",
    hubDescription: "All 12 groups (A–L) for the 48-team tournament.",
  },
  {
    id: "fixtures",
    href: "/worldcup2026/fixtures",
    label: "Fixtures",
    breadcrumb: "Fixtures",
    titleHighlight: "Fixtures",
    description:
      "Full World Cup 2026 group-stage schedule — all 72 matches with dates, UTC kickoffs, venues and links to each match centre.",
    hubDescription: "Complete schedule for all 104 tournament matches.",
  },
  {
    id: "standings",
    href: "/worldcup2026/standings",
    label: "Standings",
    breadcrumb: "Standings",
    titleHighlight: "Standings",
    description:
      "Final group stage standings for all 12 groups at FIFA World Cup 2026 — all 48 teams, full P, W, D, L, GF, GA, GD and Pts.",
    hubDescription: "Group tables for all twelve groups (A–L).",
  },
  {
    id: "teams",
    href: "/worldcup2026/teams",
    label: "Teams",
    breadcrumb: "Teams",
    titleHighlight: "Teams",
    description:
      "All 48 qualified nations at World Cup 2026 — browse squads, groups and links to every team's fixtures and standings.",
    hubDescription: "All 48 nations at World Cup 2026.",
  },
  {
    id: "venues",
    href: "/worldcup2026/venues",
    label: "Venues",
    breadcrumb: "Venues",
    titleHighlight: "Venues",
    description:
      "Sixteen host stadiums across USA, Mexico and Canada — cities, capacities and tournament venues for World Cup 2026.",
    hubDescription: "16 host stadiums across three nations.",
  },
  {
    id: "bracket",
    href: "/worldcup2026/bracket",
    label: "Bracket",
    breadcrumb: "Bracket",
    titleHighlight: "Knockout Bracket",
    description:
      "Knockout stage path from the Round of 32 through to the final. Bracket fills in as knockout fixtures are confirmed.",
    hubDescription: "Round of 32 through to the final.",
  },
];

export { WC26_HUB_HREF };

export function getWc26Section(id: string): Wc26Section | undefined {
  return WC26_SECTIONS.find((s) => s.id === id);
}
