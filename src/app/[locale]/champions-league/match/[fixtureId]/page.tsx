import type { Metadata } from "next";
import { notFound } from "next/navigation";
import UclMatchClient from "@/components/ucl/UclMatchClient";
import { UCL_DISPLAY_NAME } from "@/lib/ucl/constants";
import { SITE_NAME } from "@/lib/site-url";

type PageProps = {
  params: Promise<{ locale: string; fixtureId: string }>;
};

function parseFixtureId(raw: string): number | null {
  const decoded = decodeURIComponent(raw);
  if (!/^\d+$/.test(decoded)) return null;
  const id = Number(decoded);
  if (!Number.isSafeInteger(id) || id <= 0) return null;
  return id;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { fixtureId: raw } = await params;
  const fixtureId = parseFixtureId(raw);
  if (fixtureId === null) {
    return { title: "Match not found", robots: { index: false, follow: false } };
  }
  return {
    title: `${UCL_DISPLAY_NAME} Match Centre`,
    description: `Champions League match centre on ${SITE_NAME}.`,
  };
}

export default async function ChampionsLeagueMatchPage({ params }: PageProps) {
  const { fixtureId: raw } = await params;
  const fixtureId = parseFixtureId(raw);
  if (fixtureId === null) notFound();
  return <UclMatchClient fixtureId={fixtureId} />;
}
