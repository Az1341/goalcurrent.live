import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import UnderConstruction from "@/components/UnderConstruction";

export const metadata: Metadata = {
  title: "World Cup 2026 — GoalCurrent.online",
  description:
    "FIFA World Cup 2026 hub — fixtures, groups, teams and standings on GoalCurrent.online.",
};

export default function WorldCupPage() {
  return (
    <SiteShell activeNav="worldcup2026">
      <UnderConstruction
        title="World Cup 2026"
        emoji="🏆"
        description="Fixtures, groups, teams and standings for USA · Mexico · Canada 2026 — coming soon."
      />
    </SiteShell>
  );
}
