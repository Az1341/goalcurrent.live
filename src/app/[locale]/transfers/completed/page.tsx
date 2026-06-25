import type { Metadata } from "next";
import { buildComingSoonMetadata, ComingSoonPage } from "@/lib/coming-soon-page";

export const metadata: Metadata = buildComingSoonMetadata({
  title: "Completed Transfers",
  path: "/transfers/completed",
});

export default function TransferCompletedPage() {
  return (
    <ComingSoonPage
      title="Completed Transfers"
      path="/transfers/completed"
      emoji="✅"
      description="Completed transfer deals are coming soon on GoalCurrent.live."
      links={[
        { href: "/transfers", label: "Latest Transfers" },
        { href: "/transfers/free-agents", label: "Free Agents" },
        { href: "/premier-league/transfers", label: "PL Transfers" },
      ]}
      backHref="/transfers"
      backLabel="← Latest Transfers"
    />
  );
}
