export function normaliseStatKey(providerName: string): string {
  return providerName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

export function parseStatNumeric(value: string | null | undefined): number | null {
  if (value == null || value === "") return null;
  const cleaned = value.replace(/%/g, "").trim();
  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}
