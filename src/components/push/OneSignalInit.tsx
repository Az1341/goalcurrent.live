"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";
import { ONESIGNAL_APP_ID, isOneSignalHost } from "@/lib/site-integrations";

export function OneSignalInit() {
  const hostname = useSyncExternalStore(
    () => () => {},
    () => window.location.hostname,
    () => "",
  );
  const enabled = isOneSignalHost(hostname);

  if (!enabled) {
    return null;
  }

  return (
    <>
      <Script
        src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
        strategy="lazyOnload"
      />
      <Script id="gc-onesignal-init" strategy="lazyOnload">
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
  );
}
