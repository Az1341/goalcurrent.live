"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getEffectiveFixtures,
  WC26_FIXTURES_UPDATED_EVENT,
  type EffectiveFixture,
} from "@/lib/wc26-fixture-overlay";

/** Reactive WC26 fixtures with overlay applied. */
export function useEffectiveFixtures(): readonly EffectiveFixture[] {
  const [fixtures, setFixtures] = useState<readonly EffectiveFixture[]>(() =>
    getEffectiveFixtures(),
  );

  const refresh = useCallback(() => {
    setFixtures(getEffectiveFixtures());
  }, []);

  useEffect(() => {
    window.addEventListener(WC26_FIXTURES_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(WC26_FIXTURES_UPDATED_EVENT, refresh);
  }, [refresh]);

  return fixtures;
}
