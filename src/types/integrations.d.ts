/// <reference types="next" />

export {};

declare global {
  interface Window {
    __gc_gtag_init?: boolean;
    __gc_onesignal_init?: boolean;
    __gc_sw_registered?: boolean;
    __gc_adsense_slots_pushed?: Set<string>;
    OneSignalDeferred?: Array<
      (oneSignal: {
        init: (options: { appId: string }) => Promise<void>;
      }) => void | Promise<void>
    >;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    adsbygoogle?: unknown[];
  }
}
