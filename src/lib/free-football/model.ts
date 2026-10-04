export const FREE_COMPETITIONS = [
  { code: "PL", name: "Premier League", flag: "gb-eng" },
  { code: "CL", name: "Champions League", flag: null },
  { code: "PD", name: "La Liga", flag: "es" },
  { code: "BL1", name: "Bundesliga", flag: "de" },
  { code: "SA", name: "Serie A", flag: "it" },
  { code: "FL1", name: "Ligue 1", flag: "fr" },
  { code: "ELC", name: "Championship", flag: "gb-eng" },
  { code: "PPL", name: "Primeira Liga", flag: "pt" },
] as const;
export type CompetitionCode = typeof FREE_COMPETITIONS[number]["code"];
export type FreeMatch = {
  id: number; competition: CompetitionCode; kickoffUtc: string;
  home: string; away: string; status: "SCHEDULED" | "PENDING" | "FINISHED" | "POSTPONED" | "CANCELLED";
  homeScore: number | null; awayScore: number | null; matchday: number | null;
};
export type CompetitionSnapshot = {
  code: CompetitionCode; matches: FreeMatch[]; fetchedAt: string | null;
  available: boolean;
};
export type FootballSnapshot = { competitions: CompetitionSnapshot[]; renderedAt: string };

export function isCompetitionCode(value: string): value is CompetitionCode {
  return FREE_COMPETITIONS.some(item => item.code === value);
}

export function partitionMatches(matches: readonly FreeMatch[], now: Date, timeZone: string) {
  const day = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" });
  const todayKey = day.format(now);
  const ordered = [...matches].sort((a,b) => Date.parse(a.kickoffUtc) - Date.parse(b.kickoffUtc));
  return {
    today: ordered.filter(m => day.format(new Date(m.kickoffUtc)) === todayKey),
    results: ordered.filter(m => m.status === "FINISHED" && Date.parse(m.kickoffUtc) <= now.getTime()).reverse().slice(0,12),
    upcoming: ordered.filter(m => m.status === "SCHEDULED" && Date.parse(m.kickoffUtc) > now.getTime()).slice(0,12),
  };
}
export function hasFinalScore(match: FreeMatch): boolean {
  return match.status === "FINISHED" && match.homeScore !== null && match.awayScore !== null;
}
export function isStale(fetchedAt: string | null, now: Date): boolean {
  return !fetchedAt || now.getTime() - Date.parse(fetchedAt) > 18 * 60 * 60 * 1000;
}
