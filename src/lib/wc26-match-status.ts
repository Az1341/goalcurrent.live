/** Normalize api-football / overlay status (e.g. 2H at 90'+ -> FT). */
export function normalizeWc26MatchStatus(
  status: string,
  elapsed: number | null | undefined,
): string {
  const normalized = status.trim().toLowerCase();
  if (
    elapsed != null &&
    elapsed >= 90 &&
    (normalized === "2h" ||
      normalized === "2nd half" ||
      normalized === "1h" ||
      normalized === "1st half")
  ) {
    return "ft";
  }
  return status;
}