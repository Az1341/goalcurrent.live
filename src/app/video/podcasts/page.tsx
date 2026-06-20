import type { Metadata } from "next";
import { buildComingSoonMetadata, ComingSoonPage } from "@/lib/coming-soon-page";

export const metadata: Metadata = buildComingSoonMetadata({
  title: "Podcasts",
  path: "/video/podcasts",
});

export default function VideoPodcastsPage() {
  return (
    <ComingSoonPage
      title="Podcasts"
      path="/video/podcasts"
      emoji="🎧"
      description="GoalCurrent podcasts are coming soon on GoalCurrent.live."
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
