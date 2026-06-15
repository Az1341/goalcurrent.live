import type { Metadata } from "next";
import UnderConstruction from "@/components/UnderConstruction";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact GoalCurrent.online.",
};

export default function ContactPage() {
  return (
    <UnderConstruction
      title="Contact"
      emoji="✉️"
      description="Get in touch with the GoalCurrent.online team."
    />
  );
}
