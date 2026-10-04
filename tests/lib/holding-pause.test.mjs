import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { execFileSync } from "node:child_process";
const config = JSON.parse(await readFile("vercel.json", "utf8"));
test("pause deployment cannot build Next or schedule paid provider work", () => {
  assert.equal(config.framework, null);
  assert.equal(config.buildCommand, "node scripts/build-holding.mjs");
  assert.equal(config.installCommand, "node --version");
  assert.equal(config.outputDirectory, "holding-dist");
  assert.deepEqual(config.crons, []);
});
test("pause build preserves accessible copy and restricts indexing to the homepage", async () => {
  execFileSync(process.execPath, ["scripts/build-holding.mjs"]);
  const html = await readFile("holding-dist/index.html", "utf8");
  assert.match(html, /GoalCurrent is<br class="desktop-break"> taking a short break\./);
  assert.match(html, /We’ve paused our live football service while we prepare the next chapter of GoalCurrent\./);
  assert.match(html, /Thank you for visiting\. We look forward to welcoming you back\./);
  assert.match(html, /canonical.*https:\/\/goalcurrent.live\//);
  assert.doesNotMatch(html, /SportsEvent|SearchAction|noindex|googletagmanager|api-football/);
  const sitemap = await readFile("holding-dist/sitemap.xml", "utf8");
  assert.equal((sitemap.match(/<loc>/g) || []).length, 1);
  assert.match(await readFile("holding-dist/404.html", "utf8"), /name="robots" content="noindex"/);
  assert.doesNotMatch(await readFile("holding-dist/robots.txt", "utf8"), /Disallow: \/$/m);
});
test("output has no server functions, PWA manifest or provider-loading workers", async () => {
  const files = await readdir("holding-dist");
  assert.ok(!files.includes("manifest.json"));
  assert.ok(!files.includes("api"));
  assert.ok(!files.includes(".next"));
  assert.ok(!files.includes("package.json"));
  assert.ok(!files.includes("tests"));
  assert.ok(!files.includes("playwright.config.mjs"));
  for (const name of ["sw.js", "firebase-messaging-sw.js", "OneSignalSDKWorker.js", "OneSignalSDKUpdaterWorker.js"]) {
    const worker = await readFile(`holding-dist/${name}`, "utf8");
    assert.doesNotMatch(worker, /importScripts|fetch\(|["']push["']/);
    assert.match(worker, /registration.unregister/);
    assert.match(worker, /goalcurrent-online-/);
  }
});
test("paid API paths are paused before filesystem handling and old HTML paths return 404", () => {
  const apiIndex = config.routes.findIndex((route) => route.src === "/api(?:/.*)?");
  assert.ok(apiIndex > -1);
  assert.ok(apiIndex < config.routes.findIndex((route) => route.handle === "filesystem"));
  assert.equal(config.routes[apiIndex].status, 503);
  assert.equal(config.routes.at(-1).status, 404);
  assert.equal(config.routes.at(-1).dest, "/404.html");
});
test("hero and bundled fonts stay within a modest static page budget", async () => {
  assert.ok((await stat("holding/assets/stadium.webp")).size < 350000);
  assert.ok((await stat("holding/assets/heading.woff2")).size < 100000);
  assert.ok((await stat("holding/assets/body.woff2")).size < 150000);
});
