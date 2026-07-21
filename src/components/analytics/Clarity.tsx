"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";
import {
  COOKIE_CONSENT_ACCEPTED,
  COOKIE_CONSENT_KEY,
} from "@/lib/site-keys";
import {
  CLARITY_PROJECT_ID,
  shouldEnableAnalytics,
} from "@/lib/analytics/config";

const CONSENT_EVENT = "gc:cookie-consent-change";

function subscribeConsent(onStoreChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onStoreChange);
  return () => window.removeEventListener(CONSENT_EVENT, onStoreChange);
}

function hasAnalyticsConsent(): boolean {
  try {
    return localStorage.getItem(COOKIE_CONSENT_KEY) === COOKIE_CONSENT_ACCEPTED;
  } catch {
    return false;
  }
}

function ClarityScript() {
  const hostname = useSyncExternalStore(
    () => () => {},
    () => window.location.hostname,
    () => "",
  );
  const consent = useSyncExternalStore(
    subscribeConsent,
    hasAnalyticsConsent,
    () => false,
  );

  const enabled =
    consent &&
    Boolean(CLARITY_PROJECT_ID) &&
    shouldEnableAnalytics(hostname);

  if (!enabled) {
    return null;
  }

  return (
    <Script id="microsoft-clarity" strategy="afterInteractive">
      {`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
      `}
    </Script>
  );
}

/** Microsoft Clarity — production hosts only, after cookie consent. */
export function Clarity() {
  return <ClarityScript />;
}