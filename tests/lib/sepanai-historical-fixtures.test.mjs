import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { findKnockoutResult, loadConfirmedResults } from "../wc26/load-confirmed-results.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const pack = JSON.parse(
  readFileSync(
    join(root, "tests/fixtures/wc26/sepanai-historical-matches.json"),
    "utf8",
  ),
);
const confirmed = loadConfirmedResults(root);

test("historical pack loads offline with schemaVersion", () => {
  assert.equal(pack.schemaVersion, 1);
  assert.equal(pack.matches.length, 2);
  assert.match(pack.prohibition, /No AI provider/);
});

test("pack scores match confirmed SSOT exactly", () => {
  const finalPack = pack.matches.find((m) => m.matchNumber === 104);
  const thirdPack = pack.matches.find((m) => m.matchNumber === 103);
  const finalSsot = findKnockoutResult(confirmed, 104);
  const thirdSsot = findKnockoutResult(confirmed, 103);
  assert.equal(finalPack.homeScore, finalSsot.homeScore);
  assert.equal(finalPack.awayScore, finalSsot.awayScore);
  assert.equal(finalPack.winnerTeamId, finalSsot.winnerTeamId);
  assert.equal(finalPack.matchStatus, finalSsot.matchStatus);
  assert.equal(thirdPack.homeScore, thirdSsot.homeScore);
  assert.equal(thirdPack.awayScore, thirdSsot.awayScore);
  assert.equal(thirdPack.winnerTeamId, thirdSsot.winnerTeamId);
});