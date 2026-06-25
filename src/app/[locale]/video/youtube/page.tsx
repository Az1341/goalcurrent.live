import type { Metadata } from "next";
import UnderConstruction from "@/components/UnderConstruction";
import { buildPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site-url";

const MEDIA_LINKS = [
  { href: "/video", label: "Video & Audio" },
  { href: "/news", label: "Latest News" },
  { href: "/worldcup2026", label: "World Cup 2026" },
];

export const metadata: Metadata = buildPageMetadata({
  title: "YouTube Videos",
  description: `GoalCurrent YouTube videos on ${SITE_NAME} — coming soon.`,
  path: "/video/youtube",
});

export default function VideoYoutubePage() {
  return (
    <UnderConstruction
      title="YouTube Videos"
      emoji="▶️"
      description={`Curated YouTube football videos and round-ups are coming soon on ${SITE_NAME}.`}
      links={MEDIA_LINKS}
      backHref="/video"
      backLabel="← Video & Audio"
    />
  );
}
