"use client";

import { useSyncExternalStore } from "react";

/** True after client hydration — avoids setState-in-effect mount gates. */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
