export const fetcher = (url: string) =>
  fetch(url).then((res) => res.json());

export const LIVE_SWR_OPTIONS = {
  refreshInterval: 30_000,
  dedupingInterval: 30_000,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
} as const;
