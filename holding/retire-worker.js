// Replaces previously installed workers at their original paths. No fetch/push handlers.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    for (const name of await caches.keys()) {
      if (name.startsWith("goalcurrent-online-")) await caches.delete(name);
    }
    await self.clients.claim();
    await self.registration.unregister();
    const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    await Promise.allSettled(clients.map((client) => client.navigate("/")));
  })());
});
