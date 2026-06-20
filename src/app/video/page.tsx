import type { Metadata } from "next";
import UnderConstruction from "@/components/UnderConstruction";
import { buildPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site-url";

const MEDIA_LINKS = [
  { href: "/news", label: "Latest News" },
  { href: "/video/youtube", label: "YouTube Videos" },
  { href: "/worldcup2026", label: "World Cup 2026" },
];

export const metadata: Metadata = buildPageMetadata({
  title: "Video & Audio",
  description: `Football video and audio on ${SITE_NAME} — coming soon.`,
  path: "/video",
});

export default function VideoPage() {
  return (
    <UnderConstruction
      title="Video & Audio"
      emoji="🎬"
      description={`Match highlights, interviews and audio coverage are coming soon on ${SITE_NAME}.`}
      links={MEDIA_LINKS}
    />
  );
}
