import assert from "node:assert/strict";
import { describe, it } from "node:test";

describe("analytics production host gating", async () => {
  const { isProductionAnalyticsHost, shouldEnableAnalytics } = await import(
    "@/lib/analytics/config"
  );

  it("allows approved production hosts", () => {
    assert.equal(isProductionAnalyticsHost("www.goalcurrent.live"), true);
    assert.equal(isProductionAnalyticsHost("goalcurrent.live"), true);
    assert.equal(shouldEnableAnalytics("www.goalcurrent.live"), true);
  });

  it("blocks localhost and preview deploy hosts", () => {
    assert.equal(isProductionAnalyticsHost("localhost"), false);
    assert.equal(isProductionAnalyticsHost("127.0.0.1"), false);
    assert.equal(isProductionAnalyticsHost("goalcurrent-live-nextjs.vercel.app"), false);
    assert.equal(isProductionAnalyticsHost("branch-preview.vercel.app"), false);
    assert.equal(shouldEnableAnalytics("localhost"), false);
    assert.equal(shouldEnableAnalytics("preview-abc.vercel.app"), false);
  });

  it("blocks non-production domains", () => {
    assert.equal(shouldEnableAnalytics("goalcurrent.online"), false);
    assert.equal(shouldEnableAnalytics("www.example.com"), false);
  });
});

describe("legacy isAnalyticsHost re-export", async () => {
  it("matches production gating", async () => {
    const { isAnalyticsHost } = await import("@/lib/site-integrations");
    assert.equal(isAnalyticsHost("localhost"), false);
    assert.equal(isAnalyticsHost("www.goalcurrent.live"), true);
  });
});
