import { WC26_TEAMS, getTeamById as getTeamByIdFromData } from "@/data/wc26/teams";
import type { Team, TeamId } from "@/types/team";

/**
 * Normalize a team name or code for exact alias lookup.
 * Lowercase, trim, strip diacritics, unify punctuation — no fuzzy matching.
 */
export function normalizeTeamName(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/&/g, " and ")
    .replace(/[''`´]/g, "")
    .replace(/[-–—./]/g, " ")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function buildAliasIndex(): ReadonlyMap<string, TeamId> {
  const index = new Map<string, TeamId>();

  function register(key: string, teamId: TeamId): void {
    if (!key) {
      return;
    }
    const existing = index.get(key);
    if (existing !== undefined && existing !== teamId) {
      throw new Error(
        `Duplicate team alias "${key}" maps to both "${existing}" and "${teamId}"`,
      );
    }
    index.set(key, teamId);
  }

  for (const team of WC26_TEAMS) {
    const keys = new Set<string>([
      normalizeTeamName(team.id),
      normalizeTeamName(team.code),
      normalizeTeamName(team.name),
      ...team.aliases.map(normalizeTeamName),
    ]);

    for (const key of keys) {
      register(key, team.id);
    }
  }

  return index;
}

const aliasIndex = buildAliasIndex();

/** Resolve any known team name, code, or alias to a stable team id. */
export function resolveTeamId(input: string): TeamId | undefined {
  const trimmed = input.trim();
  if (!trimmed) {
    return undefined;
  }

  return aliasIndex.get(normalizeTeamName(trimmed));
}

/** Look up a team record by stable id. */
export function getTeamById(teamId: TeamId): Team | undefined {
  return getTeamByIdFromData(teamId);
}

/** Resolve input to a flag code via team record — never from raw strings alone. */
export function getTeamFlagCode(input: string): string | undefined {
  const teamId = resolveTeamId(input);
  if (!teamId) {
    return undefined;
  }
  return getTeamById(teamId)?.flagCode;
}

/** Resolve input to the canonical display name. */
export function getTeamDisplayName(input: string): string | undefined {
  const teamId = resolveTeamId(input);
  if (!teamId) {
    return undefined;
  }
  return getTeamById(teamId)?.name;
}

function validateTeamIdentityRegistry(): void {
  for (const team of WC26_TEAMS) {
    if (!team.flagCode.trim()) {
      throw new Error(`Team ${team.id} is missing flagCode`);
    }

    const lookupKeys = [team.name, team.code, team.id, ...team.aliases];

    for (const alias of lookupKeys) {
      const normalized = normalizeTeamName(alias);
      if (!normalized) {
        throw new Error(`Team ${team.id} has an empty alias`);
      }

      const resolved = resolveTeamId(alias);
      if (resolved !== team.id) {
        throw new Error(
          `Alias "${alias}" for team ${team.id} resolved to ${resolved ?? "undefined"}`,
        );
      }
    }
  }

  if (WC26_TEAMS.length !== 48) {
    throw new Error(`Expected 48 teams in identity registry, found ${WC26_TEAMS.length}`);
  }
}

validateTeamIdentityRegistry();
