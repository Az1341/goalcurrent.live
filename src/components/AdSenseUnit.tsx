"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { isAdSenseHost } from "@/lib/site-integrations";

interface AdSenseUnitProps {
  slot: string;
  className?: string;
  /** When true, renders a labelled placeholder on non-production hosts (local dev). */
  showPlaceholder?: boolean;
}

export default function AdSenseUnit({
  slot,
  className = "",
  showPlaceholder = false,
}: AdSenseUnitProps) {
  const adRef = useRef<HTMLModElement>(null);
  const publisherId = "ca-pub-8697460993506171";
  const enabled = useSyncExternalStore(
    () => () => {},
    () => isAdSenseHost(window.location.hostname),
    () => false,
  );
  const hasSlot = slot.trim().length > 0;

  useEffect(() => {
    if (!enabled || !hasSlot) return;
    try {
      const w = window as Window & { adsbygoogle?: unknown[] };
      if (w.adsbygoogle) {
        w.adsbygoogle.push({});
      }
    } catch (error) {
      console.warn("AdSense push skipped:", error);
    }
  }, [enabled, hasSlot]);

  if (!hasSlot) {
    return null;
  }

  if (!enabled) {
    if (!showPlaceholder) return null;
    return (
      <div
        className={className}
        data-ad-slot={slot}
        aria-hidden="true"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 50,
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
    <ins
      ref={adRef}
      className={`adsbygoogle ${className}`}
      style={{ display: "block", textAlign: "center" }}
      data-ad-client={publisherId}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
