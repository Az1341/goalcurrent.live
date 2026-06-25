import type { MatchLineupPlayer } from "@/types/match-detail";

/** Static audit roster — South Africa vs Korea Republic (Group A, matchday 3). */
export const DEMO_RSA_LINEUP: readonly MatchLineupPlayer[] = [
  { name: "Ronwen Williams", number: 16, position: "G", photo: "https://media.api-sports.io/football/players/30997.png", is_captain: true, rating: 7.4, grid_position: "1:1" },
  { name: "Terrence Mashego", number: 2, position: "D", photo: "https://media.api-sports.io/football/players/296436.png", rating: 6.8, grid_position: "2:1" },
  { name: "Grant Kekana", number: 20, position: "D", photo: "https://media.api-sports.io/football/players/30998.png", rating: 7.1, grid_position: "2:2" },
  { name: "Mothobi Mvala", number: 4, position: "D", photo: "https://media.api-sports.io/football/players/30999.png", rating: 7.3, grid_position: "2:3" },
  { name: "Khuliso Khumalo", number: 13, position: "D", photo: "https://media.api-sports.io/football/players/31000.png", rating: 6.9, grid_position: "2:4" },
  { name: "Sphephelo Sithole", number: 8, position: "M", photo: "https://media.api-sports.io/football/players/31001.png", rating: 7.6, grid_position: "3:1" },
  { name: "Teboho Mokoena", number: 15, position: "M", photo: "https://media.api-sports.io/football/players/31002.png", rating: 7.8, grid_position: "3:2" },
  { name: "Percy Tau", number: 11, position: "M", photo: "https://media.api-sports.io/football/players/31003.png", rating: 7.2, grid_position: "4:1" },
  { name: "Themba Zwane", number: 10, position: "M", photo: "https://media.api-sports.io/football/players/31004.png", rating: 7.7, grid_position: "4:2" },
  { name: "Lyle Foster", number: 9, position: "F", photo: "https://media.api-sports.io/football/players/31005.png", rating: 6.5, grid_position: "4:3" },
  { name: "Evidence Makgopa", number: 17, position: "F", photo: "https://media.api-sports.io/football/players/31006.png", rating: 6.3, grid_position: "5:1" },
];

export const DEMO_KOR_LINEUP: readonly MatchLineupPlayer[] = [
  { name: "Kim Seung-gyu", number: 21, position: "G", photo: "https://media.api-sports.io/football/players/2801.png", rating: 7.0, grid_position: "1:1" },
  { name: "Kim Jin-su", number: 3, position: "D", photo: "https://media.api-sports.io/football/players/2802.png", rating: 7.2, grid_position: "2:1" },
  { name: "Kim Min-jae", number: 4, position: "D", photo: "https://media.api-sports.io/football/players/2803.png", is_captain: true, rating: 7.9, grid_position: "2:2" },
  { name: "Kim Young-gwon", number: 19, position: "D", photo: "https://media.api-sports.io/football/players/2804.png", rating: 7.4, grid_position: "2:3" },
  { name: "Kim Moon-hwan", number: 2, position: "D", photo: "https://media.api-sports.io/football/players/2805.png", rating: 6.7, grid_position: "2:4" },
  { name: "Lee Kang-in", number: 18, position: "M", photo: "https://media.api-sports.io/football/players/2806.png", rating: 8.1, grid_position: "3:1" },
  { name: "Hwang In-beom", number: 6, position: "M", photo: "https://media.api-sports.io/football/players/2807.png", rating: 7.3, grid_position: "3:2" },
  { name: "Jung Woo-young", number: 5, position: "M", photo: "https://media.api-sports.io/football/players/2808.png", rating: 7.1, grid_position: "3:3" },
  { name: "Son Heung-min", number: 7, position: "F", photo: "https://media.api-sports.io/football/players/2809.png", rating: 8.3, grid_position: "4:1" },
  { name: "Cho Gue-sung", number: 9, position: "F", photo: "https://media.api-sports.io/football/players/2810.png", rating: 6.9, grid_position: "4:2" },
  { name: "Hwang Hee-chan", number: 11, position: "F", photo: "https://media.api-sports.io/football/players/2811.png", rating: 7.5, grid_position: "4:3" },
];

export const RSA_KOR_DEMO_FORMATIONS = { home: "4-2-3-1", away: "4-3-3" } as const;

export function isRsaKorDemoFixture(matchNumber: number): boolean {
  return matchNumber === 54;
}