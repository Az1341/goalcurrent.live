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

function readKnockoutKickoffUtc(matchNumber) {
  const scheduleRaw = readFileSync(
    join(root, "src/data/wc26/knockout-schedule.ts"),
    "utf8",
  );
  const re = new RegExp(
    `matchNumber:\\s*${matchNumber}[^}]*kickoffUtc:\\s*"([^"]+)"`,
  );
  const hit = scheduleRaw.match(re);
  return hit?.[1] ?? null;
}

test("match 82 Belgium vs Senegal — 21:00 BST on 1 July (FIFA 4pm ET Seattle)", () => {
  const utc = readKnockoutKickoffUtc(82);
  assert.equal(utc, "2026-07-01T20:00:00.000Z");
  assert.equal(formatKickoffLocalTime(utc, { timeZone: "Europe/London" }), "21:00");
});

test("match 81 USA vs Bosnia — 01:00 BST on 2 July (FIFA 8pm ET Santa Clara)", () => {
  const utc = readKnockoutKickoffUtc(81);
  assert.equal(utc, "2026-07-02T00:00:00.000Z");
  assert.equal(formatKickoffLocalTime(utc, { timeZone: "Europe/London" }), "01:00");
});

test("match 86 Argentina vs Cabo Verde — 23:00 BST on 3 July (FIFA 6pm ET Miami)", () => {
  const utc = readKnockoutKickoffUtc(86);
  assert.equal(utc, "2026-07-03T22:00:00.000Z");
  assert.equal(formatKickoffLocalTime(utc, { timeZone: "Europe/London" }), "23:00");
});

test("match 87 Colombia vs Ghana — 03:30 BST on 4 July (FIFA 9:30pm ET Kansas City)", () => {
  const utc = readKnockoutKickoffUtc(87);
  assert.equal(utc, "2026-07-04T02:30:00.000Z");
  assert.equal(formatKickoffLocalTime(utc, { timeZone: "Europe/London" }), "03:30");
});

test("match 88 Australia vs Egypt — 19:00 BST on 3 July (FIFA 2pm ET Dallas)", () => {
  const utc = readKnockoutKickoffUtc(88);
  assert.equal(utc, "2026-07-03T18:00:00.000Z");
  assert.equal(formatKickoffLocalTime(utc, { timeZone: "Europe/London" }), "19:00");
});

test("every knockout schedule kickoffUtc matches venue-local stadium time", () => {
  const scheduleRaw = readFileSync(
    join(root, "src/data/wc26/knockout-schedule.ts"),
    "utf8",
  );
  const venuesRaw = readFileSync(join(root, "src/data/wc26/venues.ts"), "utf8");
  const venueTz = new Map();
  for (const match of venuesRaw.matchAll(/id:\s*"([^"]+)"[\s\S]*?timezone:\s*"([^"]+)"/g)) {
    venueTz.set(match[1], match[2]);
  }

  function stadiumLocalTimeToUtcIso(venueId, dateYmd, hour, minute) {
    const timeZone = venueTz.get(venueId) ?? "UTC";
    const [year, month, day] = dateYmd.split("-").map(Number);
    const guessMs = Date.UTC(year, month - 1, day, hour, minute);
    for (let offsetHours = -16; offsetHours <= 16; offsetHours += 1) {
      const candidate = new Date(guessMs + offsetHours * 3_600_000);
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).formatToParts(candidate);
      const read = (type) =>
        Number(parts.find((part) => part.type === type)?.value ?? "0");
      if (
        read("year") === year &&
        read("month") === month &&
        read("day") === day &&
        read("hour") === hour &&
        read("minute") === minute
      ) {
        return candidate.toISOString();
      }
    }
    return new Date(guessMs).toISOString();
  }

  const entryRe =
    /matchNumber:\s*(\d+)[\s\S]*?venueId:\s*"([^"]+)"[\s\S]*?localDate:\s*"([^"]+)"[\s\S]*?localHour:\s*(\d+)[\s\S]*?localMinute:\s*(\d+)[\s\S]*?kickoffUtc:\s*"([^"]+)"/g;
  const entries = [...scheduleRaw.matchAll(entryRe)];
  assert.equal(entries.length, 32);
  for (const match of entries) {
    const [, matchNumber, venueId, localDate, localHour, localMinute, kickoffUtc] =
      match;
    const computed = stadiumLocalTimeToUtcIso(
      venueId,
      localDate,
      Number(localHour),
      Number(localMinute),
    );
    assert.equal(
      computed,
      kickoffUtc,
      `match ${matchNumber} kickoffUtc must match venue local time`,
    );
  }
});
