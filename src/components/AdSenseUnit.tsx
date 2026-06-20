"use client";

import { useEffect, useRef, useState } from "react";
import { isAdSenseHost } from "@/lib/site-integrations";

interface AdSenseUnitProps {
  slot: string;
  className?: string;
}

export default function AdSenseUnit({ slot, className = "" }: AdSenseUnitProps) {
  const adRef = useRef<HTMLModElement>(null);
  const publisherId = "ca-pub-8697460993506171";
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(isAdSenseHost(window.location.hostname));
  }, []);

  useEffect(() => {
    if (!enabled) return;
    try {
      const w = window as Window & { adsbygoogle?: unknown[] };
      if (w.adsbygoogle) {
        w.adsbygoogle.push({});
      }
    } catch (error) {
      console.warn("AdSense push skipped:", error);
    }
  }, [enabled]);

  if (!enabled) {
    return null;
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
