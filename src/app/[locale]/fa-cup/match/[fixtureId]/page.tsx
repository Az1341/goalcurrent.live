import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FacupMatchClient from "@/components/facup/FacupMatchClient";
import { FACUP_DISPLAY_NAME } from "@/lib/facup/constants";
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
    title: `${FACUP_DISPLAY_NAME} Match Centre`,
    description: `FA Cup match centre on ${SITE_NAME}.`,
  };
}

export default async function FaCupMatchPage({ params }: PageProps) {
  const { fixtureId: raw } = await params;
  const fixtureId = parseFixtureId(raw);
  if (fixtureId === null) notFound();
  return <FacupMatchClient fixtureId={fixtureId} />;
}
