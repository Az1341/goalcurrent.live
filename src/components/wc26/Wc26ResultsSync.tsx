"use client";

import { useEffect } from "react";
import { startWc26ResultsSync } from "@/lib/wc26-results-sync";

/** Invisible client bootstrap — feeds WC26 overlay from /api/wc26/scores. */
export default function Wc26ResultsSync() {
  useEffect(() => {
    const controller = startWc26ResultsSync();
    return () => controller.stop();
  }, []);

  return null;
}
