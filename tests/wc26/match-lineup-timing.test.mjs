import assert from "node:assert/strict";
import test from "node:test";

const LINEUP_PREVIEW_MS = 30 * 60 * 1_000;

function kickoffMs(kickoffUtc) {
  const ms = new Date(kickoffUtc).getTime();
  return Number.isFinite(ms) ? ms : null;
}

function isLineupRevealWindow(kickoffUtc, nowMs = Date.now()) {
  const start = kickoffMs(kickoffUtc);
  if (start == null) return false;
  return nowMs >= start - LINEUP_PREVIEW_MS;
}

function msUntilLineupReveal(kickoffUtc, nowMs = Date.now()) {
  const start = kickoffMs(kickoffUtc);
  if (start == null) return Infinity;
  return Math.max(0, start - LINEUP_PREVIEW_MS - nowMs);
}

const KICKOFF = "2026-07-14T19:00:00.000Z";

test("LINEUP_PREVIEW_MS is 30 minutes", () => {
  assert.equal(LINEUP_PREVIEW_MS, 30 * 60 * 1_000);
});

test("isLineupRevealWindow is false more than 30 minutes before kick-off", () => {
  const start = new Date(KICKOFF).getTime();
  assert.equal(isLineupRevealWindow(KICKOFF, start - LINEUP_PREVIEW_MS - 1), false);
});

test("isLineupRevealWindow opens exactly 30 minutes before kick-off", () => {
  const start = new Date(KICKOFF).getTime();
  assert.equal(isLineupRevealWindow(KICKOFF, start - LINEUP_PREVIEW_MS), true);
  assert.equal(isLineupRevealWindow(KICKOFF, start), true);
});

test("msUntilLineupReveal counts down to reveal window", () => {
  const start = new Date(KICKOFF).getTime();
  const twoHoursBefore = start - 2 * 60 * 60 * 1_000;
  assert.equal(msUntilLineupReveal(KICKOFF, twoHoursBefore), 90 * 60 * 1_000);
  assert.equal(msUntilLineupReveal(KICKOFF, start - LINEUP_PREVIEW_MS), 0);
});