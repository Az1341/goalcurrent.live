// Retire only known GoalCurrent workers; never register a new worker or call a provider.
const paths = new Set(["/sw.js", "/firebase-messaging-sw.js", "/OneSignalSDKWorker.js", "/OneSignalSDKUpdaterWorker.js"]);
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then(async (registrations) => {
    for (const registration of registrations) {
      const workers = [registration.active, registration.waiting, registration.installing].filter(Boolean);
      if (!workers.some((worker) => paths.has(new URL(worker.scriptURL).pathname))) continue;
      try { await registration.update(); } catch { /* A retired worker may already be gone. */ }
      await registration.unregister();
    }
  }).catch(() => { /* Page remains usable without worker access. */ });
}
