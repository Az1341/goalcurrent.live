import type { HostCountry } from "@/types/venue";
import type { TeamId } from "@/types/team";

const HOST_TEAM_IDS: Record<HostCountry, TeamId> = {
  USA: "usa",
  Mexico: "mex",
  Canada: "can",
};

export function getHostCountryTeamId(country: HostCountry): TeamId {
  return HOST_TEAM_IDS[country];
}
