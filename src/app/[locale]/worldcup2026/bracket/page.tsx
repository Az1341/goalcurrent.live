import type { Metadata } from "next";
import BracketSection from "@/components/wc26/BracketSection";
import Wc26SectionPage from "@/components/wc26/Wc26SectionPage";
import { getWc26Section } from "@/lib/wc26-sections";
import { buildPageMetadata } from "@/lib/page-metadata";

const section = getWc26Section("bracket")!;

export const metadata: Metadata = buildPageMetadata({
  title: `${section.label} — World Cup 2026`,
  description: section.description,
  path: section.href,
});
export default function BracketPage() {
  return (
    <Wc26SectionPage
      breadcrumb={section.breadcrumb}
      titleHighlight={section.titleHighlight}
      intro={section.description}
    >
      <BracketSection />
    </Wc26SectionPage>
  );
}
