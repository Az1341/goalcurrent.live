"use client";

import { useCallback, useEffect, useState } from "react";
import {
  FAVOURITES_CHANGE_EVENT,
  readFavourites,
  type FavouritesState,
} from "@/lib/favourites";

export function useFavourites(): FavouritesState {
  const [state, setState] = useState<FavouritesState>(() => readFavourites());

  const refresh = useCallback(() => {
    setState(readFavourites());
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener(FAVOURITES_CHANGE_EVENT, refresh);
    return () => window.removeEventListener(FAVOURITES_CHANGE_EVENT, refresh);
  }, [refresh]);

  return state;
}
