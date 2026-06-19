"use client";

import { useEffect, useRef } from "react";

interface AdSenseUnitProps {
  slot: string;
  className?: string;
}

export default function AdSenseUnit({ slot, className = "" }: AdSenseUnitProps) {
  const adRef = useRef<HTMLModElement>(null);
  const publisherId = "ca-pub-8697460993506171";

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && (window as any).adsbygoogle) {
        (window as any).adsbygoogle.push({});
      }
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, []);

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
