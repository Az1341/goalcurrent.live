import type { Metadata } from "next";
import FixturesSection from "@/components/wc26/FixturesSection";
import Wc26SectionPage from "@/components/wc26/Wc26SectionPage";
import { getWc26Section } from "@/lib/wc26-sections";
import { buildPageMetadata } from "@/lib/page-metadata";

const section = getWc26Section("fixtures")!;

export const metadata: Metadata = buildPageMetadata({
  title: `${section.label} — World Cup 2026`,
  description: section.description,
  path: section.href,
});
export default function FixturesPage() {
  return (
    <Wc26SectionPage
      breadcrumb={section.breadcrumb}
      titleHighlight={section.titleHighlight}
      intro={section.description}
    >
      <FixturesSection />
    </Wc26SectionPage>
  );
}
