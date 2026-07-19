"use client";

import { useEffect } from "react";
import { maybeVerifyFinalLineupsOnClient } from "@/lib/verify-final-lineups";

/** Dev / VERIFY_MATCH console check for Match 104 lineups. */
export function FinalLineupVerifier() {
  useEffect(() => {
    maybeVerifyFinalLineupsOnClient();
  }, []);

  return null;
}
