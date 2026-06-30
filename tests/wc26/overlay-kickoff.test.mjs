import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

const MAX_DELTA_MS = 30 * 60 * 1000;

function parseKickoffMs(iso) {
  const ms = Date.parse(iso);
  return Number.isFinite(ms) ? ms : null;
}

function readStaticKickoffUtc(fixtureId) {
  const scheduleRaw = readFileSync(
    join(root, "src/data/wc26/knockout-schedule.ts"),
    "utf8",
  );
  const matchNum = Number(fixtureId.replace("fixture-", ""));
  const re = new RegExp(
    `matchNumber:\\s*${matchNum}[^}]*kickoffUtc:\\s*"([^"]+)"`,
  );
  const hit = scheduleRaw.match(re);
  return hit?.[1] ?? null;
}

function shouldApplyApiKickoffUtc(fixtureId, apiKickoffUtc) {
  const staticKickoff = readStaticKickoffUtc(fixtureId);
  if (!staticKickoff) {
    return true;
  }
  const staticMs = parseKickoffMs(staticKickoff);
  const apiMs = parseKickoffMs(apiKickoffUtc);
  if (staticMs === null || apiMs === null) {
    return false;
  }
  return Math.abs(apiMs - staticMs) <= MAX_DELTA_MS;
}

function resolveOverlayKickoffUtc(fixtureId, apiKickoffUtc) {
  if (!apiKickoffUtc) {
    return undefined;
  }
  return shouldApplyApiKickoffUtc(fixtureId, apiKickoffUtc)
    ? apiKickoffUtc
    : undefined;
}

test("results sync uses resolveOverlayKickoffUtc guard", () => {
  const raw = readFileSync(join(root, "src/lib/wc26-results-sync.ts"), "utf8");
  assert.match(raw, /resolveOverlayKickoffUtc/);
  assert.doesNotMatch(raw, /match\.kickoffUtc\s*\?\s*\{\s*kickoffUtc:\s*match\.kickoffUtc/);
});

test("API sync rejects match 73 bad kickoff (3h drift from FIFA static)", () => {
  const staticUtc = readStaticKickoffUtc("fixture-073");
  assert.equal(staticUtc, "2026-06-28T22:00:00.000Z");
  assert.equal(
    resolveOverlayKickoffUtc("fixture-073", "2026-06-28T19:00:00.000Z"),
    undefined,
  );
});

test("API sync rejects match 75 bad kickoff (10h drift from FIFA static)", () => {
  const staticUtc = readStaticKickoffUtc("fixture-075");
  assert.equal(staticUtc, "2026-06-30T03:00:00.000Z");
  assert.equal(
    resolveOverlayKickoffUtc("fixture-075", "2026-06-29T17:00:00.000Z"),
    undefined,
  );
});

test("API sync accepts kickoff within 30 minutes of static schedule", () => {
  const staticUtc = readStaticKickoffUtc("fixture-078");
  assert.equal(staticUtc, "2026-06-30T18:00:00.000Z");
  assert.equal(
    resolveOverlayKickoffUtc("fixture-078", "2026-06-30T18:15:00.000Z"),
    "2026-06-30T18:15:00.000Z",
  );
});

test("corrupted +1h API kickoff for 18:00 BST slot is rejected when static is 17:00Z", () => {
  const canonicalUtc = "2026-06-30T17:00:00.000Z";
  const badApiUtc = "2026-06-30T18:00:00.000Z";
  const staticMs = parseKickoffMs(canonicalUtc);
  const apiMs = parseKickoffMs(badApiUtc);
  assert.ok(Math.abs(apiMs - staticMs) > MAX_DELTA_MS);
});
