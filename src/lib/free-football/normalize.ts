import { z } from "zod";
import type { CompetitionCode, FreeMatch } from "./model";
const team = z.object({ name: z.string().min(1), shortName: z.string().nullable().optional() });
const score = z.number().int().nonnegative().nullable();
const row = z.object({
  id: z.number().int().positive(), utcDate: z.string().datetime(), status: z.string(),
  competition: z.object({ code: z.string() }), homeTeam: team, awayTeam: team,
  matchday: z.number().int().nullable().optional(),
  score: z.object({ fullTime: z.object({ home: score, away: score }) }),
});
export function normalizeMatches(payload: unknown, code: CompetitionCode): FreeMatch[] {
  const parsed = z.object({ matches: z.array(row).max(1000) }).parse(payload);
  const seen = new Set<number>();
  return parsed.matches.filter(m => m.competition.code === code && !seen.has(m.id) && Boolean(seen.add(m.id))).map(m => {
    const status: FreeMatch["status"] = m.status === "FINISHED" ? "FINISHED"
      : m.status === "POSTPONED" || m.status === "SUSPENDED" ? "POSTPONED"
      : m.status === "CANCELLED" ? "CANCELLED"
      : m.status === "SCHEDULED" || m.status === "TIMED" ? "SCHEDULED" : "PENDING";
    return {
      id: m.id, competition: code, kickoffUtc: m.utcDate,
      home: m.homeTeam.shortName || m.homeTeam.name, away: m.awayTeam.shortName || m.awayTeam.name,
      status, homeScore: status === "FINISHED" ? m.score.fullTime.home : null,
      awayScore: status === "FINISHED" ? m.score.fullTime.away : null,
      matchday: m.matchday ?? null,
    };
  });
}
