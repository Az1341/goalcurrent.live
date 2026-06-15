import type { Metadata } from "next";
import TeamsSection from "@/components/wc26/TeamsSection";
import Wc26SectionPage from "@/components/wc26/Wc26SectionPage";
import { getWc26Section } from "@/lib/wc26-sections";

const section = getWc26Section("teams")!;

export const metadata: Metadata = {
  title: `${section.label} — World Cup 2026`,
  description: section.description,
};

export default function TeamsPage() {
  return (
    <Wc26SectionPage
      breadcrumb={section.breadcrumb}
      titleHighlight={section.titleHighlight}
      intro={section.description}
    >
      <TeamsSection />
    </Wc26SectionPage>
  );
}
