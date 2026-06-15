export type MatchStatus = "live" | "ft" | "upcoming";

export type PlaceholderMatch = {
  id: number;
  home: string;
  away: string;
  homeGoals: number | null;
  awayGoals: number | null;
  status: MatchStatus;
  statusLabel: string;
  minute?: number;
  kickoff: string;
  venue: string;
  round: string;
};

/** Local demo data only — no external API. */
export const PLACEHOLDER_MATCHES: PlaceholderMatch[] = [
  {
    id: 1,
    home: "Saudi Arabia",
    away: "Uruguay",
    homeGoals: 1,
    awayGoals: 0,
    status: "live",
    statusLabel: "1H",
    minute: 45,
    kickoff: "Mon 15 Jun, 22:00",
    venue: "Hard Rock Stadium, Miami",
    round: "Group H",
  },
  {
    id: 2,
    home: "Sweden",
    away: "Tunisia",
    homeGoals: 5,
    awayGoals: 1,
    status: "ft",
    statusLabel: "FT",
    kickoff: "Mon 15 Jun, 18:00",
    venue: "MetLife Stadium, New Jersey",
    round: "Group F",
  },
  {
    id: 3,
    home: "Spain",
    away: "Cabo Verde",
    homeGoals: 0,
    awayGoals: 0,
    status: "ft",
    statusLabel: "FT",
    kickoff: "Mon 15 Jun, 20:00",
    venue: "Mercedes-Benz Stadium, Atlanta",
    round: "Group H",
  },
  {
    id: 4,
    home: "Belgium",
    away: "Egypt",
    homeGoals: 1,
    awayGoals: 1,
    status: "ft",
    statusLabel: "FT",
    kickoff: "Mon 15 Jun, 19:00",
    venue: "Lumen Field, Seattle",
    round: "Group G",
  },
];

export function getFeaturedMatch(): PlaceholderMatch {
  return (
    PLACEHOLDER_MATCHES.find((m) => m.status === "live") ?? PLACEHOLDER_MATCHES[0]
  );
}
