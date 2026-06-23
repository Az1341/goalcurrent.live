import { fetchApiFootballRawJson } from "@/lib/server/wc26-top-scorers-sources/api-football";

const WC_LEAGUE = 1;
const WC_SEASON = 2026;

/** Raw fixtures endpoint response for WC26 (league=1, season=2026). */
export async function fetchWc26FixturesRaw(): Promise<unknown> {
  return fetchApiFootballRawJson(
    `/fixtures?league=${WC_LEAGUE}&season=${WC_SEASON}`,
  );
}
