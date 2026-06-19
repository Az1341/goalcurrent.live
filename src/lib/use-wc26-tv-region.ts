"use client";

import { useCallback, useEffect, useState } from "react";
import type { Wc26TvRegionCode } from "@/lib/wc26-fixtures-page";
import {
  detectVisitorTvRegion,
  persistTvRegion,
  readStoredTvRegion,
} from "@/lib/wc26-tv-region";
import { getBroadcasterFromLocale } from "@/lib/broadcasters";

export function useWc26TvRegion(): {
  tvRegion: Wc26TvRegionCode;
  setTvRegion: (region: Wc26TvRegionCode) => void;
  ready: boolean;
  broadcaster: string;
} {
  const [tvRegion, setTvRegionState] = useState<Wc26TvRegionCode>("GB");
  const [ready, setReady] = useState(false);
  const [broadcaster, setBroadcaster] = useState<string>("");

  useEffect(() => {
    const stored = readStoredTvRegion();
    const detected = stored ?? detectVisitorTvRegion();
    setTvRegionState(detected);
    setReady(true);
    
    // Get broadcaster from locale
    const broadcasterInfo = getBroadcasterFromLocale();
    setBroadcaster(broadcasterInfo ? `${broadcasterInfo.name}: ${broadcasterInfo.channels.join(' / ')}` : "Local broadcaster information unavailable");
  }, []);

  const setTvRegion = useCallback((region: Wc26TvRegionCode) => {
    setTvRegionState(region);
    persistTvRegion(region);
  }, []);

  return { tvRegion, setTvRegion, ready, broadcaster };
}
