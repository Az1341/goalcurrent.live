import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

test("Wc26ResultsSync gates network when archive complete", () => {
  const src = readFileSync(
    join(root, "src/components/wc26/Wc26ResultsSync.tsx"),
    "utf8",
  );
  assert.match(src, /isWc26TournamentComplete/);
  assert.match(src, /archiveComplete \? null/);
});

test("useLiveScores accepts enabled flag", () => {
  const src = readFileSync(
    join(root, "src/lib/client/useLiveScores.ts"),
    "utf8",
  );
  assert.match(src, /enabled = true/);
  assert.match(src, /enabled \? LIVE_API_PATHS\.wc26LiveScores : null/);
});