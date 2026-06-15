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
      "All twelve groups for the expanded 48-team tournament. Select a group to view standings and fixtures in a later phase.",
    hubDescription: "All 12 groups (A–L) for the 48-team tournament.",
  },
  {
    id: "fixtures",
    href: "/worldcup2026/fixtures",
    label: "Fixtures",
    breadcrumb: "Fixtures",
    titleHighlight: "Fixtures",
    description:
      "Full tournament schedule — group stage, knockout rounds, dates, kickoffs and venues. Match data will be added in a later phase.",
    hubDescription: "Complete schedule for all 104 tournament matches.",
  },
  {
    id: "standings",
    href: "/worldcup2026/standings",
    label: "Standings",
    breadcrumb: "Standings",
    titleHighlight: "Standings",
    description:
      "Live group tables with P, W, D, L, GF, GA, GD and Pts for all twelve groups. Standings will be calculated in a later phase.",
    hubDescription: "Group tables for all twelve groups (A–L).",
  },
  {
    id: "teams",
    href: "/worldcup2026/teams",
    label: "Teams",
    breadcrumb: "Teams",
    titleHighlight: "Teams",
    description:
      "All 48 qualified nations — squads, groups and quick links. Team profiles will be added in a later phase.",
    hubDescription: "All 48 nations at World Cup 2026.",
  },
  {
    id: "venues",
    href: "/worldcup2026/venues",
    label: "Venues",
    breadcrumb: "Venues",
    titleHighlight: "Venues",
    description:
      "Sixteen host stadiums across USA, Mexico and Canada. Venue guides and maps will be added in a later phase.",
    hubDescription: "16 host stadiums across three nations.",
  },
  {
    id: "bracket",
    href: "/worldcup2026/bracket",
    label: "Bracket",
    breadcrumb: "Bracket",
    titleHighlight: "Knockout Bracket",
    description:
      "Knockout stage path from the Round of 32 through to the final. Bracket progression will be added in a later phase.",
    hubDescription: "Round of 32 through to the final.",
  },
];

export { WC26_HUB_HREF };

export function getWc26Section(id: string): Wc26Section | undefined {
  return WC26_SECTIONS.find((s) => s.id === id);
}
