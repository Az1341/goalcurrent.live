import type { Metadata } from "next";
import { buildComingSoonMetadata, ComingSoonPage } from "@/lib/coming-soon-page";

export const metadata: Metadata = buildComingSoonMetadata({
  title: "Match Highlights",
  path: "/video/highlights",
});

export default function VideoHighlightsPage() {
  return (
    <ComingSoonPage
      title="Match Highlights"
      path="/video/highlights"
      emoji="🎬"
      description="Match highlights are coming soon on GoalCurrent.live."
      links={[
        { href: "/video", label: "Video Hub" },
        { href: "/video/youtube", label: "YouTube" },
        { href: "/live", label: "Live Scores" },
      ]}
      backHref="/video"
      backLabel="← Video & Audio"
    />
  );
}
