"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import {
  ADSENSE_PUBLISHER_ID,
  GA_MEASUREMENT_ID,
  ONESIGNAL_APP_ID,
  isAdSenseHost,
  isAnalyticsHost,
  isOneSignalHost,
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
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [adsenseEnabled, setAdSenseEnabled] = useState(false);
  const [oneSignalEnabled, setOneSignalEnabled] = useState(false);

  useEffect(() => {
    const hostname = window.location.hostname;
    setAnalyticsEnabled(isAnalyticsHost(hostname));
    setAdSenseEnabled(isAdSenseHost(hostname));
    setOneSignalEnabled(isOneSignalHost(hostname));
  }, []);

  useEffect(() => {
    if (!analyticsEnabled || window.__gc_sw_registered) return;
    if ("serviceWorker" in navigator) {
      window.__gc_sw_registered = true;
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {});
    }
  }, [analyticsEnabled]);

  if (!analyticsEnabled && !adsenseEnabled && !oneSignalEnabled) {
    return null;
  }

  return (
    <>
      {analyticsEnabled ? (
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
        </>
      ) : null}
      {oneSignalEnabled ? (
        <>
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
                  try {
                    await OneSignal.init({ appId: "${ONESIGNAL_APP_ID}" });
                  } catch (err) {
                    console.warn("[OneSignal] init skipped:", err);
                  }
                });
              }
            `}
          </Script>
        </>
      ) : null}
      {adsenseEnabled ? (
        <Script
          id="gc-adsense"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`}
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      ) : null}
    </>
  );
}
