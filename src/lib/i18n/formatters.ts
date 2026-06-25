type TranslateFn = (
  key: string,
  values?: Record<string, string | number>,
) => string;

export function formatMatchTitle(
  home: string,
  away: string,
  t: TranslateFn,
): string {
  return t("title", { home, away });
}

export function formatGroupLabel(id: string, t: TranslateFn): string {
  return t("group", { id: id.toUpperCase() });
}
