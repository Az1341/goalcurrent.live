import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

function read(rel) {
  return readFileSync(join(root, rel), "utf8");
}

function walkTsFiles(dir, acc = []) {
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, name.name);
    if (name.isDirectory()) {
      if (name.name === "node_modules" || name.name === ".next") continue;
      walkTsFiles(p, acc);
    } else if (/\.(tsx?|mjs|js)$/.test(name.name)) {
      acc.push(p);
    }
  }
  return acc;
}

describe("SPA page_view regression (GC-GA4-TEST-001)", () => {
  it("keeps send_page_view false in GA init and transport config", () => {
    const ga = read("src/components/analytics/GA.tsx");
    const transport = read("src/lib/analytics/transport.ts");
    assert.match(ga, /send_page_view:\s*false/);
    assert.match(transport, /send_page_view:\s*false/);
    assert.doesNotMatch(ga, /send_page_view:\s*true/);
    assert.doesNotMatch(transport, /send_page_view:\s*true/);
  });

  it("loads a single gtag/js script and guards init with __gc_gtag_init", () => {
    const ga = read("src/components/analytics/GA.tsx");
    const transport = read("src/lib/analytics/transport.ts");
    const scriptTags = ga.match(/googletagmanager\.com\/gtag\/js/g) || [];
    assert.equal(scriptTags.length, 1);
    assert.match(ga, /__gc_gtag_init/);
    assert.match(transport, /if \(window\.__gc_gtag_init\) return/);
  });

  it("gates analytics on consent accepted before enabling scripts", () => {
    const ga = read("src/components/analytics/GA.tsx");
    assert.match(ga, /COOKIE_CONSENT_ACCEPTED/);
    assert.match(ga, /COOKIE_CONSENT_KEY/);
    assert.match(ga, /consent && Boolean\(GA_MEASUREMENT_ID\) && shouldEnableAnalytics/);
    assert.match(ga, /if \(!enabled\) \{\s*return null;/);
  });

  it("emits manual page_view only from AnalyticsRouteListener → sendPageView", () => {
    const listener = read("src/components/analytics/AnalyticsRouteListener.tsx");
    assert.match(listener, /sendPageView\(/);
    assert.match(listener, /shouldSkipDuplicateEvent\(`page_view:\$\{dedupeKey\}`/);
    assert.match(listener, /PAGE_VIEW_REMOUNT_TTL_MS/);

    const srcRoot = join(root, "src");
    const files = walkTsFiles(srcRoot);
    const sendPageViewCallSites = [];
    const rawPageViewEvents = [];
    for (const file of files) {
      const text = readFileSync(file, "utf8");
      const rel = file.slice(root.length + 1).replace(/\\/g, "/");
      if (/\bsendPageView\s*\(/.test(text) && !rel.endsWith("transport.ts") && !rel.endsWith("index.ts")) {
        const matches = text.match(/\bsendPageView\s*\(/g) || [];
        sendPageViewCallSites.push({ rel, count: matches.length });
      }
      if (/gtag\s*\(\s*['"]event['"]\s*,\s*['"]page_view['"]/.test(text)) {
        rawPageViewEvents.push(rel);
      }
      if (/['"]event['"]\s*,\s*['"]page_view['"]/.test(text) && rel.includes("components") && !rel.includes("transport")) {
        // flag direct event page_view outside transport
        if (!rel.endsWith("AnalyticsRouteListener.tsx")) {
          rawPageViewEvents.push(rel);
        }
      }
    }

    assert.deepEqual(
      sendPageViewCallSites,
      [{ rel: "src/components/analytics/AnalyticsRouteListener.tsx", count: 1 }],
      "expected exactly one sendPageView call site in components",
    );
    assert.equal(
      rawPageViewEvents.filter((r) => !r.endsWith("transport.ts")).length,
      0,
      `unexpected direct page_view emitters: ${rawPageViewEvents.join(", ")}`,
    );
  });

  it("initGtag does not re-run config when already initialised", async () => {
    const calls = [];
    globalThis.window = {
      __gc_gtag_init: false,
      dataLayer: [],
      gtag: undefined,
      location: { hostname: "www.goalcurrent.live", href: "https://www.goalcurrent.live/" },
    };
    // Minimal gtag stub after first initGtag
    const { initGtag } = await import("../../src/lib/analytics/transport.ts");
    const origPush = Array.prototype.push;
    // Capture config via wrapping after import by re-calling with spy
    window.dataLayer = [];
    window.__gc_gtag_init = false;
    window.gtag = undefined;

    initGtag("G-X84HCE5KGT");
    assert.equal(window.__gc_gtag_init, true);
    const firstLayerLen = window.dataLayer.length;
    assert.ok(firstLayerLen >= 2, "expected js + config pushes");

    const before = window.dataLayer.length;
    initGtag("G-X84HCE5KGT");
    assert.equal(window.dataLayer.length, before, "second initGtag must not push again");

    const configEntries = window.dataLayer.filter(
      (row) => Array.isArray(row) && row[0] === "config",
    );
    assert.equal(configEntries.length, 1, "exactly one config call queued");
    assert.equal(configEntries[0][2]?.send_page_view, false);
  });
});