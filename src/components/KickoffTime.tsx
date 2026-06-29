'use client';
import { useState, useEffect } from 'react';
import { formatKickoffLocal, formatKickoffLocalTime } from '@/lib/formatKickoffLocal';

export function KickoffTime({ utcDate, variant = 'full' }: { utcDate: string; variant?: 'full' | 'time' }) {
  const [display, setDisplay] = useState('');
  useEffect(() => {
    setDisplay(variant === 'time' ? formatKickoffLocalTime(utcDate) : formatKickoffLocal(utcDate));
  }, [utcDate, variant]);
  return <span suppressHydrationWarning>{display}</span>;
}