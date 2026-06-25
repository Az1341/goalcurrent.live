import type { Metadata } from "next";
import {
  buildComingSoonMetadata,
  ComingSoonPage,
} from "@/lib/coming-soon-page";

export const metadata: Metadata = buildComingSoonMetadata({
  title: "Transfer News",
  path: "/news/transfers",
});

export default function TransferNewsPage() {
  return (
    <ComingSoonPage
      title="Transfer News"
      path="/news/transfers"
      emoji="🔄"
      description="Transfer news and rumours are coming soon on GoalCurrent.live."
      links={[
        { href: "/news", label: "Latest News" },
        { href: "/transfers", label: "Latest Transfers" },
        { href: "/premier-league/transfers", label: "PL Transfers" },
      ]}
      backHref="/news"
      backLabel="← Latest News"
    />
  );
}
