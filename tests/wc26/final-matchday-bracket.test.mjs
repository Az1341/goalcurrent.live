import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

test("group A final matchday fixtures share identical kickoff UTC", () => {
  const raw = readFileSync(join(root, "src/data/wc26/fixtures.ts"), "utf8");
  const sameDayMatches = [...raw.matchAll(
    /\[(\d+),\s*"a",\s*3,\s*"[^"]+",\s*"[^"]+",\s*"[^"]+",\s*"([^"]+)"\]/g,
  )];
  assert.equal(sameDayMatches.length, 2);
  assert.equal(sameDayMatches[0][2], sameDayMatches[1][2]);
});

test("fifa bracket mapping defines sixteen round-of-32 templates", () => {
  const raw = readFileSync(join(root, "src/lib/wc26/fifa-bracket-mapping.ts"), "utf8");
  const block = raw.split("FIFA_ROUND_OF_32_TEMPLATES")[1]?.split("];")[0] ?? "";
  const matches = block.match(/matchNumber:\s*(7[3-9]|8[0-8])/g) ?? [];
  assert.equal(matches.length, 16);
});

test("bracket section renders modular round components", () => {
  const raw = readFileSync(join(root, "src/components/wc26/BracketSection.tsx"), "utf8");
  assert.match(raw, /buildKnockoutBracketRounds/);
  assert.match(raw, /BracketRound/);
});

test("group hub mounts final matchday dual-card section", () => {
  const raw = readFileSync(join(root, "src/components/wc26/GroupHubContent.tsx"), "utf8");
  assert.match(raw, /GroupFinalMatchdaySection/);
  assert.match(raw, /getFinalMatchdayPair/);
  assert.match(readFileSync(join(root, "src/components/wc26/GroupFinalMatchdaySection.tsx"), "utf8"), /MatchCardFinalRound/);
});