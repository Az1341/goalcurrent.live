import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GroupPageContent from "@/components/wc26/GroupPageContent";
import { WC26_GROUP_IDS, groupLabel, isWc26GroupId } from "@/data/wc26";

type PageProps = {
  params: Promise<{ group: string }>;
};

export function generateStaticParams() {
  return WC26_GROUP_IDS.map((group) => ({ group }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { group } = await params;

  if (!isWc26GroupId(group)) {
    return { title: "Group — World Cup 2026" };
  }

  return {
    title: `${groupLabel(group)} — World Cup 2026`,
    description: `FIFA World Cup 2026 ${groupLabel(group)} on GoalCurrent.online.`,
  };
}

export default async function GroupPage({ params }: PageProps) {
  const { group } = await params;

  if (!isWc26GroupId(group)) {
    notFound();
  }

  return <GroupPageContent groupId={group} />;
}
