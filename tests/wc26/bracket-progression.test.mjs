import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

test("confirmed knockout results include Morocco penalty win for match 76", () => {
  const raw = readFileSync(
    join(root, "src/lib/wc26/knockout-confirmed-results.ts"),
    "utf8",
  );
  assert.match(raw, /matchNumber:\s*76[\s\S]*winnerTeamId:\s*"mar"/);
  assert.match(raw, /penaltiesHome:\s*2[\s\S]*penaltiesAway:\s*3/);
  assert.match(raw, /applyConfirmedKnockoutResults/);
  assert.match(raw, /matchNumber:\s*79[\s\S]*winnerTeamId:\s*"mex"/);
  assert.match(raw, /matchNumber:\s*79[\s\S]*homeScore:\s*2[\s\S]*awayScore:\s*0/);
});

test("fixture overlay merges confirmed results after API overlay", () => {
  const raw = readFileSync(
    join(root, "src/lib/wc26-fixture-overlay.ts"),
    "utf8",
  );
  assert.match(raw, /applyAllConfirmedResults\(merged\)/);
});

test("group confirmed results hardcode all 72 group-stage scores", () => {
  const raw = readFileSync(
    join(root, "src/lib/wc26/group-confirmed-results.ts"),
    "utf8",
  );
  assert.match(raw, /WC26_CONFIRMED_GROUP_RESULTS/);
  assert.match(raw, /matchNumber: 72/);
  assert.match(raw, /isWc26GroupStageComplete/);
});

test("confirmed results unify group and knockout overlays", () => {
  const raw = readFileSync(
    join(root, "src/lib/wc26/confirmed-results.ts"),
    "utf8",
  );
  assert.match(raw, /applyConfirmedGroupResults/);
  assert.match(raw, /applyConfirmedKnockoutResults/);
  assert.match(raw, /buildConfirmedStaticApiMatches/);
});

test("standings resolves penalty shootout winners on tied scores", () => {
  const raw = readFileSync(join(root, "src/lib/wc26-standings.ts"), "utf8");
  assert.match(raw, /resolvePenaltyShootoutWinner/);
  assert.match(raw, /getConfirmedKnockoutWinner/);
});

test("bracket mapSide prefers standings team ids over fixture participant", () => {
  const raw = readFileSync(join(root, "src/lib/wc26/bracket-view.ts"), "utf8");
  assert.match(raw, /standingsTeamId/);
  assert.match(raw, /penaltiesForMatch/);
  assert.match(raw, /venueLabel/);
});

test("bracket cards show venue match number penalties and compact header", () => {
  const raw = readFileSync(
    join(root, "src/components/wc26/bracket/BracketMatchNode.tsx"),
    "utf8",
  );
  assert.match(raw, /venueLabel/);
  assert.match(raw, /penaltiesLine/);
  assert.match(raw, /M\{match\.matchNumber\}/);
});

test("bracket viewport always uses horizontal scroll rail", () => {
  const fitRaw = readFileSync(
    join(root, "src/components/wc26/bracket/BracketFitViewport.tsx"),
    "utf8",
  );
  const cssRaw = readFileSync(
    join(root, "src/components/wc26/bracket/BracketView.module.css"),
    "utf8",
  );
  const pageRaw = readFileSync(
    join(root, "src/components/wc26/bracket/bracket.module.css"),
    "utf8",
  );
  assert.match(fitRaw, /scrollRail/);
  assert.match(fitRaw, /scrollAffordance/);
  assert.doesNotMatch(fitRaw, /FIT_SCALE_MIN/);
  assert.doesNotMatch(fitRaw, /layout === "fit"/);
  assert.match(cssRaw, /overflow-x:\s*scroll/);
  assert.match(cssRaw, /overscroll-behavior-x:\s*contain/);
  assert.match(pageRaw, /overflow-x:\s*hidden/);
});

test("bracket layout uses wider columns and row height", () => {
  const raw = readFileSync(
    join(root, "src/components/wc26/bracket/BracketView.tsx"),
    "utf8",
  );
  assert.match(raw, /COLUMN_WIDTH = 168/);
  assert.match(raw, /ROW_HEIGHT = 108/);
});

test("resolveBracketMatch uses confirmed pairings for known R32 slots", () => {
  const raw = readFileSync(join(root, "src/lib/wc26-standings.ts"), "utf8");
  assert.match(raw, /getConfirmedKnockoutPairingByMatchNumber/);
  assert.match(raw, /sideFromConfirmedTeam/);
});

test("API football maps penalty shootout scores into overlay", () => {
  const raw = readFileSync(
    join(root, "src/lib/server/wc26-api-football.ts"),
    "utf8",
  );
  assert.match(raw, /penaltiesHome/);
  assert.match(raw, /score\?\.penalty/);
  assert.match(raw, /homeTeamId && awayTeamId[\s\S]*findFixtureIdByKickoffUtc/);
});

test("confirmed knockout results include R32 matches 83 through 88", () => {
  const raw = readFileSync(
    join(root, "src/lib/wc26/knockout-confirmed-results.ts"),
    "utf8",
  );
  assert.match(raw, /matchNumber:\s*83[\s\S]*winnerTeamId:\s*"por"/);
  assert.match(raw, /matchNumber:\s*88[\s\S]*winnerTeamId:\s*"egy"/);
  assert.match(raw, /matchNumber:\s*89[\s\S]*winnerTeamId:\s*"mar"/);
  assert.match(raw, /hasApiOverlay/);
  assert.match(raw, /hasApiTruth/);
});

test("knockout team pair map includes round-of-16 slots", () => {
  const raw = readFileSync(
    join(root, "src/lib/wc26-fixture-match.ts"),
    "utf8",
  );
  assert.match(raw, /"can\|mar":\s*"fixture-089"/);
  assert.match(raw, /"bra\|nor":\s*"fixture-091"/);
});

test("knockout confirmed pairings include round-of-16 slots", () => {
  const raw = readFileSync(
    join(root, "src/lib/wc26/knockout-confirmed-pairings.ts"),
    "utf8",
  );
  assert.match(raw, /fixtureId: "fixture-089"[\s\S]*homeTeamId: "can"[\s\S]*awayTeamId: "mar"/);
  assert.match(raw, /fixtureId: "fixture-091"[\s\S]*homeTeamId: "bra"[\s\S]*awayTeamId: "nor"/);
  assert.match(raw, /fixtureId: "fixture-090"[\s\S]*homeTeamId: "par"/);
});