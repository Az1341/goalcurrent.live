import assert from "node:assert/strict";
import test from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

const { isUnlResultPending, UNL_RESULT_PENDING_BUFFER_MS } = await import(
  pathToFileURL(join(root, "src/lib/unl/contract.ts")).href
);

test("UNL result pending: buffer is three hours", () => {
  assert.equal(UNL_RESULT_PENDING_BUFFER_MS, 3 * 60 * 60 * 1000);
});

test("UNL result pending: stale UPCOMING fixture after buffer is pending", () => {
  const now = new Date("2026-09-28T12:00:00Z");
  const stale = { kickoffUtc: "2026-09-24T18:45:00.000Z", status: "UPCOMING" };
  const future = { kickoffUtc: "2026-10-10T18:45:00.000Z", status: "UPCOMING" };
  const finished = { kickoffUtc: "2026-09-24T18:45:00.000Z", status: "FT" };

  assert.equal(isUnlResultPending(stale, now), true);
  assert.equal(isUnlResultPending(future, now), false);
  assert.equal(isUnlResultPending(finished, now), false);
});

test("UNL result pending: fixture inside the buffer is not pending", () => {
  const kickoffUtc = "2026-09-28T10:00:00.000Z";
  const insideBuffer = new Date("2026-09-28T12:00:00Z"); // 2h after kickoff
  const justPastBuffer = new Date("2026-09-28T13:00:01Z"); // 3h + 1s after

  assert.equal(
    isUnlResultPending({ kickoffUtc, status: "UPCOMING" }, insideBuffer),
    false,
  );
  assert.equal(
    isUnlResultPending({ kickoffUtc, status: "UPCOMING" }, justPastBuffer),
    true,
  );
});

test("UNL result pending: invalid kickoff is never pending", () => {
  assert.equal(
    isUnlResultPending({ kickoffUtc: "", status: "UPCOMING" }),
    false,
  );
});
