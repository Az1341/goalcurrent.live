"use client";

import { useSyncExternalStore } from "react";
import { AdSlot } from "@/components/ads/AdSlot";
import { isAdSenseEnabled } from "@/lib/site-integrations";
import styles from "./ContentAdSlot.module.css";

type ContentAdSlotProps = {
  slot: string;
  minHeight?: number;
  className?: string;
  showPlaceholder?: boolean;
};

export function ContentAdSlot({
  slot,
  minHeight = 120,
  className = "",
  showPlaceholder = false,
}: ContentAdSlotProps) {
  const enabled = useSyncExternalStore(
    () => () => {},
    () => isAdSenseEnabled(window.location.hostname),
    () => false,
  );
  const hasSlot = slot.trim().length > 0;

  if (!hasSlot || (!enabled && !showPlaceholder)) {
    return null;
  }

  return (
    <aside
      className={`${styles.wrap} ${className}`.trim()}
      aria-label="Advertisement"
      data-gc-content-ad=""
    >
      <AdSlot
        slot={slot}
        minHeight={minHeight}
        showPlaceholder={showPlaceholder}
      />
    </aside>
  );
}
