"use client";

import Script from "next/script";
import { useEffect, useSyncExternalStore } from "react";
import { GA_MEASUREMENT_ID, isAnalyticsHost } from "@/lib/site-integrations";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID?.trim() || GA_MEASUREMENT_ID;

export function GA() {
  const hostname = useSyncExternalStore(
    () => () => {},
    () => window.location.hostname,
    () => "",
  );
  const enabled = Boolean(GA_ID) && isAnalyticsHost(hostname);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    if ("serviceWorker" in navigator) {
      const host = window.location.hostname;
      const isLocalDev =
        host === "localhost" || host.endsWith(".localhost");

      if (isLocalDev) {
        void (async () => {
          const registrations =
            await navigator.serviceWorker.getRegistrations();
          if (registrations.length === 0) {
            return;
          }
          const cacheKeys = await caches.keys();
          await Promise.all(cacheKeys.map((key) => caches.delete(key)));
          await Promise.all(
            registrations.map((registration) => registration.unregister()),
          );
        })();
        return;
      }

      if (window.__gc_sw_registered) {
        return;
      }

      window.__gc_sw_registered = true;
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .catch(() => {});
    }
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          if (!window.__gc_gtag_init) {
            window.__gc_gtag_init = true;
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          }
        `}
      </Script>
    </>
  );
}
