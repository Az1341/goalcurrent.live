import type { Metadata } from "next";
import UnderConstruction from "@/components/UnderConstruction";
import { buildPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site-url";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description: `Contact ${SITE_NAME}.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <UnderConstruction
      title="Contact"
      emoji="✉️"
      description={`Get in touch with the ${SITE_NAME} team.`}
    />
  );
}
