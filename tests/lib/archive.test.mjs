import assert from "node:assert/strict";
import test from "node:test";

const {
  WC26_ARCHIVE_DATA_AS_OF,
  WC26_ARCHIVE_LABEL,
  formatArchiveScoreLine,
  getWc26ArchiveFinalSummary,
  isWc26TournamentComplete,
} = await import("@/lib/wc26/archive");

test("archive label and data-as-of constants are set", () => {
  assert.equal(WC26_ARCHIVE_LABEL, "World Cup 2026 Archive");
  assert.equal(WC26_ARCHIVE_DATA_AS_OF, "2026-07-19");
});

test("tournament is complete from verified final SSOT", () => {
  assert.equal(isWc26TournamentComplete(), true);
});

test("archive final summary matches confirmed Match 104", () => {
  const summary = getWc26ArchiveFinalSummary();
  assert.ok(summary);
  assert.equal(summary.fixtureId, "fixture-104");
  assert.equal(summary.matchNumber, 104);
  assert.equal(summary.winnerTeamId, "esp");
  assert.equal(summary.runnerUpTeamId, "arg");
  assert.equal(summary.homeScore, 1);
  assert.equal(summary.awayScore, 0);
  assert.equal(summary.matchStatus, "aet");
  assert.equal(summary.winnerName, "Spain");
  assert.equal(summary.runnerUpName, "Argentina");
  assert.match(formatArchiveScoreLine(summary), /1.+0/);
  assert.match(formatArchiveScoreLine(summary), /AET/);
});