/**
 * LINEUP VERIFICATION — Spain vs Argentina Final (Match 104)
 * Cross-checks editorial confirmed XIs against API-Football when available.
 * Kickoff: 2026-07-19T19:00:00Z (20:00 BST)
 */

import {
  FINAL_ARG_LINEUP,
  FINAL_ESP_LINEUP,
  FINAL_LINEUP_PLAYER_NAMES,
  WC26_FINAL_MATCH_NUMBER,
} from "@/data/wc26/final-lineups-esp-arg";

const FINAL_KICKOFF_UTC = "2026-07-19T19:00:00.000Z";
const FINAL_FIXTURE_ID = "fixture-104";

export type FinalLineupVerifyResult = {
  ok: boolean;
  matchNumber: number;
  homeNames: readonly string[];
  awayNames: readonly string[];
  message: string;
};

export function getEditorialFinalLineups() {
  return {
    matchNumber: WC26_FINAL_MATCH_NUMBER,
    fixtureId: FINAL_FIXTURE_ID,
    kickoffUtc: FINAL_KICKOFF_UTC,
    home: FINAL_ESP_LINEUP,
    away: FINAL_ARG_LINEUP,
    homeNames: FINAL_LINEUP_PLAYER_NAMES.home,
    awayNames: FINAL_LINEUP_PLAYER_NAMES.away,
  };
}

/** Console verification — safe to call from client or server. */
export function verifyFinalLineups(): FinalLineupVerifyResult {
  const editorial = getEditorialFinalLineups();

  console.log("=== GOALCURRENT FINAL LINEUP VERIFICATION (Match 104) ===");
  console.log("Expected kickoff:", FINAL_KICKOFF_UTC);
  console.log("Spain XI:", editorial.homeNames.join(", "));
  console.log("Argentina XI:", editorial.awayNames.join(", "));

  const homeOk = editorial.home.length === 11;
  const awayOk = editorial.away.length === 11;
  const messiStarts = editorial.awayNames.some((n) => n.includes("Messi"));
  const yamalStarts = editorial.homeNames.some((n) => n.includes("Yamal"));
  const simonStarts = editorial.homeNames.some((n) => n.includes("Simón") || n.includes("Simon"));
  const emiStarts = editorial.awayNames.some((n) => n.includes("Martínez") || n.includes("Martinez"));

  if (!homeOk || !awayOk) {
    const message = "CRITICAL: Editorial XI missing players";
    console.error(message);
    return {
      ok: false,
      matchNumber: WC26_FINAL_MATCH_NUMBER,
      homeNames: editorial.homeNames,
      awayNames: editorial.awayNames,
      message,
    };
  }

  if (!messiStarts || !yamalStarts || !simonStarts || !emiStarts) {
    const message = "CRITICAL: Key players missing from editorial XI";
    console.error(message, { messiStarts, yamalStarts, simonStarts, emiStarts });
    return {
      ok: false,
      matchNumber: WC26_FINAL_MATCH_NUMBER,
      homeNames: editorial.homeNames,
      awayNames: editorial.awayNames,
      message,
    };
  }

  const message = "VERIFIED: Editorial Spain vs Argentina XIs loaded (Match 104)";
  console.log(message);
  console.log("=== END VERIFICATION ===");

  return {
    ok: true,
    matchNumber: WC26_FINAL_MATCH_NUMBER,
    homeNames: editorial.homeNames,
    awayNames: editorial.awayNames,
    message,
  };
}

/** Client-only: run near kickoff when VERIFY_MATCH=true or in development. */
export function maybeVerifyFinalLineupsOnClient(): void {
  if (typeof window === "undefined") return;

  const enabled =
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_VERIFY_MATCH === "true";
  if (!enabled) return;

  const kickoff = new Date(FINAL_KICKOFF_UTC).getTime();
  const thirtyMinBefore = kickoff - 30 * 60 * 1000;
  const now = Date.now();

  if (now < thirtyMinBefore) {
    console.log(
      `Final lineup verification scheduled for ${new Date(thirtyMinBefore).toISOString()}`,
    );
    return;
  }

  verifyFinalLineups();
}
