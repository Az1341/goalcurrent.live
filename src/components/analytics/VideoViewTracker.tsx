"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import { trackVideoOpen } from "@/lib/analytics";

type VideoViewTrackerProps = {
  videoId: string;
  videoTitle: string;
  videoProvider: string;
  sourceSurface?: string;
};

export default function VideoViewTracker({
  videoId,
  videoTitle,
  videoProvider,
  sourceSurface = "video_hub",
}: VideoViewTrackerProps) {
  const locale = useLocale();
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    trackVideoOpen({
      video_id: videoId,
      video_title: videoTitle.slice(0, 120),
      video_provider: videoProvider,
      language: locale,
      source_surface: sourceSurface,
    });
  }, [locale, sourceSurface, videoId, videoProvider, videoTitle]);

  return null;
}
