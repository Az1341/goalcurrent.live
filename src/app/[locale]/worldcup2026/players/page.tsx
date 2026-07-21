import type { Metadata } from "next";
import {
  buildComingSoonMetadata,
  ComingSoonPage,
} from "@/lib/coming-soon-page";

export const metadata: Metadata = buildComingSoonMetadata({
  title: "World Cup 2026 Players",
  path: "/worldcup2026/players",
});

export default function WorldCupPlayersPage() {
  return (
    <ComingSoonPage
      title="World Cup 2026 Players"
      path="/worldcup2026/players"
      emoji="👤"
      description="World Cup 2026 player profiles are coming soon on GoalCurrent.live."
      links={[
        { href: "/worldcup2026/teams", label: "Teams" },
        { href: "/statistics/top-scorers", label: "Top Scorers" },
        { href: "/worldcup2026", label: "WC26 Hub" },
      ]}
      backHref="/worldcup2026"
      backLabel="← WC26 Hub"
    />
  );
}
