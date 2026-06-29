export function formatKickoffLocal(utcDateString: string): string {
  if (!utcDateString) return '';
  try {
    const date = new Date(utcDateString);
    return new Intl.DateTimeFormat(undefined, {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZoneName: 'short',
    }).format(date);
  } catch {
    return utcDateString;
  }
}

export function formatKickoffLocalTime(utcDateString: string): string {
  if (!utcDateString) return '';
  try {
    return new Intl.DateTimeFormat(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date(utcDateString));
  } catch {
    return utcDateString;
  }
}