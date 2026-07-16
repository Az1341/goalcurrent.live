import assert from "node:assert/strict";
import test from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

const { parseScoreBatEmbedUrl } = await import(
  pathToFileURL(join(root, "src/lib/scorebat/parse-embed.ts")).href
);

test("parseScoreBatEmbedUrl accepts scorebat iframe src", () => {
  const html =
    '<iframe frameborder="0" src="https://www.scorebat.com/embed/abc123/" allowfullscreen></iframe>';
  assert.equal(
    parseScoreBatEmbedUrl(html),
    "https://www.scorebat.com/embed/abc123/",
  );
});

test("parseScoreBatEmbedUrl rejects non-scorebat domains", () => {
  const html = '<iframe src="https://evil.example/embed/1"></iframe>';
  assert.equal(parseScoreBatEmbedUrl(html), null);
});

test("parseScoreBatEmbedUrl rejects empty or malformed html", () => {
  assert.equal(parseScoreBatEmbedUrl(""), null);
  assert.equal(parseScoreBatEmbedUrl("<div>no iframe</div>"), null);
});