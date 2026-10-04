import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CompetitionMatchHub from "@/components/home/v5/CompetitionMatchHub";
import { parseMatchdayId } from "@/lib/home/matchday";
import { buildMatchMetadata } from "@/lib/page-metadata";

type Props = { params: Promise<{ locale: string; fixtureId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, fixtureId } = await params;
  const id = parseMatchdayId(fixtureId);
  if (id === null) return { title: "Match not found", robots: { index: false, follow: false } };
  // Stable metadata does not spend live provider quota.
  return buildMatchMetadata({ title: "FA Cup Match Hub", description: "FA Cup fixture, score and match status on GoalCurrent.", path: `/fa-cup/match/${id}`, locale });
}

export default async function MatchPage({ params }: Props) {
  const { fixtureId } = await params;
  const id = parseMatchdayId(fixtureId);
  if (id === null) notFound();
  return <CompetitionMatchHub competition="facup" fixtureId={id} />;
}
