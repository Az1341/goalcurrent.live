import type { Metadata } from "next";
import GroupsHubContent from "@/components/wc26/GroupsHubContent";
import { getWc26Section } from "@/lib/wc26-sections";
import { buildPageMetadata } from "@/lib/page-metadata";

const section = getWc26Section("groups")!;

export const metadata: Metadata = buildPageMetadata({
  title: "Groups — World Cup 2026 Archive",
  description: section.description,
  path: section.href,
});
export default function GroupsHubPage() {
  return <GroupsHubContent />;
}
