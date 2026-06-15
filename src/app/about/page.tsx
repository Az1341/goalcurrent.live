import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import UnderConstruction from "@/components/UnderConstruction";

export const metadata: Metadata = {
  title: "About — GoalCurrent.online",
  description: "About GoalCurrent.online — independent World Cup 2026 fan site.",
};

export default function AboutPage() {
  return (
    <SiteShell>
      <UnderConstruction
        title="About"
        emoji="ℹ️"
        description="Learn more about GoalCurrent.online — who we are and what we're building."
      />
    </SiteShell>
  );
}
