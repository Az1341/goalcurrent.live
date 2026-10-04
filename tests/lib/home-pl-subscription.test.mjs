import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

test("free homepage receives the server snapshot and registers no PL polling", () => {
  const home = readFileSync(join(root, "src/app/[locale]/HomeClient.tsx"), "utf8");
  const today = readFileSync(
    join(root, "src/components/home/v5/HomeTodaysMatches.tsx"),
    "utf8",
  );
  const leagues = readFileSync(
    join(root, "src/components/home/v5/HomeTeamsLeagues.tsx"),
    "utf8",
  );

  assert.doesNotMatch(home, /useLiveFixtures/);
  assert.match(home, /HomeResultsBoard snapshot=\{snapshot\}/);
  assert.doesNotMatch(home, /useSWR<PlFixturesApiResponse>|["']\/api\/pl\/fixtures["']/);
  assert.doesNotMatch(home, /HomeTeamsLeagues|HomeTodaysMatches/);
  assert.doesNotMatch(today, /useSWR/);
  assert.doesNotMatch(leagues, /useSWR/);
  assert.match(today, /plFixtures/);
  assert.match(leagues, /plFixtures/);
});