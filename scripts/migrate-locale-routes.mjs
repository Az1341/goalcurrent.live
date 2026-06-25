import { mkdirSync, renameSync, readdirSync } from "node:fs";
import { join } from "node:path";

const app = join(process.cwd(), "src", "app");
const dest = join(app, "[locale]");
const keep = new Set([
  "api",
  "[locale]",
  "layout.tsx",
  "globals.css",
  "robots.ts",
  "sitemap.ts",
  "sitemap-news.ts",
  "global-error.tsx",
  "sitemap-news.xml",
]);

mkdirSync(dest, { recursive: true });

for (const name of readdirSync(app)) {
  if (keep.has(name)) continue;
  const from = join(app, name);
  const to = join(dest, name);
  renameSync(from, to);
  console.log(`Moved ${name}`);
}

console.log("Route migration complete.");
