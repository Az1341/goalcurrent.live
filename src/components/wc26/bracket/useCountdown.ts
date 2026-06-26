"use client";

import { useEffect, useState } from "react";

export function useCountdown(targetUtc: string | null): number | null {
  const [remainingMs, setRemainingMs] = useState<number | null>(null);

  useEffect(() => {
    if (!targetUtc) {
      setRemainingMs(null);
      return;
    }

    const targetMs = Date.parse(targetUtc);
    if (!Number.isFinite(targetMs)) {
      setRemainingMs(null);
      return;
    }

    const tick = () => {
      setRemainingMs(Math.max(targetMs - Date.now(), 0));
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [targetUtc]);

  return remainingMs;
}

export function formatCountdown(remainingMs: number | null): string | null {
  if (remainingMs === null) {
    return null;
  }
  if (remainingMs <= 0) {
    return "00:00:00";
  }

  const totalSeconds = Math.floor(remainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}
