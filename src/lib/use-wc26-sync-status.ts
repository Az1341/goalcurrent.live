"use client";

import { useSyncExternalStore } from "react";
import {
  getWc26SyncStatus,
  subscribeWc26SyncStatus,
  type Wc26SyncStatus,
} from "@/lib/wc26-results-sync";

/** WC26 overlay sync state — subscribes without setState-in-effect. */
export function useWc26SyncStatus(): Wc26SyncStatus {
  return useSyncExternalStore(
    subscribeWc26SyncStatus,
    getWc26SyncStatus,
    () => "pending" as Wc26SyncStatus,
  );
}
