"use client";

import { AdSlot } from "@/components/ads/AdSlot";
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