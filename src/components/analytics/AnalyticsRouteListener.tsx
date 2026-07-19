"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { GA_MEASUREMENT_ID, initGtag, sendPageView } from "@/lib/analytics";
import { persistInternalTrafficFromSearch } from "@/lib/analytics/internal-traffic";

/** Emits a single GA4 page_view per pathname (App Router navigation). */
export default function AnalyticsRouteListener() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastSent = useRef<string | null>(null);

  useEffect(() => {
    persistInternalTrafficFromSearch(window.location.search);
  }, [searchParams]);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    initGtag(GA_MEASUREMENT_ID);

    const query = searchParams?.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;
    const dedupeKey = pagePath;

    if (lastSent.current === dedupeKey) return;
    lastSent.current = dedupeKey;

    sendPageView({
      page_path: pagePath,
      page_title: document.title,
      page_location: window.location.href,
    });
  }, [pathname, searchParams]);

  return null;
}
