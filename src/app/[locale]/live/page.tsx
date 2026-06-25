import type { Metadata } from "next";

import LivePageClient from "@/app/[locale]/live/LivePageClient";
import ErrorBoundary from "@/components/system/ErrorBoundary";
import { buildPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site-url";

export const metadata: Metadata = buildPageMetadata({
  title: "Live Scores",
  description: `World Cup 2026 live scores on ${SITE_NAME}.`,
  path: "/live",
});

export default function LivePage() {
  return (
    <ErrorBoundary>
      <LivePageClient />
    </ErrorBoundary>
  );
}
