/**
 * Broadcaster information by country code
 */
export type Broadcaster = {
  name: string;
  channels: string[];
};

export const BROADCASTERS: Record<string, Broadcaster> = {
  GB: {
    name: "UK",
    channels: ["BBC", "ITV"],
  },
  US: {
    name: "USA",
    channels: ["FOX", "Telemundo"],
  },
  CA: {
    name: "Canada",
    channels: ["TSN", "CTV"],
  },
  AU: {
    name: "Australia",
    channels: ["SBS", "Optus"],
  },
  DE: {
    name: "Germany",
    channels: ["ARD", "ZDF"],
  },
  FR: {
    name: "France",
    channels: ["TF1", "M6"],
  },
  ES: {
    name: "Spain",
    channels: ["Mediapro", "Telecinco"],
  },
  IT: {
    name: "Italy",
    channels: ["RAI", "Sky"],
  },
  BR: {
    name: "Brazil",
    channels: ["Globo", "SporTV"],
  },
  AR: {
    name: "Argentina",
    channels: ["TyC Sports", "Telefe"],
  },
  MX: {
    name: "Mexico",
    channels: ["Televisa", "Azteca"],
  },
  JP: {
    name: "Japan",
    channels: ["NHK", "Abema"],
  },
  KR: {
    name: "South Korea",
    channels: ["KBS", "MBC"],
  },
  CN: {
    name: "China",
    channels: ["CCTV", "iQIYI"],
  },
  IN: {
    name: "India",
    channels: ["Sports18", "JioCinema"],
  },
};

/**
 * Get broadcaster information for a country code
 * @param countryCode - ISO 3166-1 alpha-2 country code
 * @returns Broadcaster information or null if not found
 */
export function getBroadcaster(countryCode: string): Broadcaster | null {
  const upperCode = countryCode.toUpperCase();
  return BROADCASTERS[upperCode] || null;
}

/**
 * Get broadcaster information from user's locale
 * @returns Broadcaster information or null if not found
 */
export function getBroadcasterFromLocale(): Broadcaster | null {
  const locale = navigator.language || 'en-US';
  const countryCode = locale.split('-')[1];
  if (!countryCode) return null;
  return getBroadcaster(countryCode);
}

/**
 * Get broadcaster display text
 * @param countryCode - ISO 3166-1 alpha-2 country code
 * @returns Display text for broadcaster
 */
export function getBroadcasterDisplay(countryCode: string): string {
  const broadcaster = getBroadcaster(countryCode);
  if (!broadcaster) {
    return "Local broadcaster information unavailable";
  }
  return `${broadcaster.name}: ${broadcaster.channels.join(' / ')}`;
}
