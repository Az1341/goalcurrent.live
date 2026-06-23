"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import type { Wc26TvRegionCode } from "@/lib/wc26-fixtures-page";
import {
  detectVisitorTvRegion,
  persistTvRegion,
  readStoredTvRegion,
} from "@/lib/wc26-tv-region";
import { getBroadcasterFromLocale } from "@/lib/broadcasters";
import { useIsClient } from "@/lib/use-is-client";

const TV_REGION_EVENT = "gc:tv-region-change";

function subscribeTvRegion(onStoreChange: () => void) {
  window.addEventListener(TV_REGION_EVENT, onStoreChange);
  return () => window.removeEventListener(TV_REGION_EVENT, onStoreChange);
}

function readTvRegion(): Wc26TvRegionCode {
  return readStoredTvRegion() ?? detectVisitorTvRegion();
}

export function useWc26TvRegion(): {
  tvRegion: Wc26TvRegionCode;
  setTvRegion: (region: Wc26TvRegionCode) => void;
  ready: boolean;
  broadcaster: string;
} {
  const ready = useIsClient();
  const tvRegion = useSyncExternalStore(
    subscribeTvRegion,
    readTvRegion,
    () => "GB" as Wc26TvRegionCode,
  );

  const setTvRegion = useCallback((region: Wc26TvRegionCode) => {
    persistTvRegion(region);
    window.dispatchEvent(new Event(TV_REGION_EVENT));
  }, []);

  const broadcaster = useMemo(() => {
    if (!ready) return "";
    const broadcasterInfo = getBroadcasterFromLocale();
    return broadcasterInfo
      ? `${broadcasterInfo.name}: ${broadcasterInfo.channels.join(" / ")}`
      : "Local broadcaster information unavailable";
  }, [ready, tvRegion]);

  return { tvRegion, setTvRegion, ready, broadcaster };
}
