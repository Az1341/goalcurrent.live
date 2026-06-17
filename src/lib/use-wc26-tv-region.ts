"use client";

import { useCallback, useEffect, useState } from "react";
import type { Wc26TvRegionCode } from "@/lib/wc26-fixtures-page";
import {
  detectVisitorTvRegion,
  persistTvRegion,
  readStoredTvRegion,
} from "@/lib/wc26-tv-region";

export function useWc26TvRegion(): {
  tvRegion: Wc26TvRegionCode;
  setTvRegion: (region: Wc26TvRegionCode) => void;
  ready: boolean;
} {
  const [tvRegion, setTvRegionState] = useState<Wc26TvRegionCode>("GB");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = readStoredTvRegion();
    setTvRegionState(stored ?? detectVisitorTvRegion());
    setReady(true);
  }, []);

  const setTvRegion = useCallback((region: Wc26TvRegionCode) => {
    setTvRegionState(region);
    persistTvRegion(region);
  }, []);

  return { tvRegion, setTvRegion, ready };
}
