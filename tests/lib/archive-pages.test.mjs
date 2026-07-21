import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { findKnockoutResult, loadConfirmedResults } from "../wc26/load-confirmed-results.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const confirmed = loadConfirmedResults(root);

test("final and third-place SSOT scores are consistent", () => {
  const final = findKnockoutResult(confirmed, 104);
  const third = findKnockoutResult(confirmed, 103);
  assert.ok(final);
  assert.ok(third);
  assert.equal(final.winnerTeamId, "esp");
  assert.equal(final.homeScore, 1);
  assert.equal(final.awayScore, 0);
  assert.equal(final.matchStatus, "aet");
  assert.equal(third.winnerTeamId, "eng");
  assert.equal(third.homeScore, 4);
  assert.equal(third.awayScore, 6);
});

test("archive hub page no longer mounts live scoreboard", () => {
  const hub = readFileSync(
    join(root, "src/app/[locale]/worldcup2026/page.tsx"),
    "utf8",
  );
  assert.doesNotMatch(hub, /Wc26Scoreboard/);
  assert.match(hub, /World Cup 2026 Archive/);
  assert.match(hub, /getWc26ArchiveFinalSummary/);
});

test("bracket polling supports archiveMode", () => {
  const src = readFileSync(
    join(root, "src/components/wc26/bracket/BracketLivePolling.tsx"),
    "utf8",
  );
  assert.match(src, /archiveMode/);
  assert.match(src, /allowNetwork/);
});