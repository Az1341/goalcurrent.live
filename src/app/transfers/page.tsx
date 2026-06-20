import type { Metadata } from "next";
import { buildComingSoonMetadata, ComingSoonPage } from "@/lib/coming-soon-page";

export const metadata: Metadata = buildComingSoonMetadata({
  title: "Latest Transfers",
  path: "/transfers",
});

export default function TransfersPage() {
  return (
    <ComingSoonPage
      title="Latest Transfers"
      path="/transfers"
      emoji="🔄"
      description="Latest transfer news and confirmed deals are coming soon on GoalCurrent.live."
      links={[
        { href: "/transfers/rumours", label: "Rumours" },
        { href: "/transfers/completed", label: "Completed Deals" },
        { href: "/premier-league/transfers", label: "PL Transfers" },
      ]}
    />
  );
}
