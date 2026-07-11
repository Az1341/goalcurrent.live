import assert from "node:assert/strict";
import test from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

const { aggregateMatchPlayerStats } = await import(
  pathToFileURL(join(root, "src/lib/match-player-stats.ts")).href
);

const HOME = "Norway";
const AWAY = "England";

test("events-only mode lists players with goals and assists", () => {
  const rows = aggregateMatchPlayerStats(
    {
      events: [
        {
          minute: 12,
          extra: null,
          teamName: HOME,
          playerName: "A. Schjelderup",
          assistName: "M. Odegaard",
          type: "Goal",
          detail: "Normal Goal",
        },
        {
          minute: 38,
          extra: null,
          teamName: AWAY,
          playerName: "J. Bellingham",
          assistName: "A. Gordon",
          type: "Goal",
          detail: "Normal Goal",
        },
      ],
      lineups: { home: null, away: null },
    },
    HOME,
    AWAY,
  );

  assert.equal(rows.length, 4);
  const scorer = rows.find((row) => row.playerName === "A. Schjelderup");
  assert.equal(scorer?.goals, 1);
  assert.equal(scorer?.shots, null);
  const assist = rows.find((row) => row.playerName === "M. Odegaard");
  assert.equal(assist?.assists, 1);
});

test("API stats seed full player rows with shots and ratings", () => {
  const rows = aggregateMatchPlayerStats(
    {
      events: [],
      lineups: { home: null, away: null },
      playerStats: [
        {
          playerName: "A. Schjelderup",
          teamName: HOME,
          number: 9,
          position: "F",
          minutes: 45,
          goals: 1,
          assists: 0,
          shots: 3,
          shotsOnTarget: 2,
          passAccuracy: "78%",
          fouls: 1,
          yellowCards: 0,
          redCards: 0,
          substituted: false,
          rating: 7.4,
        },
        {
          playerName: "J. Bellingham",
          teamName: AWAY,
          number: 10,
          position: "M",
          minutes: 45,
          goals: 0,
          assists: 0,
          shots: 1,
          shotsOnTarget: 1,
          passAccuracy: "82%",
          fouls: 0,
          yellowCards: 0,
          redCards: 0,
          substituted: false,
          rating: 6.9,
        },
      ],
    },
    HOME,
    AWAY,
  );

  assert.equal(rows.length, 2);
  const schjelderup = rows.find((row) => row.playerName === "A. Schjelderup");
  assert.equal(schjelderup?.shots, 3);
  assert.equal(schjelderup?.shotsOnTarget, 2);
  assert.equal(schjelderup?.passAccuracy, "78%");
  assert.equal(schjelderup?.rating, 7.4);
});

test("live events override API goal counts when feed is ahead", () => {
  const rows = aggregateMatchPlayerStats(
    {
      events: [
        {
          minute: 44,
          extra: null,
          teamName: HOME,
          playerName: "A. Schjelderup",
          assistName: null,
          type: "Goal",
          detail: "Normal Goal",
        },
        {
          minute: 45,
          extra: 1,
          teamName: HOME,
          playerName: "A. Schjelderup",
          assistName: null,
          type: "Goal",
          detail: "Normal Goal",
        },
      ],
      lineups: { home: null, away: null },
      playerStats: [
        {
          playerName: "A. Schjelderup",
          teamName: HOME,
          number: 9,
          position: "F",
          minutes: 45,
          goals: 1,
          assists: 0,
          shots: 3,
          shotsOnTarget: 2,
          passAccuracy: "78%",
          fouls: 1,
          yellowCards: 0,
          redCards: 0,
          substituted: false,
          rating: 7.4,
        },
      ],
    },
    HOME,
    AWAY,
  );

  const scorer = rows.find((row) => row.playerName === "A. Schjelderup");
  assert.equal(scorer?.goals, 2);
  assert.equal(scorer?.shots, 3);
});