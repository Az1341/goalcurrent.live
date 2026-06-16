import type { Metadata } from "next";
import UnderConstruction from "@/components/UnderConstruction";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description: "Contact GoalCurrent.online.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <UnderConstruction
      title="Contact"
      emoji="✉️"
      description="Get in touch with the GoalCurrent.online team."
    />
  );
}
