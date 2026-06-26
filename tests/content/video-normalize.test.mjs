import test from "node:test";
import assert from "node:assert/strict";

function youtubeEmbedUrl(videoId) {
  return `https://www.youtube.com/embed/${videoId}`;
}

test("youtubeEmbedUrl returns iframe-safe embed path", () => {
  assert.equal(
    youtubeEmbedUrl("abc123"),
    "https://www.youtube.com/embed/abc123",
  );
});

test("normalized video entries avoid raw hosted media", () => {
  const embedUrl = youtubeEmbedUrl("abc123");
  assert.ok(embedUrl.includes("/embed/"));
  assert.ok(!embedUrl.endsWith(".mp4"));
});
