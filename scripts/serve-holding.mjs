// Local test/preview server only. Production serves static output through Vercel.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
const args = process.argv.slice(2);
const option = (name, fallback) => args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
const output = resolve(option("--output", resolve(root, "holding-dist")));
const config = JSON.parse(await readFile(resolve(option("--config", resolve(root, "vercel.json"))), "utf8"));
const port = Number(option("--port", 4173));
const host = option("--host", "127.0.0.1");
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "application/javascript", ".json": "application/json", ".xml": "application/xml", ".txt": "text/plain", ".svg": "image/svg+xml", ".ico": "image/x-icon", ".woff2": "font/woff2", ".webp": "image/webp" };
async function existing(pathname) {
  const path = resolve(output, `.${pathname === "/" ? "/index.html" : pathname}`);
  if (path !== output && !path.startsWith(output + sep)) return null;
  try { return (await stat(path)).isFile() ? path : null; } catch { return null; }
}
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    let pathname;
    try { pathname = decodeURIComponent(url.pathname); } catch { res.writeHead(400).end(); return; }
    let path = null;
    let status = 200;
    for (const route of config.routes) {
      if (route.handle === "filesystem") {
        path = await existing(pathname);
        if (path) break;
        continue;
      }
      const match = pathname.match(new RegExp(`^${route.src}$`));
      if (!match) continue;
      if (route.has && !route.has.every((item) => item.type === "host" && url.hostname === item.value)) continue;
      for (const [key, value] of Object.entries(route.headers || {})) {
        res.setHeader(key, value.replace(/\$(\d+)/g, (_, index) => match[Number(index)] || ""));
      }
      if (route.continue) continue;
      status = route.status || 200;
      if (status >= 300 && status < 400) { res.writeHead(status).end(); return; }
      path = await existing(route.dest || pathname);
      break;
    }
    if (!path) { res.writeHead(404).end(); return; }
    if (!res.hasHeader("Content-Type")) {
      const extension = path.slice(path.lastIndexOf("."));
      res.setHeader("Content-Type", types[extension] || "application/octet-stream");
    }
    const body = await readFile(path);
    res.setHeader("Content-Length", body.byteLength);
    res.writeHead(status).end(req.method === "HEAD" ? undefined : body);
  } catch { res.writeHead(500).end(); }
});
server.listen(port, host, () => console.log(`Holding preview ready on port ${port}`));
server.on("error", (error) => { console.error(error.message); process.exit(1); });
