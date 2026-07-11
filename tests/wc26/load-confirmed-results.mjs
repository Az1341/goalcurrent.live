import { readFileSync } from "node:fs";
import { join } from "node:path";

/** Load WC26 confirmed results SSOT JSON for structural tests. */
export function loadConfirmedResults(root) {
  return JSON.parse(
    readFileSync(join(root, "src/data/wc26-confirmed-results.json"), "utf8"),
  );
}

export function findKnockoutPairing(data, fixtureId) {
  return data.knockoutPairings.find((entry) => entry.fixtureId === fixtureId);
}

export function findKnockoutResult(data, matchNumber) {
  return data.knockoutResults.find((entry) => entry.matchNumber === matchNumber);
}