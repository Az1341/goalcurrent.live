import assert from "node:assert/strict";
import test from "node:test";

const { resolveFinalWinner } = await import("@/lib/wc26/final-winner");

const completedFinal = {
  fixtureId: "fixture-104",
  matchNumber: 104,
  status: "finished",
  statusShort: "FT",
  elapsed: 90,
  homeScore: 3,
  awayScore: 2,
  kickoffUtc: "2026-07-19T19:00:00.000Z",
  homeTeamId: "esp",
  awayTeamId: "arg",
};

test("resolves the home winner from a completed final", () => {
  const result = resolveFinalWinner(completedFinal);
  assert.equal(result?.winnerTeamId, "esp");
  assert.equal(result?.opponentTeamId, "arg");
  assert.equal(result?.decidedOnPenalties, false);
});

test("resolves the away winner from a completed final", () => {
  const result = resolveFinalWinner({
    ...completedFinal,
    homeScore: 1,
    awayScore: 2,
  });
  assert.equal(result?.winnerTeamId, "arg");
});

test("uses a decisive penalty shootout when regulation score is level", () => {
  const result = resolveFinalWinner({
    ...completedFinal,
    statusShort: "PEN",
    homeScore: 2,
    awayScore: 2,
    penaltiesHome: 4,
    penaltiesAway: 5,
  });
  assert.equal(result?.winnerTeamId, "arg");
  assert.equal(result?.decidedOnPenalties, true);
  assert.match(result?.resultKey ?? "", /pens-4-5$/);
});

test("rejects live, unrelated, incomplete, and unresolved results", () => {
  assert.equal(
    resolveFinalWinner({ ...completedFinal, status: "live", statusShort: "2H" }),
    null,
  );
  assert.equal(
    resolveFinalWinner({ ...completedFinal, fixtureId: "fixture-103", matchNumber: 103 }),
    null,
  );
  assert.equal(resolveFinalWinner({ ...completedFinal, homeScore: null }), null);
  assert.equal(
    resolveFinalWinner({ ...completedFinal, homeScore: 2, awayScore: 2 }),
    null,
  );
});
