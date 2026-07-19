import fs from "node:fs";

const files = {
  "tests/analytics/environment-gating.test.mjs": `import assert from "node:assert/strict";
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
    assert.equal(shouldEnableAnalytics("localhost"), false);
    assert.equal(shouldEnableAnalytics("preview-abc.vercel.app"), false);
  });

  it("blocks non-production domains", () => {
    assert.equal(shouldEnableAnalytics("goalcurrent.online"), false);
  });
});

describe("legacy isAnalyticsHost re-export", async () => {
  it("matches production gating", async () => {
    const { isAnalyticsHost } = await import("@/lib/site-integrations");
    assert.equal(isAnalyticsHost("localhost"), false);
    assert.equal(isAnalyticsHost("www.goalcurrent.live"), true);
  });
});
`,
  "tests/analytics/event-schema.test.mjs": `import assert from "node:assert/strict";
import { describe, it } from "node:test";

describe("GA4 event schemas", async () => {
  const { validateEventParams } = await import("@/lib/analytics/schemas");

  const baseMatch = {
    match_id: "fixture-104",
    competition: "FIFA World Cup 2026",
    home_team: "Spain",
    away_team: "Argentina",
    match_status: "finished",
    source_surface: "match_centre",
    language: "en",
  };

  it("accepts match_open with required parameters", () => {
    const result = validateEventParams("match_open", baseMatch);
    assert.equal(result.ok, true);
  });

  it("rejects PII-like email in parameters", () => {
    const result = validateEventParams("match_open", {
      ...baseMatch,
      home_team: "user@example.com",
    });
    assert.equal(result.ok, false);
  });
});
`,
  "tests/analytics/event-deduplication.test.mjs": `import assert from "node:assert/strict";
import { describe, it, beforeEach, afterEach } from "node:test";

describe("analytics event deduplication", async () => {
  const { shouldSkipDuplicateEvent, resetDedupeKey } = await import(
    "@/lib/analytics/deduplication"
  );

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

  it("blocks rapid duplicates", () => {
    assert.equal(shouldSkipDuplicateEvent("affiliate:nord", { ttlMs: 5000 }), false);
    assert.equal(shouldSkipDuplicateEvent("affiliate:nord", { ttlMs: 5000 }), true);
    resetDedupeKey("affiliate:nord");
    assert.equal(shouldSkipDuplicateEvent("affiliate:nord", { ttlMs: 5000 }), false);
  });
});
`,
  "tests/analytics/metadata-consistency.test.mjs": `import assert from "node:assert/strict";
import { describe, it } from "node:test";

describe("canonical metadata titles", async () => {
  const {
    buildStableMatchTitle,
    isUnresolvedMatchParticipantLabel,
    normalizePageTitleText,
  } = await import("@/lib/seo/canonical-titles");
  const { isInvalidAnalyticsPageTitle } = await import("@/lib/analytics/schemas");

  it("normalizes mojibake", () => {
    const normalized = normalizePageTitleText("Title \u00e2\u20ac\u201d Subtitle");
    assert.doesNotMatch(normalized, /\u00e2\u20ac/);
  });

  it("stable fallback for placeholders", () => {
    assert.equal(isUnresolvedMatchParticipantLabel("Winner Match 62"), true);
    const title = buildStableMatchTitle(
      "Winner Match 62",
      "Loser Match 61",
      "fixture-104",
    );
    assert.equal(title, "World Cup 2026 Match 104");
  });

  it("rejects invalid analytics titles", () => {
    assert.equal(isInvalidAnalyticsPageTitle("Spain vs TBD"), true);
    assert.equal(isInvalidAnalyticsPageTitle("Live Scores"), false);
  });
});
`,
};

for (const [path, content] of Object.entries(files)) {
  fs.writeFileSync(path, content, "utf8");
}

console.log("Wrote analytics tests UTF-8");
