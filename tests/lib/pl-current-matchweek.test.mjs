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

test("keeps the round selected through its Monday-night game", () => {
  const withMonday = [
    ...round(1, ["2026-08-21T19:00:00Z", "2026-08-22T11:30:00Z", "2026-08-22T14:00:00Z", "2026-08-22T16:30:00Z", "2026-08-24T19:00:00Z"]),
    ...round(2, ["2026-08-29T14:00:00Z", "2026-08-29T14:00:00Z", "2026-08-30T15:30:00Z"]),
  ];
  // Codex P2 on #93: median+48h flipped to W2 before Monday's 19:00 kickoff.
  assert.equal(resolveCurrentMatchweek(withMonday, Date.parse("2026-08-24T17:00:00Z")), 1);
  assert.equal(resolveCurrentMatchweek(withMonday, Date.parse("2026-08-24T21:00:00Z")), 1);
  assert.equal(resolveCurrentMatchweek(withMonday, Date.parse("2026-08-25T20:00:00Z")), 2);
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
