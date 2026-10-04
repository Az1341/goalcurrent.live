import "server-only";
import { unstable_cache } from "next/cache";
import { FREE_COMPETITIONS, type CompetitionCode, type CompetitionSnapshot, type FootballSnapshot } from "./model";
import { normalizeMatches } from "./normalize";
const TTL = 43200;
// One shared successful entry per competition; failed refresh throws so Next
// retains its previous success rather than caching an empty replacement.
const readCompetition = unstable_cache(async (code: CompetitionCode, season: number): Promise<CompetitionSnapshot> => {
  const token = process.env.FOOTBALL_DATA_KEY?.trim();
  if (!token) throw new Error("Free football data is not configured");
  const response = await fetch(`https://api.football-data.org/v4/competitions/${code}/matches?season=${season}`, {
    headers: { "X-Auth-Token": token }, cache: "no-store", signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`Free football data unavailable (${response.status})`);
  const matches = normalizeMatches(await response.json(), code);
  if (!matches.length) throw new Error("No verified season matches");
  return { code, matches, fetchedAt: new Date().toISOString(), available: true };
}, ["gc-free-current-season-v1"], { revalidate: TTL });

// Short negative cache avoids repeat requests from visitors when credentials or
// entitlements fail on first load. Successful values remain in the 12-hour cache.
const getCompetition = unstable_cache(async (code: CompetitionCode, season: number): Promise<CompetitionSnapshot> => {
  try { return await readCompetition(code, season); }
  catch { return { code, matches: [], fetchedAt: null, available: false }; }
}, ["gc-free-status-v1"], { revalidate: 600 });

export async function getFootballSnapshot(): Promise<FootballSnapshot> {
  const now = new Date();
  const season = now.getUTCMonth() >= 6 ? now.getUTCFullYear() : now.getUTCFullYear() - 1;
  return { competitions: await Promise.all(FREE_COMPETITIONS.map(c => getCompetition(c.code, season))) };
}
