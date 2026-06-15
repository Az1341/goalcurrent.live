import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import UnderConstruction from "@/components/UnderConstruction";

export const metadata: Metadata = {
  title: "Live Scores — GoalCurrent.online",
  description: "World Cup 2026 live scores on GoalCurrent.online.",
};

export default function LivePage() {
  return (
    <SiteShell activeNav="live">
      <UnderConstruction
        title="Live Scores"
        emoji="🔴"
        description="Real-time World Cup 2026 scores will appear here in a later phase."
      />
    </SiteShell>
  );
}
