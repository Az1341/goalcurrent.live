import assert from "node:assert/strict";
import test from "node:test";

test("mapApiFootballStatus maps known short codes", async () => {
  const { mapApiFootballStatus } = await import("@/lib/football-adapter/status");
  assert.equal(mapApiFootballStatus("NS"), "not_started");
  assert.equal(mapApiFootballStatus("1H"), "in_play");
  assert.equal(mapApiFootballStatus("HT"), "paused");
  assert.equal(mapApiFootballStatus("ET"), "extra_time");
  assert.equal(mapApiFootballStatus("PEN"), "finished");
  assert.equal(mapApiFootballStatus("PST"), "postponed");
});

test("mapApiFootballStatus returns unknown for unmapped codes", async () => {
  const { mapApiFootballStatus } = await import("@/lib/football-adapter/status");
  assert.equal(mapApiFootballStatus("ZZZ"), "unknown");
  assert.equal(mapApiFootballStatus(null), "unknown");
});

test("parseApiScore handles numbers and strings", async () => {
  const { parseApiScore } = await import("@/lib/football-adapter/status");
  assert.equal(parseApiScore(2), 2);
  assert.equal(parseApiScore("3"), 3);
  assert.equal(parseApiScore(null), null);
});

test("buildEventFingerprint is deterministic", async () => {
  const { buildEventFingerprint } = await import("@/lib/football-adapter/event-fingerprint");
  const input = {
    fixtureId: 104,
    teamId: 26,
    minute: 55,
    extraMinute: null,
    eventType: "Goal",
    detail: "Normal Goal",
    playerId: 874,
    assistId: null,
  };
  const a = buildEventFingerprint(input);
  const b = buildEventFingerprint(input);
  assert.equal(a, b);
  assert.equal(a.length, 64);
});