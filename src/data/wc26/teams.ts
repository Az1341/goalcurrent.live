import type { Team, TeamId } from "@/types/team";
import type { Wc26GroupId } from "@/types/group";

type TeamSeed = {
  readonly id: TeamId;
  readonly name: string;
  readonly code: string;
  readonly groupId: Wc26GroupId;
  readonly flagCode: string;
  readonly aliases?: readonly string[];
};

function buildTeam(seed: TeamSeed): Team {
  const aliases = [
    seed.name,
    seed.code,
    seed.id,
    ...(seed.aliases ?? []),
  ];

  return {
    id: seed.id,
    name: seed.name,
    code: seed.code,
    groupId: seed.groupId,
    flagCode: seed.flagCode,
    aliases: [...new Set(aliases)],
  };
}

/**
 * 48 qualified nations — FIFA final draw, December 2025.
 * IDs are lowercase FIFA three-letter codes.
 */
const TEAM_SEEDS: readonly TeamSeed[] = [
  { id: "mex", name: "Mexico", code: "MEX", groupId: "a", flagCode: "mx" },
  { id: "rsa", name: "South Africa", code: "RSA", groupId: "a", flagCode: "za" },
  {
    id: "kor",
    name: "Korea Republic",
    code: "KOR",
    groupId: "a",
    flagCode: "kr",
    aliases: ["South Korea", "Republic of Korea"],
  },
  {
    id: "cze",
    name: "Czechia",
    code: "CZE",
    groupId: "a",
    flagCode: "cz",
    aliases: ["Czech Republic"],
  },
  { id: "can", name: "Canada", code: "CAN", groupId: "b", flagCode: "ca" },
  {
    id: "bih",
    name: "Bosnia and Herzegovina",
    code: "BIH",
    groupId: "b",
    flagCode: "ba",
    aliases: ["Bosnia & Herzegovina", "Bosnia-Herzegovina"],
  },
  { id: "qat", name: "Qatar", code: "QAT", groupId: "b", flagCode: "qa" },
  { id: "sui", name: "Switzerland", code: "SUI", groupId: "b", flagCode: "ch" },
  { id: "bra", name: "Brazil", code: "BRA", groupId: "c", flagCode: "br" },
  { id: "mar", name: "Morocco", code: "MAR", groupId: "c", flagCode: "ma" },
  { id: "hai", name: "Haiti", code: "HAI", groupId: "c", flagCode: "ht" },
  { id: "sco", name: "Scotland", code: "SCO", groupId: "c", flagCode: "gb-sct" },
  {
    id: "usa",
    name: "USA",
    code: "USA",
    groupId: "d",
    flagCode: "us",
    aliases: ["United States", "United States of America", "USMNT"],
  },
  { id: "par", name: "Paraguay", code: "PAR", groupId: "d", flagCode: "py" },
  { id: "aus", name: "Australia", code: "AUS", groupId: "d", flagCode: "au" },
  {
    id: "tur",
    name: "Türkiye",
    code: "TUR",
    groupId: "d",
    flagCode: "tr",
    aliases: ["Turkey"],
  },
  { id: "ger", name: "Germany", code: "GER", groupId: "e", flagCode: "de" },
  {
    id: "cuw",
    name: "Curaçao",
    code: "CUW",
    groupId: "e",
    flagCode: "cw",
    aliases: ["Curacao"],
  },
  {
    id: "civ",
    name: "Côte d'Ivoire",
    code: "CIV",
    groupId: "e",
    flagCode: "ci",
    aliases: ["Ivory Coast", "Cote d Ivoire"],
  },
  { id: "ecu", name: "Ecuador", code: "ECU", groupId: "e", flagCode: "ec" },
  {
    id: "ned",
    name: "Netherlands",
    code: "NED",
    groupId: "f",
    flagCode: "nl",
    aliases: ["Holland"],
  },
  { id: "jpn", name: "Japan", code: "JPN", groupId: "f", flagCode: "jp" },
  { id: "swe", name: "Sweden", code: "SWE", groupId: "f", flagCode: "se" },
  { id: "tun", name: "Tunisia", code: "TUN", groupId: "f", flagCode: "tn" },
  { id: "bel", name: "Belgium", code: "BEL", groupId: "g", flagCode: "be" },
  { id: "egy", name: "Egypt", code: "EGY", groupId: "g", flagCode: "eg" },
  {
    id: "irn",
    name: "IR Iran",
    code: "IRN",
    groupId: "g",
    flagCode: "ir",
    aliases: ["Iran", "Islamic Republic of Iran", "IRI"],
  },
  { id: "nzl", name: "New Zealand", code: "NZL", groupId: "g", flagCode: "nz" },
  { id: "esp", name: "Spain", code: "ESP", groupId: "h", flagCode: "es" },
  {
    id: "cpv",
    name: "Cabo Verde",
    code: "CPV",
    groupId: "h",
    flagCode: "cv",
    aliases: [
      "Cape Verde",
      "Cape Verde Islands",
      "Cape Verde Island",
      "Cabo Verde Islands",
      "Cabo Verde Island",
    ],
  },
  { id: "ksa", name: "Saudi Arabia", code: "KSA", groupId: "h", flagCode: "sa" },
  { id: "uru", name: "Uruguay", code: "URU", groupId: "h", flagCode: "uy" },
  { id: "fra", name: "France", code: "FRA", groupId: "i", flagCode: "fr" },
  { id: "sen", name: "Senegal", code: "SEN", groupId: "i", flagCode: "sn" },
  { id: "irq", name: "Iraq", code: "IRQ", groupId: "i", flagCode: "iq" },
  { id: "nor", name: "Norway", code: "NOR", groupId: "i", flagCode: "no" },
  { id: "arg", name: "Argentina", code: "ARG", groupId: "j", flagCode: "ar" },
  { id: "alg", name: "Algeria", code: "ALG", groupId: "j", flagCode: "dz" },
  { id: "aut", name: "Austria", code: "AUT", groupId: "j", flagCode: "at" },
  { id: "jor", name: "Jordan", code: "JOR", groupId: "j", flagCode: "jo" },
  { id: "por", name: "Portugal", code: "POR", groupId: "k", flagCode: "pt" },
  {
    id: "cod",
    name: "Congo DR",
    code: "COD",
    groupId: "k",
    flagCode: "cd",
    aliases: ["DR Congo", "Democratic Republic of the Congo", "DRC"],
  },
  { id: "uzb", name: "Uzbekistan", code: "UZB", groupId: "k", flagCode: "uz" },
  { id: "col", name: "Colombia", code: "COL", groupId: "k", flagCode: "co" },
  { id: "eng", name: "England", code: "ENG", groupId: "l", flagCode: "gb-eng" },
  { id: "cro", name: "Croatia", code: "CRO", groupId: "l", flagCode: "hr" },
  { id: "gha", name: "Ghana", code: "GHA", groupId: "l", flagCode: "gh" },
  { id: "pan", name: "Panama", code: "PAN", groupId: "l", flagCode: "pa" },
];

export const WC26_TEAMS: readonly Team[] = TEAM_SEEDS.map(buildTeam);

/** Synthetic team for unconfirmed knockout slots — not counted in the 48 nations. */
export const WC26_TBD_TEAM: Team = {
  id: "tbd",
  name: "TBD",
  code: "TBD",
  groupId: "a",
  flagCode: "",
  aliases: ["TBD", "To Be Determined"],
};

const teamById = new Map<TeamId, Team>(
  WC26_TEAMS.map((team) => [team.id, team]),
);

export function getTeamById(id: TeamId): Team | undefined {
  if (id === WC26_TBD_TEAM.id) {
    return WC26_TBD_TEAM;
  }
  return teamById.get(id);
}

export function getTeamsByGroup(groupId: Wc26GroupId): readonly Team[] {
  return WC26_TEAMS.filter((team) => team.groupId === groupId);
}
