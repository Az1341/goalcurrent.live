import { PL_CLUBS_2026 } from "@/data/pl-clubs";

export function clubHref(slug: string): string {
  return `/premier-league/clubs/${encodeURIComponent(slug)}`;
}

export function getClubSlugByName(name: string): string | null {
  const normalized = name.trim().toLowerCase();
  const exact = PL_CLUBS_2026.find(
    (club) =>
      club.name.toLowerCase() === normalized ||
      club.shortName.toLowerCase() === normalized,
  );
  if (exact) return exact.slug;

  const partial = PL_CLUBS_2026.find((club) => {
    const clubName = club.name.toLowerCase();
    return normalized.includes(clubName) || clubName.includes(normalized);
  });
  return partial?.slug ?? null;
}