export const FAVOURITES_STORAGE_KEY = "gc_favourites";

export const FAVOURITES_CHANGE_EVENT = "gc:favourites-change";

export type FavouritesState = {
  teams: string[];
  matches: string[];
  competitions: string[];
};

const EMPTY_STATE: FavouritesState = {
  teams: [],
  matches: [],
  competitions: [],
};

function normalizeList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return [...new Set(value.filter((item): item is string => typeof item === "string" && item.trim() !== ""))];
}

function normalizeState(value: unknown): FavouritesState {
  if (!value || typeof value !== "object") {
    return { ...EMPTY_STATE };
  }
  const record = value as Partial<FavouritesState>;
  return {
    teams: normalizeList(record.teams),
    matches: normalizeList(record.matches),
    competitions: normalizeList(record.competitions),
  };
}

function notifyChange(): void {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(new CustomEvent(FAVOURITES_CHANGE_EVENT));
}

/** Read favourites from localStorage (client only). */
export function readFavourites(): FavouritesState {
  if (typeof window === "undefined") {
    return { ...EMPTY_STATE };
  }
  try {
    const raw = localStorage.getItem(FAVOURITES_STORAGE_KEY);
    if (!raw) {
      return { ...EMPTY_STATE };
    }
    return normalizeState(JSON.parse(raw));
  } catch {
    return { ...EMPTY_STATE };
  }
}

function writeFavourites(state: FavouritesState): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    localStorage.setItem(FAVOURITES_STORAGE_KEY, JSON.stringify(state));
    notifyChange();
  } catch {
    /* private mode */
  }
}

export function isTeamFavourited(teamId: string): boolean {
  return readFavourites().teams.includes(teamId);
}

export function isMatchFavourited(matchId: string): boolean {
  return readFavourites().matches.includes(matchId);
}

export function toggleFavouriteTeam(teamId: string): boolean {
  const state = readFavourites();
  const isFav = state.teams.includes(teamId);
  const teams = isFav
    ? state.teams.filter((id) => id !== teamId)
    : [...state.teams, teamId];
  writeFavourites({ ...state, teams });
  return !isFav;
}

export function toggleFavouriteMatch(matchId: string): boolean {
  const state = readFavourites();
  const isFav = state.matches.includes(matchId);
  const matches = isFav
    ? state.matches.filter((id) => id !== matchId)
    : [...state.matches, matchId];
  writeFavourites({ ...state, matches });
  return !isFav;
}

export function removeFavouriteTeam(teamId: string): void {
  const state = readFavourites();
  if (!state.teams.includes(teamId)) {
    return;
  }
  writeFavourites({
    ...state,
    teams: state.teams.filter((id) => id !== teamId),
  });
}

export function removeFavouriteMatch(matchId: string): void {
  const state = readFavourites();
  if (!state.matches.includes(matchId)) {
    return;
  }
  writeFavourites({
    ...state,
    matches: state.matches.filter((id) => id !== matchId),
  });
}

export function removeFavouriteCompetition(competitionId: string): void {
  const state = readFavourites();
  if (!state.competitions.includes(competitionId)) {
    return;
  }
  writeFavourites({
    ...state,
    competitions: state.competitions.filter((id) => id !== competitionId),
  });
}
