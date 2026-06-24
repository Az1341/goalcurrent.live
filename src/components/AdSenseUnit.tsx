"use client";

import { AdSlot } from "@/components/ads/AdSlot";

interface AdSenseUnitProps {
  slot: string;
  className?: string;
  showPlaceholder?: boolean;
}

/** @deprecated Use AdSlot — kept for existing imports. */
export default function AdSenseUnit({
  slot,
  className = "",
  showPlaceholder = false,
}: AdSenseUnitProps) {
  return (
    <AdSlot
      slot={slot}
      className={className}
      minHeight={120}
      showPlaceholder={showPlaceholder}
    />
  );
}
