"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import {
  ADSENSE_PUBLISHER_ID,
  GA_MEASUREMENT_ID,
  ONESIGNAL_APP_ID,
  isStagingIntegrationsHost,
} from "@/lib/site-integrations";

declare global {
  interface Window {
    __gc_gtag_init?: boolean;
    __gc_onesignal_init?: boolean;
    __gc_sw_registered?: boolean;
    OneSignalDeferred?: Array<(oneSignal: {
      init: (options: { appId: string }) => Promise<void>;
    }) => void | Promise<void>>;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export default function StagingIntegrations() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(isStagingIntegrationsHost(window.location.hostname));
  }, []);

  useEffect(() => {
    if (!enabled || window.__gc_sw_registered) return;
    if ("serviceWorker" in navigator) {
      window.__gc_sw_registered = true;
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {});
    }
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gc-gtag-init" strategy="afterInteractive">
        {`
          if (!window.__gc_gtag_init) {
            window.__gc_gtag_init = true;
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          }
        `}
      </Script>
      <Script
        src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
        strategy="afterInteractive"
      />
      <Script id="gc-onesignal-init" strategy="afterInteractive">
        {`
          if (!window.__gc_onesignal_init) {
            window.__gc_onesignal_init = true;
            window.OneSignalDeferred = window.OneSignalDeferred || [];
            OneSignalDeferred.push(async function(OneSignal) {
              await OneSignal.init({ appId: "${ONESIGNAL_APP_ID}" });
            });
          }
        `}
      </Script>
      <Script
        id="gc-adsense"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`}
        strategy="afterInteractive"
        crossOrigin="anonymous"
      />
    </>
  );
}
