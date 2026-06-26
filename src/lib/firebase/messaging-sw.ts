import { getFirebaseWebConfig } from "@/lib/firebase/config";

const FIREBASE_SW_VERSION = "11.10.0";

export function buildFirebaseMessagingServiceWorker(): string {
  const config = getFirebaseWebConfig();
  if (!config) {
    return "// Firebase is not configured\n";
  }

  const { vapidKey: _vapidKey, ...appConfig } = config;

  return `/* GoalCurrent.live — Firebase Cloud Messaging service worker */
importScripts("https://www.gstatic.com/firebasejs/${FIREBASE_SW_VERSION}/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/${FIREBASE_SW_VERSION}/firebase-messaging-compat.js");

firebase.initializeApp(${JSON.stringify(appConfig)});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || payload.data?.title || "GoalCurrent";
  const options = {
    body: payload.notification?.body || payload.data?.body || "",
    icon: payload.notification?.icon || "/icons/icon-192.png",
    badge: "/icons/icon-96.png",
    data: payload.data || {},
    tag: payload.data?.tag || "goalcurrent-live",
  };
  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = event.notification.data?.url || event.notification.data?.link || "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if ("focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(target);
      }
      return undefined;
    }),
  );
});
`;
}
