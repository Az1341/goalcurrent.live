/** Remote hosts allowed for Next.js Image optimization (CDN-transformed). */
export const REMOTE_IMAGE_HOSTNAMES = [
  "media.api-sports.io",
  "i.ytimg.com",
  "img.youtube.com",
  "ichef.bbci.co.uk",
  "live-production.wcms.afd.news.bbc.co.uk",
  "a.espncdn.com",
  "a1.espncdn.com",
  "a2.espncdn.com",
  "a3.espncdn.com",
  "a4.espncdn.com",
  "i.guim.co.uk",
] as const;

export function isLocalImageSrc(src: string): boolean {
  return src.startsWith("/");
}

/** Decode HTML entities in remote image URLs (Guardian RSS uses &amp; in query strings). */
export function sanitizeRemoteImageUrl(src: string): string {
  return src
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export function isSvgSrc(src: string): boolean {
  return src.split("?")[0]?.toLowerCase().endsWith(".svg") ?? false;
}

export function isOptimizableRemoteSrc(src: string): boolean {
  if (isLocalImageSrc(src)) {
    return !isSvgSrc(src);
  }

  try {
    const { hostname } = new URL(src);
    return (REMOTE_IMAGE_HOSTNAMES as readonly string[]).includes(hostname);
  } catch {
    return false;
  }
}

export function shouldUseUnoptimizedImage(src: string): boolean {
  if (isSvgSrc(src)) {
    return true;
  }

  if (isLocalImageSrc(src)) {
    return false;
  }

  return !isOptimizableRemoteSrc(src);
}

/** Append an SVG-specific class when `src` is local SVG card/banner art. */
export function withSvgMediaClass(
  src: string | null | undefined,
  baseClass: string,
  svgClass: string,
): string {
  return src && isSvgSrc(src) ? `${baseClass} ${svgClass}` : baseClass;
}
