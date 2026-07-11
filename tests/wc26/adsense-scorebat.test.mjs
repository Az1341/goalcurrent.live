import assert from "node:assert/strict";
import test from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

const { parseScoreBatEmbedUrl } = await import(
  pathToFileURL(join(root, "src/lib/scorebat/parse-embed.ts")).href
);
const { isAdSenseApproved, isAdSenseEnabled } = await import(
  pathToFileURL(join(root, "src/lib/site-integrations.ts")).href
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

test("isAdSenseApproved is false until NEXT_PUBLIC_ADSENSE_ENABLED=true", () => {
  const previous = process.env.NEXT_PUBLIC_ADSENSE_ENABLED;
  try {
    delete process.env.NEXT_PUBLIC_ADSENSE_ENABLED;
    assert.equal(isAdSenseApproved(), false);
    process.env.NEXT_PUBLIC_ADSENSE_ENABLED = "true";
    assert.equal(isAdSenseApproved(), true);
    process.env.NEXT_PUBLIC_ADSENSE_ENABLED = "false";
    assert.equal(isAdSenseApproved(), false);
  } finally {
    if (previous === undefined) {
      delete process.env.NEXT_PUBLIC_ADSENSE_ENABLED;
    } else {
      process.env.NEXT_PUBLIC_ADSENSE_ENABLED = previous;
    }
  }
});

test("isAdSenseEnabled requires production host and approval flag", () => {
  const previous = process.env.NEXT_PUBLIC_ADSENSE_ENABLED;
  try {
    process.env.NEXT_PUBLIC_ADSENSE_ENABLED = "true";
    assert.equal(isAdSenseEnabled("goalcurrent.live"), true);
    assert.equal(isAdSenseEnabled("localhost"), false);
    process.env.NEXT_PUBLIC_ADSENSE_ENABLED = "false";
    assert.equal(isAdSenseEnabled("goalcurrent.live"), false);
  } finally {
    if (previous === undefined) {
      delete process.env.NEXT_PUBLIC_ADSENSE_ENABLED;
    } else {
      process.env.NEXT_PUBLIC_ADSENSE_ENABLED = previous;
    }
  }
});