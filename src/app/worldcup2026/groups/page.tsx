import type { Metadata } from "next";
import GroupsHubContent from "@/components/wc26/GroupsHubContent";

export const metadata: Metadata = {
  title: "Groups — World Cup 2026",
  description:
    "FIFA World Cup 2026 groups A through L on GoalCurrent.online.",
};

export default function GroupsHubPage() {
  return <GroupsHubContent />;
}
