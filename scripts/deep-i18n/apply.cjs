const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..", "messages");
const DIR = __dirname;

function merge(into, patch) {
  for (const [key, value] of Object.entries(patch)) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      into[key] &&
      typeof into[key] === "object"
    ) {
      merge(into[key], value);
    } else {
      into[key] = value;
    }
  }
}

for (const file of fs.readdirSync(DIR)) {
  if (!file.endsWith(".json") || file === "package.json") continue;
  const locale = file.replace(".json", "");
  const patch = JSON.parse(fs.readFileSync(path.join(DIR, file), "utf8"));
  const target = path.join(ROOT, `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(target, "utf8"));
  merge(data, patch);
  fs.writeFileSync(target, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log("patched", locale);
}