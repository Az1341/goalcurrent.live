import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

test("confirmed knockout pairings module exists for matches 75 and 76", () => {
  const raw = readFileSync(
    join(root, "src/lib/wc26/knockout-confirmed-pairings.ts"),
    "utf8",
  );
  assert.match(raw, /fixture-075[\s\S]*matchNumber:\s*75[\s\S]*homeTeamId:\s*"bra"/);
  assert.match(raw, /fixture-076[\s\S]*matchNumber:\s*76[\s\S]*homeTeamId:\s*"ned"/);
  assert.match(raw, /fixture-081[\s\S]*homeTeamId:\s*"usa"[\s\S]*awayTeamId:\s*"bih"/);
  assert.match(raw, /fixture-082[\s\S]*homeTeamId:\s*"bel"[\s\S]*awayTeamId:\s*"sen"/);
  assert.match(raw, /fixture-086[\s\S]*homeTeamId:\s*"arg"[\s\S]*awayTeamId:\s*"cpv"/);
  assert.match(raw, /fixture-087[\s\S]*homeTeamId:\s*"col"[\s\S]*awayTeamId:\s*"gha"/);
  assert.match(raw, /fixture-088[\s\S]*homeTeamId:\s*"aus"[\s\S]*awayTeamId:\s*"egy"/);
  assert.match(raw, /fixture-077[\s\S]*homeTeamId:\s*"fra"[\s\S]*awayTeamId:\s*"swe"/);
  assert.match(raw, /fixture-078[\s\S]*homeTeamId:\s*"civ"[\s\S]*awayTeamId:\s*"nor"/);
  assert.match(raw, /fixture-084[\s\S]*homeTeamId:\s*"esp"[\s\S]*awayTeamId:\s*"aut"/);
});

test("resolveFixtureParticipant prefers confirmed pairing over bracket template", () => {
  const liveRaw = readFileSync(join(root, "src/lib/wc26-live.ts"), "utf8");
  assert.match(liveRaw, /getConfirmedKnockoutPairingByFixtureId/);
  assert.match(liveRaw, /skipBracketTemplate/);
});

test("results sync fills overlay team ids from confirmed pairings", () => {
  const raw = readFileSync(join(root, "src/lib/wc26-results-sync.ts"), "utf8");
  assert.match(raw, /match\.homeTeamId \?\? confirmed\?\.homeTeamId/);
});

test("bracket lineup bar resolves participants instead of tbd ids", () => {
  const raw = readFileSync(
    join(root, "src/components/wc26/bracket/BracketLiveLineupBar.tsx"),
    "utf8",
  );
  assert.match(raw, /resolveFixtureParticipant/);
  assert.doesNotMatch(raw, /fixture\.homeTeamId/);
});

test("standings engine uses final tables after group stage", () => {
  const raw = readFileSync(join(root, "src/lib/wc26-standings.ts"), "utf8");
  assert.match(raw, /isWc26GroupStageComplete\(\)/);
  assert.match(raw, /WC26_FINAL_GROUP_STANDINGS/);
  assert.match(raw, /formatPendingWinnerFeederLabel/);
});

test("round of 16 feeder slots name participants before knockout is played", () => {
  const standings = readFileSync(join(root, "src/lib/wc26-standings.ts"), "utf8");
  const bracket = readFileSync(join(root, "src/lib/wc26/bracket-view.ts"), "utf8");
  const pairings = readFileSync(
    join(root, "src/lib/wc26/knockout-confirmed-pairings.ts"),
    "utf8",
  );
  const fifa = readFileSync(join(root, "src/lib/wc26/fifa-bracket-mapping.ts"), "utf8");
  assert.match(standings, /formatPendingWinnerFeederLabel/);
  assert.match(bracket, /feederParticipantsLabel/);
  assert.match(fifa, /matchNumber:\s*94[\s\S]*matchNumber:\s*81[\s\S]*matchNumber:\s*82/);
  assert.match(pairings, /fixture-081[\s\S]*usa/);
  assert.match(pairings, /fixture-082[\s\S]*bel/);
});

test("live scores orient knockout goals without bracket template labels", () => {
  const raw = readFileSync(join(root, "src/lib/server/wc26-api-football.ts"), "utf8");
  assert.match(raw, /getConfirmedKnockoutPairingByFixtureId/);
  assert.doesNotMatch(raw, /resolveFixtureParticipant/);
});
