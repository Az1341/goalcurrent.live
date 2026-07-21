import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

const {
  DESKTOP_CORE_NAV,
  DESKTOP_SECONDARY_NAV,
  DESKTOP_PRIMARY_NAV,
  MOBILE_BOTTOM_TABS,
  EPL_HUB_HREF,
  WC26_HUB_HREF,
} = await import("@/lib/nav");

test("canonical EPL and WC26 hub routes exist as app pages", () => {
  assert.equal(EPL_HUB_HREF, "/premier-league");
  assert.equal(WC26_HUB_HREF, "/worldcup2026");
  assert.ok(
    readFileSync(join(root, "src/app/[locale]/premier-league/page.tsx"), "utf8").length > 0,
  );
  assert.ok(
    readFileSync(join(root, "src/app/[locale]/worldcup2026/page.tsx"), "utf8").length > 0,
  );
});

test("desktop nav order is Home Live EPL WC26 then editorial", () => {
  assert.deepEqual(
    DESKTOP_CORE_NAV.map((item) => item.labelKey),
    ["home", "live", "epl", "wc26"],
  );
  assert.deepEqual(
    DESKTOP_SECONDARY_NAV.map((item) => item.labelKey),
    ["favourites", "news", "articles", "videos"],
  );
  assert.deepEqual(
    DESKTOP_PRIMARY_NAV.map((item) => item.href),
    [
      "/",
      "/live",
      "/premier-league",
      "/worldcup2026",
      "/favourites",
      "/news",
      "/articles",
      "/videos",
    ],
  );
});

test("mobile bottom tabs restore PL and WC26", () => {
  const ids = MOBILE_BOTTOM_TABS.map((tab) => tab.id);
  assert.ok(ids.includes("pl"));
  assert.ok(ids.includes("wc26"));
  assert.equal(
    MOBILE_BOTTOM_TABS.find((tab) => tab.id === "wc26")?.href,
    "/worldcup2026",
  );
  assert.equal(
    MOBILE_BOTTOM_TABS.find((tab) => tab.id === "pl")?.href,
    "/premier-league",
  );
});

test("ticker and champion popup remain disabled in archive era", () => {
  const ribbon = readFileSync(
    join(root, "src/components/layout/LiveRibbon.tsx"),
    "utf8",
  );
  const celebration = readFileSync(
    join(root, "src/components/wc26/FinalWinnerCelebration.tsx"),
    "utf8",
  );
  const home = readFileSync(
    join(root, "src/app/[locale]/HomeClient.tsx"),
    "utf8",
  );
  const header = readFileSync(
    join(root, "src/components/layout/MasterHeader.tsx"),
    "utf8",
  );
  assert.match(ribbon, /isWc26TournamentComplete/);
  assert.match(ribbon, /return null/);
  assert.match(celebration, /archiveComplete/);
  assert.match(celebration, /return null/);
  assert.doesNotMatch(celebration, /role=\"dialog\"/);
  assert.doesNotMatch(home, /LiveRibbon/);
  assert.doesNotMatch(header, /LiveRibbon/);
});