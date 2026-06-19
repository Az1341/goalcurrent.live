// GoalCurrent.online — Service Worker (staging PWA foundation)
const CACHE_NAME = "goalcurrent-online-v1";
const API_CACHE = "goalcurrent-online-api-v1";

const STATIC_ASSETS = [
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/apple-touch-icon.png",
  "/logo.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(
        STATIC_ASSETS.map((url) =>
          cache.add(url).catch(() => {
            /* optional asset */
          }),
        ),
      ),
    ),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== API_CACHE)
          .map((name) => caches.delete(name)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (event.request.method !== "GET") return;
  if (url.origin !== location.origin) return;

  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirstWithTimeout(event.request, 5000));
    return;
  }

  const accept = event.request.headers.get("accept") || "";
  if (accept.includes("text/html")) {
    event.respondWith(networkFirstHTML(event.request));
    return;
  }

  if (url.pathname.startsWith("/_next/")) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  event.respondWith(cacheFirst(event.request));
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response("Offline — asset not cached", { status: 503 });
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response("Offline", { status: 503 });
  }
}

async function networkFirstHTML(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response(
      `<!DOCTYPE html>
      <html lang="en">
      <head><meta charset="UTF-8"><title>GoalCurrent — Offline</title>
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <meta name="theme-color" content="#5c0a1a">
      <style>
        body{margin:0;background:#5c0a1a;color:#fff;font-family:sans-serif;
          display:flex;flex-direction:column;align-items:center;
          justify-content:center;min-height:100vh;text-align:center;padding:20px}
        h1{color:#f5c6ce;font-size:2rem}
        p{color:#f0d4d8;max-width:300px}
        a{color:#f5c6ce;text-decoration:none;margin-top:20px;display:inline-block}
      </style></head>
      <body>
        <h1>GoalCurrent</h1>
        <p>You are offline. Check your connection to see live World Cup scores.</p>
        <a href="/">Try again</a>
      </body></html>`,
      { status: 200, headers: { "Content-Type": "text/html" } },
    );
  }
}

async function networkFirstWithTimeout(request, timeout) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(request, { signal: controller.signal });
    clearTimeout(timer);
    if (response.ok) {
      const cache = await caches.open(API_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request, { cacheName: API_CACHE });
    if (cached) return cached;
    return new Response(JSON.stringify({ error: "offline" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }
}
