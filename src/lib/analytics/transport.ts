import {
  GA_MEASUREMENT_ID,
  shouldEnableAnalytics,
} from "@/lib/analytics/config";
import {
  GA4_INTERNAL_TRAFFIC_TYPE,
  isInternalTraffic,
} from "@/lib/analytics/internal-traffic";
import type { AnalyticsEventName } from "@/lib/analytics/schemas";
import { validateEventParams } from "@/lib/analytics/schemas";
import { isInvalidAnalyticsPageTitle } from "@/lib/analytics/schemas";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    __gc_gtag_init?: boolean;
  }
}

function gtagReady(): boolean {
  return typeof window !== "undefined" && typeof window.gtag === "function";
}

export function initGtag(measurementId: string = GA_MEASUREMENT_ID): void {
  if (typeof window === "undefined" || !measurementId) return;
  if (window.__gc_gtag_init) return;

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  }
  window.gtag = gtag;
  window.__gc_gtag_init = true;

  gtag("js", new Date());
  gtag("config", measurementId, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
}

export function sendAnalyticsEvent(
  event: AnalyticsEventName,
  params: Record<string, unknown>,
): { sent: boolean; reason?: string } {
  if (typeof window === "undefined") {
    return { sent: false, reason: "ssr" };
  }
  if (!shouldEnableAnalytics(window.location.hostname)) {
    return { sent: false, reason: "host_gated" };
  }
  if (!gtagReady()) {
    return { sent: false, reason: "gtag_unavailable" };
  }

  const validated = validateEventParams(event, params);
  if (!validated.ok) {
    return { sent: false, reason: validated.error };
  }

  const payload: Record<string, unknown> = { ...validated.data };
  if (isInternalTraffic()) {
    payload.traffic_type = GA4_INTERNAL_TRAFFIC_TYPE;
  }

  window.gtag!("event", event, payload);
  return { sent: true };
}

export function sendPageView(input: {
  page_path: string;
  page_title: string;
  page_location?: string;
}): { sent: boolean; reason?: string } {
  if (typeof window === "undefined") {
    return { sent: false, reason: "ssr" };
  }
  if (!shouldEnableAnalytics(window.location.hostname)) {
    return { sent: false, reason: "host_gated" };
  }
  if (!gtagReady()) {
    return { sent: false, reason: "gtag_unavailable" };
  }

  let title = input.page_title.trim();
  if (isInvalidAnalyticsPageTitle(title)) {
    title = "GoalCurrent.live";
  }

  const config: Record<string, unknown> = {
    page_path: input.page_path,
    page_title: title,
    page_location: input.page_location ?? window.location.href,
  };
  if (isInternalTraffic()) {
    config.traffic_type = GA4_INTERNAL_TRAFFIC_TYPE;
  }

  window.gtag!("event", "page_view", config);
  return { sent: true };
}
