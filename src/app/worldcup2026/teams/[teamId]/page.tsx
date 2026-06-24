import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLdScript from "@/components/seo/JsonLdScript";
import Wc26TeamProfileClient from "@/components/team-profile/Wc26TeamProfileClient";
import { getTeamById, WC26_TEAMS } from "@/data/wc26";
import { isKnownTeamId, teamHref } from "@/lib/wc26-teams";
import { buildWc26TeamMetadata } from "@/lib/team-profile/metadata";
import { absoluteUrl } from "@/lib/site-url";

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

  return buildWc26TeamMetadata(team);
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { teamId: rawId } = await params;
  const teamId = decodeURIComponent(rawId);

  if (!isKnownTeamId(teamId)) {
    notFound();
  }

  const team = getTeamById(teamId)!;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    name: team.name,
    sport: "Soccer",
    memberOf: {
      "@type": "SportsEvent",
      name: "FIFA World Cup 2026",
    },
    url: absoluteUrl(teamHref(teamId)),
  };

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <Wc26TeamProfileClient teamId={teamId} />
    </>
  );
}
