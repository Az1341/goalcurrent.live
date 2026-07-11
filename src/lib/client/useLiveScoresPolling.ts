"use client";

import { useEffect } from "react";
import { useLiveScores } from "@/lib/client/useLiveScores";

/** Live page score polling - data-only SWR revalidation, no router.refresh(). */
export const LIVE_SCORES_POLL_MS = 10_000;

export function useLiveScoresPolling() {
  const { mutate, ...rest } = useLiveScores();

  useEffect(() => {
    const id = setInterval(() => {
      void mutate();
    }, LIVE_SCORES_POLL_MS);

    return () => clearInterval(id);
  }, [mutate]);

  return { mutate, ...rest };
}