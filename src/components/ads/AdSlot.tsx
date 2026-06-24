"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import {
  ADSENSE_PUBLISHER_ID,
  isAdSenseHost,
} from "@/lib/site-integrations";

type AdSlotProps = {
  slot: string;
  className?: string;
  /** Reserved height to limit CLS before the ad fills in. */
  minHeight?: number;
  /** Labelled placeholder on non-production hosts (local dev). */
  showPlaceholder?: boolean;
};

function getPushedSlots(): Set<string> {
  if (!window.__gc_adsense_slots_pushed) {
    window.__gc_adsense_slots_pushed = new Set<string>();
  }
  return window.__gc_adsense_slots_pushed;
}

export function AdSlot({
  slot,
  className = "",
  minHeight = 120,
  showPlaceholder = false,
}: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const enabled = useSyncExternalStore(
    () => () => {},
    () => isAdSenseHost(window.location.hostname),
    () => false,
  );
  const hasSlot = slot.trim().length > 0;

  useEffect(() => {
    if (!enabled || !hasSlot) {
      return undefined;
    }

    const container = containerRef.current;
    if (!container) {
      return undefined;
    }

    const pushAd = () => {
      const pathname =
        typeof window !== "undefined" ? window.location.pathname : "";
      const key = `${slot.trim()}@${pathname}`;
      const pushed = getPushedSlots();
      if (pushed.has(key)) {
        return;
      }

      pushed.add(key);
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        pushed.delete(key);
        console.warn("AdSense push skipped:", error);
      }
    };

    if (typeof IntersectionObserver === "undefined") {
      pushAd();
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) {
          return;
        }
        pushAd();
        observer.disconnect();
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [enabled, hasSlot, slot]);

  if (!hasSlot) {
    return null;
  }

  if (!enabled) {
    if (!showPlaceholder) {
      return null;
    }

    return (
      <div
        className={className}
        data-ad-slot={slot}
        aria-hidden="true"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight,
          border: "1px dashed rgba(200, 16, 46, 0.28)",
          borderRadius: 6,
          background: "#faf5f6",
          color: "#64748b",
          fontSize: "0.6875rem",
          fontWeight: 700,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        Ad slot {slot}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={className} style={{ minHeight }}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-client={ADSENSE_PUBLISHER_ID}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
