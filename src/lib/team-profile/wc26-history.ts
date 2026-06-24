import type { Team } from "@/types/team";

export type TeamHistoryContent = {
  summary: string;
  achievements: string[];
  worldCupBackground: string;
};

const NOTABLE_ACHIEVEMENTS: Partial<Record<string, string[]>> = {
  bra: ["5x FIFA World Cup winners (1958, 1962, 1970, 1994, 2002)", "Most successful nation in World Cup history"],
  ger: ["4x FIFA World Cup winners (1954, 1974, 1990, 2014)", "3x European Championship winners"],
  arg: ["3x FIFA World Cup winners (1978, 1986, 2022)", "15x Copa America winners"],
  fra: ["2x FIFA World Cup winners (1998, 2018)", "2x European Championship winners"],
  uru: ["2x FIFA World Cup winners (1930, 1950)", "15x Copa America winners"],
  eng: ["1x FIFA World Cup winner (1966)", "Founded the modern game"],
  esp: ["1x FIFA World Cup winner (2010)", "3x European Championship winners"],
  ita: ["4x FIFA World Cup winners (1934, 1938, 1982, 2006)", "2x European Championship winners"],
  mex: ["Hosts World Cup 1970 and 1986", "16x CONCACAF Gold Cup winners"],
  usa: ["Hosts World Cup 1994", "Co-hosts World Cup 2026"],
  can: ["Hosts World Cup 2026", "2x CONCACAF Gold Cup winners"],
};

const WORLD_CUP_NOTES: Partial<Record<string, string>> = {
  bra: "Brazil arrive as the most decorated World Cup nation and perennial favourites.",
  ger: "Germany combine tournament pedigree with a strong European qualifying record.",
  arg: "Argentina enter as defending champions after lifting the trophy in Qatar 2022.",
  fra: "France reached back-to-back finals in 2018 and 2022.",
  eng: "England target a first World Cup since 1966 with a deep, experienced squad.",
  mex: "Mexico co-host the 2026 tournament and bring passionate home support.",
  usa: "The United States co-host on home soil with a rising generation of talent.",
  can: "Canada co-host their first men's World Cup on home soil in 2026.",
};

export function getWc26TeamHistory(team: Team): TeamHistoryContent {
  const achievements = NOTABLE_ACHIEVEMENTS[team.id] ?? [
    `Qualified for FIFA World Cup 2026 as ${team.name}`,
    `Competing in Group ${team.groupId.toUpperCase()}`,
  ];

  const worldCupBackground =
    WORLD_CUP_NOTES[team.id] ??
    `${team.name} qualified for FIFA World Cup 2026 and will compete in Group ${team.groupId.toUpperCase()} across the expanded 48-team tournament in the United States, Canada and Mexico.`;

  return {
    summary: `${team.name} (${team.code}) represent their nation at FIFA World Cup 2026. Follow fixtures, group standings, squad news and results throughout the tournament on GoalCurrent.live.`,
    achievements,
    worldCupBackground,
  };
}