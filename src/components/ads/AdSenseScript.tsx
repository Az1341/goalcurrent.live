"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";
import { ADSENSE_PUBLISHER_ID, isAdSenseHost } from "@/lib/site-integrations";

/** Single global AdSense loader — lazyOnload, production hosts only. */
export function AdSenseScript() {
  const hostname = useSyncExternalStore(
    () => () => {},
    () => window.location.hostname,
    () => "",
  );
  const enabled = isAdSenseHost(hostname);

  if (!enabled) {
    return null;
  }

  return (
    <Script
      id="gc-adsense"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`}
      strategy="lazyOnload"
      crossOrigin="anonymous"
    />
  );
}
