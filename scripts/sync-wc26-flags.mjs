import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const FLAG_CODES = [
  "mx", "za", "kr", "cz", "ca", "ba", "qa", "ch", "br", "ma", "ht", "gb-sct",
  "us", "py", "au", "tr", "de", "cw", "ci", "ec", "nl", "jp", "se", "tn", "be",
  "eg", "ir", "nz", "es", "cv", "sa", "uy", "fr", "sn", "iq", "no", "ar", "dz",
  "at", "jo", "pt", "cd", "uz", "co", "gb-eng", "hr", "gh", "pa",
];

const BASE =
  "https://raw.githubusercontent.com/lipis/flag-icons/main/flags/4x3";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "flags", "4x3");

await mkdir(outDir, { recursive: true });

let ok = 0;
let fail = 0;

for (const code of FLAG_CODES) {
  const url = `${BASE}/${code}.svg`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`FAIL ${code}: ${res.status}`);
    fail += 1;
    continue;
  }
  const svg = await res.text();
  await writeFile(join(outDir, `${code}.svg`), svg, "utf8");
  ok += 1;
}

console.log(`Synced ${ok} flags, ${fail} failed → public/flags/4x3/`);
