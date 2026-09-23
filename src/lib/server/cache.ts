/**
 * Best-effort client IP for rate limiting.
 *
 * SECURITY: never trust the FIRST x-forwarded-for entry — it is fully
 * client-controlled, so an attacker could rotate fake values to get a
 * fresh rate-limit bucket on every request. Prefer the platform-set
 * x-real-ip (Vercel sets it to the actual connecting client) and
 * otherwise take the LAST x-forwarded-for hop, which is the entry
 * appended by the closest trusted proxy.
 */
export function clientIpFromRequest(request: Request): string {
  const realIp = request.headers.get("x-real-ip");
  if (realIp?.trim()) {
    return realIp.trim();
  }

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const hops = forwarded.split(",").map((h) => h.trim()).filter(Boolean);
    const lastHop = hops[hops.length - 1];
    if (lastHop) {
      return lastHop;
    }
  }

  return "unknown";
}
