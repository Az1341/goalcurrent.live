import type { Metadata } from "next";
import UnderConstruction from "@/components/UnderConstruction";

export const metadata: Metadata = {
  title: "Live Scores",
  description: "World Cup 2026 live scores on GoalCurrent.online.",
};

export default function LivePage() {
  return (
    <UnderConstruction
      title="Live Scores"
      emoji="🔴"
      description="Real-time World Cup 2026 scores will appear here in a later phase."
    />
  );
}
