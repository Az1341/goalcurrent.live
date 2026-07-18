import assert from "node:assert/strict";
import test from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

const { applyConfirmedKnockoutResults } = await import(
  pathToFileURL(join(root, "src/lib/wc26/knockout-confirmed-results.ts")).href
);
const { findFixtureIdByKnockoutTeamPairOverride } = await import(
  pathToFileURL(join(root, "src/lib/wc26-fixture-match.ts")).href
);

test("confirmed knockout FT overrides stale API live overlay for match 80", () => {
  const [fixture] = applyConfirmedKnockoutResults([
    {
      id: "fixture-080",
      matchNumber: 80,
      stage: "round-of-32",
      homeTeamId: "eng",
      awayTeamId: "cod",
      venueId: "venue-test",
      kickoffUtc: "2026-07-05T19:00:00.000Z",
      status: "2h",
      homeScore: 3,
      awayScore: 4,
      elapsed: 67,
    },
  ]);

  assert.equal(fixture.status, "ft");
  assert.equal(fixture.homeScore, 2);
  assert.equal(fixture.awayScore, 1);
});

test("France vs England maps to third-place fixture 103", () => {
  assert.equal(
    findFixtureIdByKnockoutTeamPairOverride("France", "England"),
    "fixture-103",
  );
});