import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
const root = new URL("../", import.meta.url);
const output = new URL("holding-dist/", root);
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(new URL("holding/assets/", root), new URL("assets/", output), { recursive: true });
for (const filename of ["index.html", "holding.css", "pause.js", "retire-worker.js", "robots.txt", "sitemap.xml", "paused-api.json", "favicon.ico"]) {
  await cp(new URL(`holding/${filename}`, root), new URL(filename, output));
}
await cp(new URL("public/logo.svg", root), new URL("logo.svg", output));
const html = await readFile(new URL("index.html", output), "utf8");
await writeFile(new URL("404.html", output), html.replace('<link rel="canonical" href="https://goalcurrent.live/">', '<meta name="robots" content="noindex">'));
for (const filename of ["sw.js", "firebase-messaging-sw.js", "OneSignalSDKWorker.js", "OneSignalSDKUpdaterWorker.js"]) {
  await cp(new URL("retire-worker.js", output), new URL(filename, output));
}
console.log(`Static holding page built: ${fileURLToPath(output)} (no functions or provider calls)`);
