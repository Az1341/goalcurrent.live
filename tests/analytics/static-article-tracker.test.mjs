import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

describe("static article analytics wiring", () => {
  it("mounts ArticleViewTracker from StaticArticleSeo", () => {
    const source = readFileSync(
      join(root, "src/components/seo/StaticArticleSeo.tsx"),
      "utf8",
    );
    assert.match(source, /ArticleViewTracker/);
    assert.match(source, /articleId=\{slug\}/);
  });

  it("page_view listener uses remount-safe dedupe", () => {
    const source = readFileSync(
      join(root, "src/components/analytics/AnalyticsRouteListener.tsx"),
      "utf8",
    );
    assert.match(source, /shouldSkipDuplicateEvent/);
    assert.match(source, /page_view:\$\{dedupeKey\}/);
  });
});