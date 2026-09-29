import assert from "node:assert/strict";
import test from "node:test";
import { resolveCurrentMatchweek } from "../../src/lib/pl/current-matchweek.ts";

const round = (matchweek, isoDays) =>
  isoDays.map((kickoffUtc) => ({ matchweek, kickoffUtc }));

const fixtures = [
  ...round(1, ["2026-08-21T19:00:00Z", "2026-08-22T11:30:00Z", "2026-08-22T14:00:00Z"]),
  ...round(5, ["2026-09-26T11:30:00Z", "2026-09-26T14:00:00Z", "2026-09-27T15:30:00Z"]),
  ...round(6, ["2026-10-03T11:30:00Z", "2026-10-03T14:00:00Z", "2026-10-04T15:30:00Z"]),
  // Postponed W3 game rescheduled far later must not drag the default back.
  ...round(3, ["2026-09-12T14:00:00Z", "2026-09-12T14:00:00Z", "2026-12-01T20:00:00Z"]),
];

test("opens on the next round once the last round is over", () => {
  assert.equal(resolveCurrentMatchweek(fixtures, Date.parse("2026-09-29T08:44:00Z")), 6);
});

test("keeps the just-played round during its weekend", () => {
  assert.equal(resolveCurrentMatchweek(fixtures, Date.parse("2026-09-27T20:00:00Z")), 5);
});

test("before the season it opens on the first round", () => {
  assert.equal(resolveCurrentMatchweek(fixtures, Date.parse("2026-07-01T00:00:00Z")), 1);
});

test("after the season it opens on the last round", () => {
  assert.equal(resolveCurrentMatchweek(fixtures, Date.parse("2027-06-01T00:00:00Z")), 6);
});

test("returns null without matchweek data", () => {
  assert.equal(resolveCurrentMatchweek([{ matchweek: null, kickoffUtc: "2026-08-21T19:00:00Z" }]), null);
  assert.equal(resolveCurrentMatchweek([]), null);
});
