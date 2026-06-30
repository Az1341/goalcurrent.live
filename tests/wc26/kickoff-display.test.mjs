import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

const { formatKickoffLocalTime, formatKickoffLocal } = await import(
  pathToFileURL(join(root, "src/lib/formatKickoffLocal.ts")).href
);

const UK_BST_EXAMPLE_UTC = "2026-06-30T17:00:00.000Z";
const CORRUPTED_API_UTC = "2026-06-30T18:00:00.000Z";

test("UK timezone shows 18:00 BST for 17:00 UTC kickoff", () => {
  assert.equal(formatKickoffLocalTime(UK_BST_EXAMPLE_UTC, { timeZone: "Europe/London" }), "18:00");
});

test("CET timezone shows 19:00 for 17:00 UTC kickoff in summer", () => {
  assert.equal(formatKickoffLocalTime(UK_BST_EXAMPLE_UTC, { timeZone: "Europe/Paris" }), "19:00");
});

test("UTC timezone shows 17:00 for 17:00 UTC kickoff", () => {
  assert.equal(formatKickoffLocalTime(UK_BST_EXAMPLE_UTC, { timeZone: "UTC" }), "17:00");
});

test("wrong UTC (+1h) shows 19:00 BST regression symptom", () => {
  assert.equal(formatKickoffLocalTime(CORRUPTED_API_UTC, { timeZone: "Europe/London" }), "19:00");
});

test("fixtures page and live page both use canonical device formatter", () => {
  const fixturesPage = readFileSync(join(root, "src/lib/wc26-fixtures-page.ts"), "utf8");
  const liveLib = readFileSync(join(root, "src/lib/wc26-live.ts"), "utf8");
  const liveCard = readFileSync(join(root, "src/components/live/LiveMatchCard.tsx"), "utf8");
  assert.match(fixturesPage, /formatKickoffLocalTime/);
  assert.match(liveLib, /formatKickoffLocalTime/);
  assert.match(liveCard, /useLocalizedKickoffTime/);
});

test("live and fixtures calendar use LocalizedKickoffTime component", () => {
  const calendar = readFileSync(join(root, "src/components/wc26/FixturesCalendar.tsx"), "utf8");
  const kickoff = readFileSync(join(root, "src/components/KickoffTime.tsx"), "utf8");
  assert.match(calendar, /LocalizedKickoffTime/);
  assert.match(kickoff, /formatKickoffLocalTime/);
  assert.match(kickoff, /useSyncExternalStore/);
});

test("full label includes short timezone for device", () => {
  const label = formatKickoffLocal(UK_BST_EXAMPLE_UTC, { timeZone: "Europe/London" });
  assert.match(label, /18:00/);
  assert.match(label, /BST|GMT/);
});

test("refresh-stable: same UTC input yields same formatted output", () => {
  const first = formatKickoffLocalTime(UK_BST_EXAMPLE_UTC, { timeZone: "Europe/London" });
  const second = formatKickoffLocalTime(UK_BST_EXAMPLE_UTC, { timeZone: "Europe/London" });
  assert.equal(first, second);
});
