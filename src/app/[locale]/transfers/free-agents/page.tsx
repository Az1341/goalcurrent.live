import type { Metadata } from "next";
import { buildComingSoonMetadata, ComingSoonPage } from "@/lib/coming-soon-page";

export const metadata: Metadata = buildComingSoonMetadata({
  title: "Free Agents",
  path: "/transfers/free-agents",
});

export default function TransferFreeAgentsPage() {
  return (
    <ComingSoonPage
      title="Free Agents"
      path="/transfers/free-agents"
      emoji="🆓"
      description="Free agent tracker is coming soon on GoalCurrent.live."
      links={[
        { href: "/transfers", label: "Latest Transfers" },
        { href: "/transfers/completed", label: "Completed Deals" },
        { href: "/premier-league/transfers", label: "PL Transfers" },
      ]}
      backHref="/transfers"
      backLabel="← Latest Transfers"
    />
  );
}
