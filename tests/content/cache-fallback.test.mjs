import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

test("seed JSON files contain items", () => {
  const newsSeed = require("../../src/utils/cache/news.json");
  const videosSeed = require("../../src/utils/cache/videos.json");
  const articlesSeed = require("../../src/utils/cache/articles.json");

  assert.ok(newsSeed.items.length > 0);
  assert.ok(videosSeed.items.length > 0);
  assert.ok(articlesSeed.items.length > 0);
});

test("seed video entries use embed URLs not raw media files", () => {
  const videosSeed = require("../../src/utils/cache/videos.json");
  for (const item of videosSeed.items) {
    assert.ok(item.embedUrl);
    assert.ok(!item.embedUrl.endsWith(".mp4"));
  }
});
