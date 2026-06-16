import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonPath = path.resolve(
  __dirname,
  "../../ashna4all/js/wc2026-fixtures-official.json",
);

const fixturesJson = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const groupFixtures = fixturesJson.filter(
  (m) => m.stage === "Group Stage" && m.id <= 72,
);

/** FIFA final draw — December 2025 (official group composition). */
const GROUPS = {
  A: ["Mexico", "South Africa", "Korea Republic", "Czechia"],
  B: ["Canada", "Bosnia & Herzegovina", "Qatar", "Switzerland"],
  C: ["Brazil", "Morocco", "Haiti", "Scotland"],
  D: ["USA", "Paraguay", "Australia", "Türkiye"],
  E: ["Germany", "Curaçao", "Côte d'Ivoire", "Ecuador"],
  F: ["Netherlands", "Japan", "Sweden", "Tunisia"],
  G: ["Belgium", "Egypt", "IR Iran", "New Zealand"],
  H: ["Spain", "Cabo Verde", "Saudi Arabia", "Uruguay"],
  I: ["France", "Senegal", "Iraq", "Norway"],
  J: ["Argentina", "Algeria", "Austria", "Jordan"],
  K: ["Portugal", "Congo DR", "Uzbekistan", "Colombia"],
  L: ["England", "Croatia", "Ghana", "Panama"],
};

const FIFA_DISPLAY_NAMES = {
  "Bosnia & Herzegovina": "Bosnia and Herzegovina",
};

const VENUES = [
  {
    id: "venue-mexico-city",
    name: "Mexico City Stadium",
    city: "Mexico City",
    country: "Mexico",
    timezone: "America/Mexico_City",
  },
  {
    id: "venue-guadalajara",
    name: "Guadalajara Stadium",
    city: "Guadalajara",
    country: "Mexico",
    timezone: "America/Mexico_City",
  },
  {
    id: "venue-monterrey",
    name: "Monterrey Stadium",
    city: "Monterrey",
    country: "Mexico",
    timezone: "America/Monterrey",
  },
  {
    id: "venue-toronto",
    name: "Toronto Stadium",
    city: "Toronto",
    country: "Canada",
    timezone: "America/Toronto",
  },
  {
    id: "venue-vancouver",
    name: "BC Place Vancouver",
    city: "Vancouver",
    country: "Canada",
    timezone: "America/Vancouver",
  },
  {
    id: "venue-la",
    name: "Los Angeles Stadium",
    city: "Los Angeles",
    country: "USA",
    timezone: "America/Los_Angeles",
  },
  {
    id: "venue-sf",
    name: "San Francisco Bay Area Stadium",
    city: "Santa Clara",
    country: "USA",
    timezone: "America/Los_Angeles",
  },
  {
    id: "venue-seattle",
    name: "Seattle Stadium",
    city: "Seattle",
    country: "USA",
    timezone: "America/Los_Angeles",
  },
  {
    id: "venue-kc",
    name: "Kansas City Stadium",
    city: "Kansas City",
    country: "USA",
    timezone: "America/Chicago",
  },
  {
    id: "venue-dallas",
    name: "Dallas Stadium",
    city: "Arlington",
    country: "USA",
    timezone: "America/Chicago",
  },
  {
    id: "venue-houston",
    name: "Houston Stadium",
    city: "Houston",
    country: "USA",
    timezone: "America/Chicago",
  },
  {
    id: "venue-atlanta",
    name: "Atlanta Stadium",
    city: "Atlanta",
    country: "USA",
    timezone: "America/New_York",
  },
  {
    id: "venue-miami",
    name: "Miami Stadium",
    city: "Miami Gardens",
    country: "USA",
    timezone: "America/New_York",
  },
  {
    id: "venue-nj",
    name: "New York/New Jersey Stadium",
    city: "East Rutherford",
    country: "USA",
    timezone: "America/New_York",
  },
  {
    id: "venue-boston",
    name: "Boston Stadium",
    city: "Foxborough",
    country: "USA",
    timezone: "America/New_York",
  },
  {
    id: "venue-philadelphia",
    name: "Philadelphia Stadium",
    city: "Philadelphia",
    country: "USA",
    timezone: "America/New_York",
  },
];

const venueByFifaName = Object.fromEntries(VENUES.map((v) => [v.name, v.id]));

const codeMap = {};
for (const m of groupFixtures) {
  codeMap[m.home] = m.homeCode;
  codeMap[m.away] = m.awayCode;
}

function teamId(code) {
  return code.toLowerCase();
}

function matchday(id) {
  if (id <= 8) return 1;
  if (id <= 36) return 2;
  return 3;
}

const teams = [];
for (const [group, names] of Object.entries(GROUPS)) {
  for (const name of names) {
    const code = codeMap[name];
    if (!code) {
      throw new Error(`Missing FIFA code for team: ${name}`);
    }
    teams.push({
      id: teamId(code),
      name: FIFA_DISPLAY_NAMES[name] ?? name,
      code,
      groupId: group.toLowerCase(),
    });
  }
}

const fixtures = groupFixtures.map((m) => {
  const venueId = venueByFifaName[m.stadium] ?? venueByFifaName[m.venue];
  if (!venueId) {
    throw new Error(`Missing venue mapping for: ${m.stadium}`);
  }
  return {
    id: `fixture-${String(m.id).padStart(3, "0")}`,
    matchNumber: m.id,
    stage: "group",
    groupId: m.group.toLowerCase(),
    matchday: matchday(m.id),
    homeTeamId: teamId(m.homeCode),
    awayTeamId: teamId(m.awayCode),
    venueId,
    kickoffUtc: m.utc.endsWith(".000Z") ? m.utc : m.utc.replace("Z", ".000Z"),
    status: "scheduled",
  };
});

const groups = Object.entries(GROUPS).map(([id, names]) => ({
  id: id.toLowerCase(),
  label: `Group ${id}`,
  teamIds: names.map((n) => teamId(codeMap[n])),
}));

const out = { teams, groups, venues: VENUES, fixtures };
fs.writeFileSync(
  path.resolve(__dirname, "../.gen-wc26.json"),
  JSON.stringify(out, null, 2),
);
console.log(
  JSON.stringify({
    teams: teams.length,
    groups: groups.length,
    venues: VENUES.length,
    fixtures: fixtures.length,
  }),
);
