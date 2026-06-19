import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TeamPageContent from "@/components/wc26/TeamPageContent";
import { getTeamById, WC26_TEAMS } from "@/data/wc26";
import { isKnownTeamId, teamHref } from "@/lib/wc26-teams";
import { buildPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site-url";

type TeamPageProps = {
  params: Promise<{ teamId: string }>;
};

export function generateStaticParams() {
  return WC26_TEAMS.map((team) => ({
    teamId: team.id,
  }));
}

export async function generateMetadata({ params }: TeamPageProps): Promise<Metadata> {
  const { teamId: rawId } = await params;
  const teamId = decodeURIComponent(rawId);
  const team = getTeamById(teamId);

  if (!team) {
    return { title: "Team — World Cup 2026" };
  }

  return buildPageMetadata({
    title: `${team.name} — World Cup 2026`,
    description: `${team.name} at the FIFA World Cup 2026 — fixtures, group standings and match details on ${SITE_NAME}.`,
    path: teamHref(teamId),
  });
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { teamId: rawId } = await params;
  const teamId = decodeURIComponent(rawId);

  if (!isKnownTeamId(teamId)) {
    notFound();
  }

  return <TeamPageContent teamId={teamId} />;
}
