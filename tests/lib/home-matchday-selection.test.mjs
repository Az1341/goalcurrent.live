import assert from "node:assert/strict";
import test from "node:test";

const {
  formatMatchdayScore,
  orderMatchdayForFeatured,
  dedupeMatchdayCards,
  countMatchdayFilters,
  matchdayHubHref,
  filterMatchdayCards,
} = await import("../../src/lib/home/matchday.ts");

function card(overrides) {
  return {
    competitionId: "pl",
    qualifiedId: "pl:1",
    fixtureId: 1,
    kickoffUtc: "2026-09-19T15:00:00.000Z",
    homeTeamName: "Home",
    homeTeamLogo: null,
    awayTeamName: "Away",
    awayTeamLogo: null,
    bucket: "upcoming",
    status: "UPCOMING",
    statusShort: "NS",
    elapsed: null,
    homeScore: null,
    awayScore: null,
    competitionLabel: "Premier League 26/27",
    hubHref: "/premier-league/match/1",
    favouriteMatchId: "pl:1",
    liveScoresSupported: true,
    ...overrides,
  };
}

const NOW = new Date("2026-09-19T16:00:00.000Z");

test("featured order: LIVE beats earlier historical FT (global-sort regression)", () => {
  const historicalFt = card({
    fixtureId: 10,
    qualifiedId: "pl:10",
    favouriteMatchId: "pl:10",
    hubHref: "/premier-league/match/10",
    kickoffUtc: "2026-09-12T12:00:00.000Z",
    bucket: "finished",
    status: "FT",
    statusShort: "FT",
    homeScore: 2,
    awayScore: 1,
  });
  const live = card({
    fixtureId: 20,
    qualifiedId: "pl:20",
    favouriteMatchId: "pl:20",
    hubHref: "/premier-league/match/20",
    kickoffUtc: "2026-09-19T14:00:00.000Z",
    bucket: "live",
    status: "LIVE",
    statusShort: "2H",
    elapsed: 67,
    homeScore: 1,
    awayScore: 0,
  });
  const todayUpcoming = card({
    fixtureId: 30,
    qualifiedId: "pl:30",
    favouriteMatchId: "pl:30",
    hubHref: "/premier-league/match/30",
    kickoffUtc: "2026-09-19T19:00:00.000Z",
    bucket: "upcoming",
    status: "UPCOMING",
  });

  const ordered = orderMatchdayForFeatured(
    [historicalFt, todayUpcoming, live],
    NOW,
  );
  assert.equal(ordered[0].fixtureId, 20);
  assert.equal(ordered[0].bucket, "live");
  assert.ok(!ordered.some((c) => c.fixtureId === 10), "historical FT excluded");
  assert.equal(ordered[1].fixtureId, 30);
});

test("featured order: today's FT allowed after live/upcoming", () => {
  const todayFt = card({
    fixtureId: 40,
    qualifiedId: "pl:40",
    favouriteMatchId: "pl:40",
    hubHref: "/premier-league/match/40",
    kickoffUtc: "2026-09-19T12:00:00.000Z",
    bucket: "finished",
    status: "FT",
    homeScore: 0,
    awayScore: 0,
  });
  const live = card({
    fixtureId: 41,
    qualifiedId: "pl:41",
    favouriteMatchId: "pl:41",
    hubHref: "/premier-league/match/41",
    kickoffUtc: "2026-09-19T15:00:00.000Z",
    bucket: "live",
    status: "LIVE",
    homeScore: 1,
    awayScore: 1,
  });
  const ordered = orderMatchdayForFeatured([todayFt, live], NOW);
  assert.deepEqual(
    ordered.map((c) => c.fixtureId),
    [41, 40],
  );
});

test("formatMatchdayScore: null never becomes fabricated 0", () => {
  const missing = formatMatchdayScore(null, null);
  assert.equal(missing.known, false);
  assert.notEqual(missing.home, "0");
  assert.notEqual(missing.away, "0");

  const zero = formatMatchdayScore(0, 0);
  assert.equal(zero.known, true);
  assert.equal(zero.home, "0");
  assert.equal(zero.away, "0");

  const partial = formatMatchdayScore(1, null);
  assert.equal(partial.known, false);
});

test("dedupe keeps competition-qualified IDs with same numeric fixtureId", () => {
  const pl = card({
    competitionId: "pl",
    fixtureId: 1,
    qualifiedId: "pl:1",
    favouriteMatchId: "pl:1",
  });
  const ucl = card({
    competitionId: "ucl",
    fixtureId: 1,
    qualifiedId: "ucl:1",
    favouriteMatchId: "ucl:1",
    hubHref: "/champions-league/match/1",
    competitionLabel: "UCL",
  });
  const dup = card({
    competitionId: "pl",
    fixtureId: 1,
    qualifiedId: "pl:1",
    favouriteMatchId: "pl:1",
  });
  const out = dedupeMatchdayCards([pl, ucl, dup]);
  assert.equal(out.length, 2);
  assert.deepEqual(
    out.map((c) => c.qualifiedId).sort(),
    ["pl:1", "ucl:1"],
  );
});

test("filter counts and filterMatchdayCards", () => {
  const cards = [
    card({ fixtureId: 1, qualifiedId: "pl:1", bucket: "live", status: "LIVE" }),
    card({
      fixtureId: 2,
      qualifiedId: "pl:2",
      bucket: "finished",
      status: "FT",
    }),
    card({
      fixtureId: 3,
      qualifiedId: "pl:3",
      bucket: "upcoming",
      status: "UPCOMING",
    }),
    card({
      fixtureId: 4,
      qualifiedId: "pl:4",
      bucket: "upcoming",
      status: "UPCOMING",
    }),
  ];
  const counts = countMatchdayFilters(cards);
  assert.deepEqual(counts, { all: 4, live: 1, finished: 1, upcoming: 2 });
  assert.equal(filterMatchdayCards(cards, "live").length, 1);
  assert.equal(filterMatchdayCards(cards, "upcoming").length, 2);
});

test("canonical hub hrefs per competition", () => {
  assert.equal(matchdayHubHref("pl", 1557409), "/premier-league/match/1557409");
  assert.equal(matchdayHubHref("ucl", 99), "/champions-league/match/99");
  assert.equal(matchdayHubHref("facup", 88), "/fa-cup/match/88");
  assert.equal(matchdayHubHref("unl", 77), "/nations-league/match/77");
});
