import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import UnderConstruction from "@/components/UnderConstruction";

export const metadata: Metadata = {
  title: "Contact — GoalCurrent.online",
  description: "Contact GoalCurrent.online.",
};

export default function ContactPage() {
  return (
    <SiteShell>
      <UnderConstruction
        title="Contact"
        emoji="✉️"
        description="Get in touch with the GoalCurrent.online team."
      />
    </SiteShell>
  );
}
