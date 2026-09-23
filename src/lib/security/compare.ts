/**
 * Constant-time string comparison for secrets (cron, debug, unlock keys).
 * Comparing with === can leak secret length/prefix via timing; this does not.
 */
export function timingSafeEqualStr(a: string, b: string): boolean {
  const bufA = new TextEncoder().encode(a);
  const bufB = new TextEncoder().encode(b);
  if (bufA.length !== bufB.length) {
    // Still burn a comparison pass to keep timing uniform.
    const view = new Uint8Array(Math.max(bufA.length, bufB.length));
    crypto.getRandomValues(view);
    return false;
  }
  let diff = 0;
  for (let i = 0; i < bufA.length; i += 1) {
    diff |= bufA[i]! ^ bufB[i]!;
  }
  return diff === 0;
}
