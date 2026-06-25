import type { Metadata } from "next";
import { buildComingSoonMetadata, ComingSoonPage } from "@/lib/coming-soon-page";

export const metadata: Metadata = buildComingSoonMetadata({
  title: "Transfer Rumours",
  path: "/transfers/rumours",
});

export default function TransferRumoursPage() {
  return (
    <ComingSoonPage
      title="Transfer Rumours"
      path="/transfers/rumours"
      emoji="💬"
      description="Transfer rumours and speculation are coming soon on GoalCurrent.live."
      links={[
        { href: "/transfers", label: "Latest Transfers" },
        { href: "/news/transfers", label: "Transfer News" },
        { href: "/premier-league/transfers", label: "PL Transfers" },
      ]}
      backHref="/transfers"
      backLabel="← Latest Transfers"
    />
  );
}
