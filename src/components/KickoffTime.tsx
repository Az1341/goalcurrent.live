'use client';

import { useSyncExternalStore } from 'react';
import {
  formatKickoffLocal,
  formatKickoffLocalTime,
} from '@/lib/formatKickoffLocal';

const noopSubscribe = () => () => {};

export function KickoffTime({
  utcDate,
  variant = 'full',
}: {
  utcDate: string;
  variant?: 'full' | 'time';
}) {
  const display = useSyncExternalStore(
    noopSubscribe,
    () =>
      variant === 'time'
        ? formatKickoffLocalTime(utcDate)
        : formatKickoffLocal(utcDate),
    () => '',
  );

  return <span suppressHydrationWarning>{display}</span>;
}
