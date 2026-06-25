const fs = require("fs");
const path = require("path");

const dir = path.join(process.cwd(), "messages");

function collectKeys(obj, prefix = "") {
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
    return prefix ? [prefix] : [];
  }
  return Object.entries(obj).flatMap(([key, value]) =>
    collectKeys(value, prefix ? `${prefix}.${key}` : key),
  );
}

const en = JSON.parse(fs.readFileSync(path.join(dir, "en.json"), "utf8"));
const enKeys = new Set(collectKeys(en));
let failed = false;

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".json") && f !== "en.json")) {
  const data = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
  const localeKeys = new Set(collectKeys(data));
  for (const key of enKeys) {
    if (!localeKeys.has(key)) {
      console.error(`${file} missing key: ${key}`);
      failed = true;
    }
  }
}

if (failed) {
  process.exit(1);
}

console.log("Message key parity OK");
