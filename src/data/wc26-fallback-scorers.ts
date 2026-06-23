import { getTeamById } from "@/data/wc26/teams";
import type { TopScorerRow } from "@/lib/wc26-top-scorers";
import type { TeamId } from "@/types/team";

/** Static WC26 scorer row — used only when live API and match events are empty. */
export type Wc26FallbackScorer = {
  readonly playerId: string;
  readonly name: string;
  readonly goals: number;
  readonly team: string;
};

function teamLabel(teamId: TeamId): string {
  const team = getTeamById(teamId);
  if (!team) {
    throw new Error(`Unknown WC26 team id: ${teamId}`);
  }
  return team.name;
}

/**
 * Curated tournament scorers for display when goal events are unavailable.
 * Team names match `WC26_TEAMS` so group filters and flags resolve correctly.
 */
export const WC26_FALLBACK_SCORERS: readonly Wc26FallbackScorer[] = [
  { playerId: "messi", name: "Lionel Messi", goals: 5, team: teamLabel("arg") },
  { playerId: "mbappe", name: "Kylian Mbappé", goals: 4, team: teamLabel("fra") },
  { playerId: "haaland", name: "Erling Haaland", goals: 4, team: teamLabel("nor") },
  { playerId: "vinicius", name: "Vinícius Júnior", goals: 3, team: teamLabel("bra") },
  { playerId: "kane", name: "Harry Kane", goals: 3, team: teamLabel("eng") },
  { playerId: "lukaku", name: "Romelu Lukaku", goals: 3, team: teamLabel("bel") },
  { playerId: "hakimi", name: "Achraf Hakimi", goals: 2, team: teamLabel("mar") },
  { playerId: "morata", name: "Álvaro Morata", goals: 2, team: teamLabel("esp") },
  { playerId: "ronaldo", name: "Cristiano Ronaldo", goals: 2, team: teamLabel("por") },
  { playerId: "diaz", name: "Luis Díaz", goals: 2, team: teamLabel("col") },
  { playerId: "wirtz", name: "Florian Wirtz", goals: 2, team: teamLabel("ger") },
  { playerId: "gakpo", name: "Cody Gakpo", goals: 2, team: teamLabel("ned") },
  { playerId: "mitoma", name: "Kaoru Mitoma", goals: 2, team: teamLabel("jpn") },
  { playerId: "salah", name: "Mohamed Salah", goals: 2, team: teamLabel("egy") },
  { playerId: "azmoun", name: "Sardar Azmoun", goals: 2, team: teamLabel("irn") },
  { playerId: "mane", name: "Sadio Mané", goals: 2, team: teamLabel("sen") },
  { playerId: "valencia", name: "Enner Valencia", goals: 2, team: teamLabel("ecu") },
  { playerId: "davies", name: "Alphonso Davies", goals: 2, team: teamLabel("can") },
  { playerId: "pulisic", name: "Christian Pulisic", goals: 2, team: teamLabel("usa") },
  { playerId: "son", name: "Son Heung-min", goals: 2, team: teamLabel("kor") },
  { playerId: "lozano", name: "Hirving Lozano", goals: 2, team: teamLabel("mex") },
  { playerId: "schick", name: "Patrik Schick", goals: 2, team: teamLabel("cze") },
  { playerId: "shaqiri", name: "Xherdan Shaqiri", goals: 1, team: teamLabel("sui") },
  { playerId: "dzeko", name: "Edin Džeko", goals: 1, team: teamLabel("bih") },
  { playerId: "almoez", name: "Almoez Ali", goals: 1, team: teamLabel("qat") },
  { playerId: "mctominay", name: "Scott McTominay", goals: 1, team: teamLabel("sco") },
  { playerId: "wood", name: "Chris Wood", goals: 1, team: teamLabel("nzl") },
  { playerId: "aldawsari", name: "Salem Al-Dawsari", goals: 1, team: teamLabel("ksa") },
  { playerId: "cavani", name: "Edinson Cavani", goals: 1, team: teamLabel("uru") },
  { playerId: "mahrez", name: "Riyad Mahrez", goals: 1, team: teamLabel("alg") },
  { playerId: "sabitzer", name: "Marcel Sabitzer", goals: 1, team: teamLabel("aut") },
  { playerId: "taamari", name: "Mousa Al-Taamari", goals: 1, team: teamLabel("jor") },
  { playerId: "bongonda", name: "Theo Bongonda", goals: 1, team: teamLabel("cod") },
  { playerId: "shomurodov", name: "Igor Shomurodov", goals: 1, team: teamLabel("uzb") },
  { playerId: "modric", name: "Luka Modrić", goals: 1, team: teamLabel("cro") },
  { playerId: "kudus", name: "Mohammed Kudus", goals: 1, team: teamLabel("gha") },
  { playerId: "godoy", name: "Aníbal Godoy", goals: 1, team: teamLabel("pan") },
  { playerId: "bacuna", name: "Júnior Bacuna", goals: 1, team: teamLabel("cuw") },
  { playerId: "pepe", name: "Nicolas Pépé", goals: 1, team: teamLabel("civ") },
  { playerId: "calhanoglu", name: "Hakan Çalhanoğlu", goals: 1, team: teamLabel("tur") },
  { playerId: "guirassy", name: "Serhou Guirassy", goals: 1, team: teamLabel("tun") },
  { playerId: "forsberg", name: "Emil Forsberg", goals: 1, team: teamLabel("swe") },
  { playerId: "santos", name: "Ricardo Santos", goals: 1, team: teamLabel("cpv") },
  { playerId: "zahavi", name: "Eran Zahavi", goals: 1, team: teamLabel("irq") },
  { playerId: "tau", name: "Percy Tau", goals: 1, team: teamLabel("rsa") },
  { playerId: "navarro", name: "Rafael Navarro", goals: 1, team: teamLabel("hai") },
  { playerId: "goodwin", name: "Craig Goodwin", goals: 1, team: teamLabel("aus") },
  { playerId: "estupinan", name: "Óscar Estupiñán", goals: 1, team: teamLabel("par") },
];

/** Map static fallback rows to the API `TopScorerRow` shape (sorted, ranked). */
export function getWc26FallbackTopScorerRows(): TopScorerRow[] {
  const sorted = [...WC26_FALLBACK_SCORERS].sort((left, right) => {
    if (right.goals !== left.goals) {
      return right.goals - left.goals;
    }
    return left.name.localeCompare(right.name, undefined, { sensitivity: "base" });
  });

  return sorted.map((row, index) => ({
    rank: index + 1,
    playerName: row.name,
    teamName: row.team,
    goals: row.goals,
    ownGoals: 0,
  }));
}
