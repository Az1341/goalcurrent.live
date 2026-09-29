import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

test("homepage fixtures are fetched once in HomeClient and passed to children", () => {
  const home = readFileSync(join(root, "src/app/[locale]/HomeClient.tsx"), "utf8");
  const today = readFileSync(
    join(root, "src/components/home/v5/HomeTodaysMatches.tsx"),
    "utf8",
  );
  const leagues = readFileSync(
    join(root, "src/components/home/v5/HomeTeamsLeagues.tsx"),
    "utf8",
  );
  const hook = readFileSync(
    join(root, "src/lib/client/useHomeMatchdayFixtures.ts"),
    "utf8",
  );

  assert.match(home, /useHomeMatchdayFixtures/);
  assert.doesNotMatch(home, /useSWR<PlFixturesApiResponse>|["']\/api\/pl\/fixtures["']/);
  assert.match(hook, /useLiveFixtures/);
  assert.match(hook, /useLiveUclFixtures/);
  assert.match(hook, /useLiveFacupFixtures/);
  assert.match(hook, /useLiveUnlFixtures/);
  assert.match(home, /cards=\{matchday\.cards\}/);
  assert.match(home, /plFixtures=\{plFixtures\}/);
  assert.doesNotMatch(today, /useSWR|useLiveFixtures|useLiveUcl|useLiveFacup|useLiveUnl/);
  assert.doesNotMatch(leagues, /useSWR/);
  assert.match(leagues, /plFixtures/);
});
