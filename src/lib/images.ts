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
] as const;

export function isLocalImageSrc(src: string): boolean {
  return src.startsWith("/");
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
