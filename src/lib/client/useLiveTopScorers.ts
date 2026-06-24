"use client";

import { useEffect } from "react";
import { LIVE_API_PATHS, useLiveApi } from "@/lib/client/live-data";
import { WC26_FIXTURES_UPDATED_EVENT } from "@/lib/wc26-fixture-overlay";
import type { Wc26TopScorersResponse } from "@/types/wc26-top-scorers";

export function useLiveTopScorers(enabled = true) {
  const swr = useLiveApi<Wc26TopScorersResponse>(
    enabled ? LIVE_API_PATHS.wc26TopScorers : null,
  );

  useEffect(() => {
    if (!enabled) return;
    const onOverlay = () => {
      void swr.mutate();
    };

    window.addEventListener(WC26_FIXTURES_UPDATED_EVENT, onOverlay);
    return () => {
      window.removeEventListener(WC26_FIXTURES_UPDATED_EVENT, onOverlay);
    };
  }, [enabled, swr.mutate]);

  return swr;
}
