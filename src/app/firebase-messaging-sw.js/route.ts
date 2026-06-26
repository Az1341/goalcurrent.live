import { buildFirebaseMessagingServiceWorker } from "@/lib/firebase/messaging-sw";
import { isFirebaseMessagingConfigured } from "@/lib/firebase/config";

export const runtime = "nodejs";

export function GET() {
  if (!isFirebaseMessagingConfigured()) {
    return new Response("// Firebase messaging is not configured\n", {
      status: 404,
      headers: {
        "Content-Type": "application/javascript; charset=utf-8",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  }

  return new Response(buildFirebaseMessagingServiceWorker(), {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Service-Worker-Allowed": "/",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}
