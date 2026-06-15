import type { Metadata } from "next";
import UnderConstruction from "@/components/UnderConstruction";

export const metadata: Metadata = {
  title: "About",
  description: "About GoalCurrent.online — independent World Cup 2026 fan site.",
};

export default function AboutPage() {
  return (
    <UnderConstruction
      title="About"
      emoji="ℹ️"
      description="Learn more about GoalCurrent.online — who we are and what we're building."
    />
  );
}
