import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLdScript from "@/components/seo/JsonLdScript";
import PlClubProfileClient from "@/components/team-profile/PlClubProfileClient";
import { getClubBySlug, getAllClubSlugs } from "@/data/pl-clubs";
import { buildPlClubMetadata } from "@/lib/team-profile/metadata";
import { clubHref } from "@/lib/team-profile/club-slug";
import { absoluteUrl } from "@/lib/site-url";

type PageProps = { params: Promise<{ club: string }> };

export function generateStaticParams() {
  return getAllClubSlugs().map((slug) => ({ club: slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { club } = await params;
  const data = getClubBySlug(club);
  if (!data) return { title: "Club — Premier League" };
  return buildPlClubMetadata(data);
}

export default async function ClubPage({ params }: PageProps) {
  const { club } = await params;
  const data = getClubBySlug(club);
  if (!data) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    name: data.name,
    sport: "Soccer",
    memberOf: {
      "@type": "SportsOrganization",
      name: "Premier League",
    },
    location: {
      "@type": "Place",
      name: data.stadium,
    },
    url: absoluteUrl(clubHref(data.slug)),
  };

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <PlClubProfileClient club={data} />
    </>
  );
}
