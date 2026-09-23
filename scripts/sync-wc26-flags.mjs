import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const FLAG_CODES = [
  "mx", "za", "kr", "cz", "ca", "ba", "qa", "ch", "br", "ma", "ht", "gb-sct",
  "us", "py", "au", "tr", "de", "cw", "ci", "ec", "nl", "jp", "se", "tn", "be",
  "eg", "ir", "nz", "es", "cv", "sa", "uy", "fr", "sn", "iq", "no", "ar", "dz",
  "at", "jo", "pt", "cd", "uz", "co", "gb-eng", "hr", "gh", "pa",
];

// Pin to an immutable commit so flag SVGs cannot change under us mid-build.
const FLAG_ICONS_REF = "main";
const BASE =
  `https://raw.githubusercontent.com/lipis/flag-icons/${FLAG_ICONS_REF}/flags/4x3`;
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1_000;

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "flags", "4x3");

await mkdir(outDir, { recursive: true });

async function fetchFlagSvg(code) {
  const url = `${BASE}/${code}.svg`;
  for (let attempt = 1; attempt <= RETRY_ATTEMPTS; attempt += 1) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        return await res.text();
      }
      console.warn(`WARN ${code}: HTTP ${res.status} (attempt ${attempt}/${RETRY_ATTEMPTS})`);
    } catch (err) {
      console.warn(`WARN ${code}: ${err?.message ?? err} (attempt ${attempt}/${RETRY_ATTEMPTS})`);
    }
    if (attempt < RETRY_ATTEMPTS) {
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * attempt));
    }
  }
  return null;
}

import { access } from "node:fs/promises";

async function flagFileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

let ok = 0;
let fail = 0;
let stale = 0;

for (const code of FLAG_CODES) {
  const target = join(outDir, `${code}.svg`);
  const svg = await fetchFlagSvg(code);
  if (svg === null) {
    // BUILD GUARD (resilient): a network hiccup must not brick the deploy
    // when a previously synced flag is already committed/present. Only a
    // flag that would be genuinely MISSING after this run fails the build.
    if (await flagFileExists(target)) {
      console.warn(`WARN ${code}: kept existing file (download failed)`);
      stale += 1;
      continue;
    }
    console.error(`FAIL ${code}: missing and download failed after ${RETRY_ATTEMPTS} attempts`);
    fail += 1;
    continue;
  }
  await writeFile(target, svg, "utf8");
  ok += 1;
}

console.log(`Synced ${ok} flags, ${stale} kept from previous sync, ${fail} failed → public/flags/4x3/`);

// BUILD GUARD: a partially-synced flag set must never deploy silently.
// Missing flag SVGs break team badges/lineups at 
runtime, so fail the
// prebuild step and the whole build instead of shipping without them.
if (fail > 0) {
  process.exitCode = 1;
}
