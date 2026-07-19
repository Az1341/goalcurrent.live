import type { MatchLineupPlayer } from "@/types/match-detail";

/**
 * Confirmed Starting XIs — FIFA World Cup 2026 Final (Match 104).
 * Spain vs Argentina · MetLife Stadium · 2026-07-19T19:00:00Z
 *
 * Sources cross-checked (not the garbled M94 paste):
 * - Sports Illustrated confirmed XIs
 * - Sporting News shirt numbers
 *
 * API-Football lineups override these when present.
 */
export const FINAL_ESP_LINEUP: readonly MatchLineupPlayer[] = [
  { name: "Unai Simón", number: 23, position: "G", is_captain: false, grid_position: "1:1" },
  { name: "Pedro Porro", number: 12, position: "D", grid_position: "2:1" },
  { name: "Pau Cubarsí", number: 22, position: "D", grid_position: "2:2" },
  { name: "Aymeric Laporte", number: 14, position: "D", grid_position: "2:3" },
  { name: "Marc Cucurella", number: 24, position: "D", grid_position: "2:4" },
  { name: "Rodri", number: 16, position: "M", is_captain: true, grid_position: "3:1" },
  { name: "Fabián Ruiz", number: 8, position: "M", grid_position: "3:2" },
  { name: "Lamine Yamal", number: 19, position: "F", grid_position: "4:1" },
  { name: "Dani Olmo", number: 10, position: "F", grid_position: "4:2" },
  { name: "Álex Baena", number: 15, position: "F", grid_position: "4:3" },
  { name: "Mikel Oyarzabal", number: 21, position: "F", grid_position: "5:1" },
];

export const FINAL_ARG_LINEUP: readonly MatchLineupPlayer[] = [
  { name: "Emiliano Martínez", number: 23, position: "G", grid_position: "1:1" },
  { name: "Nahuel Molina", number: 26, position: "D", grid_position: "2:1" },
  { name: "Cristian Romero", number: 13, position: "D", grid_position: "2:2" },
  { name: "Lisandro Martínez", number: 6, position: "D", grid_position: "2:3" },
  { name: "Nicolás Tagliafico", number: 3, position: "D", grid_position: "2:4" },
  { name: "Rodrigo De Paul", number: 7, position: "M", grid_position: "3:1" },
  { name: "Alexis Mac Allister", number: 20, position: "M", grid_position: "3:2" },
  { name: "Enzo Fernández", number: 24, position: "M", grid_position: "3:3" },
  { name: "Nico González", number: 15, position: "M", grid_position: "3:4" },
  { name: "Lionel Messi", number: 10, position: "F", is_captain: true, grid_position: "4:1" },
  { name: "Julián Álvarez", number: 9, position: "F", grid_position: "4:2" },
];

export const FINAL_ESP_ARG_FORMATIONS = {
  home: "4-2-3-1",
  away: "4-4-2",
} as const;

/** FIFA Match 104 / GoalCurrent fixture-104. */
export const WC26_FINAL_MATCH_NUMBER = 104;

export function isWc26FinalLineupFixture(matchNumber: number): boolean {
  return matchNumber === WC26_FINAL_MATCH_NUMBER;
}

export const FINAL_LINEUP_PLAYER_NAMES = {
  home: FINAL_ESP_LINEUP.map((p) => p.name),
  away: FINAL_ARG_LINEUP.map((p) => p.name),
} as const;
