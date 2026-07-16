import assert from "node:assert/strict";
import { describe, it } from "node:test";

describe("server cache LRU", () => {
  it("stores and retrieves cached values", async () => {
    const { getCached, setCached } = await import("@/lib/server/cache");
    setCached("unit-test-key", { ok: true }, 60_000);
    const value = getCached("unit-test-key");
    assert.deepEqual(value, { ok: true });
  });

  it("returns null for missing keys", async () => {
    const { getCached } = await import("@/lib/server/cache");
    assert.equal(getCached("missing-cache-key-xyz"), null);
  });
});

describe("rate limiting", () => {
  it("allows requests under the limit", async () => {
    const { checkRateLimit } = await import("@/lib/server/cache");
    const ip = `test-ip-${Date.now()}`;
    const result = checkRateLimit(ip, "/api/news");
    assert.equal(result.allowed, true);
  });
});