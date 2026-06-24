import { teamHref } from "@/lib/wc26-teams";
import type { RelatedLink } from "@/components/seo/RelatedInternalLinks";
import { clubHref } from "@/lib/team-profile/club-slug";

export function wc26TeamRelatedLinks(
  teamId: string,
  teamName: string,
  groupId?: string,
): RelatedLink[] {
  const links: RelatedLink[] = [
    { href: "/worldcup2026/teams", label: "All World Cup 2026 teams" },
    { href: "/worldcup2026/fixtures", label: "World Cup 2026 fixtures" },
    { href: "/live", label: "Live scores" },
    { href: "/articles", label: "Football articles" },
  ];

  if (groupId) {
    links.unshift({
      href: `/worldcup2026/groups/${groupId.toLowerCase()}`,
      label: `Group ${groupId.toUpperCase()} standings`,
    });
  }

  links.unshift({
    href: teamHref(teamId),
    label: `${teamName} team hub`,
  });

  return links;
}

export function plClubRelatedLinks(slug: string, clubName: string): RelatedLink[] {
  return [
    { href: clubHref(slug), label: `${clubName} club profile` },
    { href: "/premier-league/clubs", label: "All Premier League clubs" },
    { href: "/premier-league/table", label: "Premier League table" },
    { href: "/premier-league/fixtures", label: "Premier League fixtures" },
    { href: "/premier-league/transfers", label: "Transfer news" },
    { href: "/articles", label: "Football articles" },
  ];
}

export function wc26MatchRelatedLinks(fixtureId: string): RelatedLink[] {
  return [
    { href: `/match/${fixtureId}`, label: "Match centre" },
    { href: "/live", label: "Live scores" },
    { href: "/worldcup2026/fixtures", label: "World Cup fixtures" },
    { href: "/worldcup2026/standings", label: "Group standings" },
  ];
}

export function plMatchRelatedLinks(fixtureId: number): RelatedLink[] {
  return [
    { href: `/premier-league/match/${fixtureId}`, label: "Match centre" },
    { href: "/premier-league/live", label: "Premier League live" },
    { href: "/premier-league/table", label: "League table" },
    { href: "/premier-league/fixtures", label: "Fixtures" },
  ];
}