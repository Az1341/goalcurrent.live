import type { Metadata } from "next";
import { buildComingSoonMetadata, ComingSoonPage } from "@/lib/coming-soon-page";

export const metadata: Metadata = buildComingSoonMetadata({
  title: "Press Conferences",
  path: "/video/press-conferences",
});

export default function VideoPressConferencesPage() {
  return (
    <ComingSoonPage
      title="Press Conferences"
      path="/video/press-conferences"
      emoji="🎙️"
      description="Press conference coverage is coming soon on GoalCurrent.live."
      links={[
        { href: "/video", label: "Video Hub" },
        { href: "/video/youtube", label: "YouTube" },
        { href: "/news", label: "Latest News" },
      ]}
      backHref="/video"
      backLabel="← Video & Audio"
    />
  );
}
