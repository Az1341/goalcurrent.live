import assert from "node:assert/strict";
import { describe, it, beforeEach, afterEach } from "node:test";

describe("analytics event deduplication", async () => {
  const { shouldSkipDuplicateEvent, resetDedupeKey } = await import(
    "@/lib/analytics/deduplication"
  );

  /** @type {Record<string, string>} */
  let store = {};

  beforeEach(() => {
    store = {};
    globalThis.sessionStorage = {
      getItem(key) {
        return store[key] ?? null;
      },
      setItem(key, value) {
        store[key] = String(value);
      },
      removeItem(key) {
        delete store[key];
      },
    };
  });

  afterEach(() => {
    delete globalThis.sessionStorage;
  });

  it("allows first emission and blocks rapid duplicates", () => {
    assert.equal(shouldSkipDuplicateEvent("affiliate:nord", { ttlMs: 5000 }), false);
    assert.equal(shouldSkipDuplicateEvent("affiliate:nord", { ttlMs: 5000 }), true);
  });

  it("allows re-emission after reset", () => {
    assert.equal(shouldSkipDuplicateEvent("article:slug-a", { ttlMs: 60_000 }), false);
    assert.equal(shouldSkipDuplicateEvent("article:slug-a", { ttlMs: 60_000 }), true);
    resetDedupeKey("article:slug-a");
    assert.equal(shouldSkipDuplicateEvent("article:slug-a", { ttlMs: 60_000 }), false);
  });
});
