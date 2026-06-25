const fs = require("fs");
const path = require("path");
const root = process.cwd();
const REQUIRED_PUBLIC = [
  "public/logo.svg",
  "public/favicon.ico",
  "public/images/football-hero-bg.jpg",
  "public/images/google-play-badge.png",
  "public/images/hero-home.png",
  "public/flags/4x3/br.svg",
  "public/flags/4x3/gb-eng.svg",
  "public/icons/icon-192.png",
];
const REQUIRED_SOURCE_SNIPPETS = [
  { file: "src/lib/critical-assets.ts", mustInclude: '"/images/football-hero-bg.jpg"', mustNotInclude: "null as string" },
  { file: "src/lib/article-hub.ts", mustInclude: "getArticleCardImage" },
  { file: "src/lib/teamFlag.ts", mustInclude: "/flags/4x3" },
  { file: "src/components/layout/MasterHeader.tsx", mustInclude: "/logo.svg" },
  { file: "src/lib/site-keys.ts", mustInclude: "/images/google-play-badge.png" },
  { file: "src/components/layout/GooglePlayBadge.tsx", mustInclude: "GOOGLE_PLAY_BADGE_SRC" },
];
let failed = false;
for (const rel of REQUIRED_PUBLIC) {
  if (!fs.existsSync(path.join(root, rel))) {
    console.error(`verify:design missing public asset: ${rel}`);
    failed = true;
  }
}
for (const rule of REQUIRED_SOURCE_SNIPPETS) {
  const text = fs.readFileSync(path.join(root, rule.file), "utf8");
  if (rule.mustInclude && !text.includes(rule.mustInclude)) {
    console.error(`verify:design ${rule.file} must include: ${rule.mustInclude}`);
    failed = true;
  }
  if (rule.mustNotInclude && text.includes(rule.mustNotInclude)) {
    console.error(`verify:design ${rule.file} must not include: ${rule.mustNotInclude}`);
    failed = true;
  }
}
if (failed) process.exit(1);
console.log("verify:design OK");
