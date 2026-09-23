"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import {
  type CalendarCompetitionKey,
  type CalendarFixture,
  formatYearMonthLabel,
  localDateKey,
  normalizeFacupApiFixtures,
  normalizePlApiFixtures,
  normalizeUclApiFixtures,
  normalizeUnlApiFixtures,
  yearMonthKey,
} from "@/lib/fixtures/calendar-aggregate";
import { getUnlFlagSrc } from "@/lib/unl/flag";
import type { FacupFixturesApiResponse } from "@/lib/facup/types";
import type { PlFixturesApiResponse } from "@/lib/pl/types";
import type { UclFixturesApiResponse } from "@/lib/ucl/types";
import type { UnlFixturesApiResponse } from "@/lib/unl/types";
import styles from "./FixtureCalendar.module.css";

type FilterKey = "all" | CalendarCompetitionKey;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pl", label: "PL" },
  { key: "ucl", label: "UCL" },
  { key: "facup", label: "FA Cup" },
  { key: "unl", label: "UNL" },
];

const CENTER_MAX_RAF_RETRIES = 32;

function formatTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "TBC";
  return d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isoDayKey(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return y + "-" + m + "-" + day;
}

function formatDayChip(isoDay: string): string {
  const [y, m, d] = isoDay.split("-").map(Number);
  if (!y || !m || !d) return isoDay;
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
  });
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return (a
wait res.json()) as T;
  } catch {
    return null;
  }
}

function Flag({ code }: { code?: string | null }) {
  const src = getUnlFlagSrc(code ?? null);
  if (!src) return <span className={styles.flagFallback} aria-hidden />;
  return (
    <Image src={src} alt="" width={18} height={18} className={styles.flag} unoptimized />
  );
}

/**
 * Rect-based centring — offsetLeft is unreliable inside the scroll strip
 * because the chips' offsetParent sits outside it. Mirrors the proven
 * implementation in src/components/wc26/FixturesCalendar.tsx.
 */
function centerChipInStrip(
  container: HTMLDivElement,
  chip: HTMLElement,
  behavior: ScrollBehavior,
): boolean {
  if (container.clientWidth <= 0 || chip.offsetWidth <= 0) {
    return false;
  }
  const containerRect = container.getBoundingClientRect();
  const chipRect = chip.getBoundingClientRect();
  const delta =
    chipRect.left +
    chipRect.width / 2 -
    (containerRect.left + containerRect.width / 2);
  const maxScroll = Math.max(0, container.scrollWidth - container.clientWidth);
  container.scrollTo({
    left: Math.min(maxScroll, Math.max(0, container.scrollLeft + delta)),
    behavior,
  });
  return true;
}

export default function FixtureCalendarClient() {
  // No hardcoded months — derived from the device clock after mount so the
  // calendar always opens on (or nearest to) TODAY. Non-negotiable.
  const [month, setMonth] = useState("");
  const [selectedDay, setSelectedDay] = useState<string | "all">("all");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [fixtures, setFixtures] = useState<CalendarFixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [todayKey, setTodayKey] = useState("");

  const dayPickerRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<Map<string, HTMLElement>>(new Map());
  const initialCenterDone = useRef(false);

  // Hydration-safe "today": computed only on the client, refres
hed when the
  // tab regains visibility (handles the calendar rolling past midnight).
  useEffect(() => {
    const refreshToday = () => {
      setTodayKey(isoDayKey(new Date().toISOString()));
    };
    refreshToday();
    window.addEventListener("visibilitychange", refreshToday);
    return () => window.removeEventListener("visibilitychange", refreshToday);
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const [pl, ucl, facup, unl] = await Promise.all([
        fetchJson<PlFixturesApiResponse>("/api/pl/fixtures"),
        fetchJson<UclFixturesApiResponse>("/api/ucl/fixtures"),
        fetchJson<FacupFixturesApiResponse>("/api/facup/fixtures"),
        fetchJson<UnlFixturesApiResponse>("/api/unl/fixtures"),
      ]);

      if (cancelled) return;

      const next: CalendarFixture[] = [];
      if (pl?.fixtures) next.push(...normalizePlApiFixtures(pl.fixtures));
      if (ucl?.fixtures) next.push(...normalizeUclApiFixtures(ucl.fixtures));
      if (facup?.fixtures) next.push(...normalizeFacupApiFixtures(facup.fixtures));
      if (unl?.fixtures) next.push(...normalizeUnlApiFixtures(unl.fixtures));

      next.sort(
        (a, b) =>
          new Date(a.kickoffUtc).getTime() - new Date(b.kickoffUtc).getTime(),
      );

      setFixtures(next);
      setLoadError(next.length === 0 && !pl && !ucl && !facup && !unl);

      const now = new Date();
      const todayMonth = yearMonthKey(now);
      const todayDay = isoDayKey(now.toISOString());

      if (next.length > 0) {
        const months = [...new Set(
          next.map((row) => yearMonthKey(new Date(row.kickoffUtc))),
        )].sort();
        // Open on TODAY's month when it has fixtures; otherwise the nearest
        // future month; otherwise the first available month.
        const bestMonth =
          months.find((m) => m === todayMonth) ??
          months.find((m) => m > todayMonth) ??
          months[0]!;
        setMonth(bestMonth);

        // Pre-select toda
y when it has fixtures in the chosen month so the
        // list opens on the live matchday instead of dumping the month.
        const todayRow = next.find(
          (row) => isoDayKey(row.kickoffUtc) === todayDay,
        );
        const todayInMonth =
          todayRow !== undefined &&
          yearMonthKey(new Date(todayRow.kickoffUtc)) === bestMonth;
        setSelectedDay(todayInMonth ? todayDay : "all");
      } else {
        setMonth(todayMonth);
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const monthOptions = useMemo(() => {
    const set = new Set<string>();
    for (const row of fixtures) {
      if (filter !== "all" && row.competitionKey !== filter) continue;
      set.add(yearMonthKey(new Date(row.kickoffUtc)));
    }
    return [...set].sort();
  }, [fixtures, filter]);

  const activeMonth =
    monthOptions.length === 0
      ? month
      : monthOptions.includes(month)
        ? month
        : monthOptions[0];

  const filteredByComp = useMemo(() => {
    return fixtures.filter((row) => {
      if (filter !== "all" && row.competitionKey !== filter) return false;
      return yearMonthKey(new Date(row.kickoffUtc)) === activeMonth;
    });
  }, [fixtures, filter, activeMonth]);

  const daysInMonth = useMemo(() => {
    const set = new Set<string>();
    for (const row of filteredByComp) {
      const key = isoDayKey(row.kickoffUtc);
      if (key) set.add(key);
    }
    return [...set].sort();
  }, [filteredByComp]);

  const activeDay =
    selectedDay === "all" || daysInMonth.includes(selectedDay)
      ? selectedDay
      : "all";

  /** TODAY is centred whenever it is visible in the strip; otherwise the
   *  active day chip is. Zero tolerance for today being off-screen. */
  const centerTargetKey = useMemo(() => {
    if (todayKey && daysInMonth.includes(todayKey)) return todayKey;
    return activeDay === "all" ? "" : activeDay;
  }, [todayKey, daysInMonth, activeDay]);

  c
onst filtered = useMemo(() => {
    if (activeDay === "all") return filteredByComp;
    return filteredByComp.filter((row) => isoDayKey(row.kickoffUtc) === activeDay);
  }, [filteredByComp, activeDay]);

  const byDay = useMemo(() => {
    const map = new Map<string, CalendarFixture[]>();
    for (const row of filtered) {
      const key = localDateKey(row.kickoffUtc);
      const bucket = map.get(key) ?? [];
      bucket.push(row);
      map.set(key, bucket);
    }
    return [...map.entries()];
  }, [filtered]);

  const monthIndex = monthOptions.indexOf(activeMonth);

  function chooseMonth(ym: string) {
    setMonth(ym);
    setSelectedDay("all");
  }

  function chooseFilter(key: FilterKey) {
    setFilter(key);
    setSelectedDay("all");
  }

  function scrollChipIntoCenter(
    dateKey: string,
    behavior: ScrollBehavior,
  ): boolean {
    const container = dayPickerRef.current;
    const chip = chipRefs.current.get(dateKey);
    if (!container || !chip) return false;
    return centerChipInStrip(container, chip, behavior);
  }

  // Initial + follow-up centring. Late layout settles (web fonts,
  // hydration of surrounding sections) shift offsets after the first pass,
  // so re-centre on fonts.ready, window load, and container resize — the
  // same strategy as the WC26 fixtures calendar.
  useLayoutEffect(() => {
    if (!centerTargetKey) return;

    let cancelled = false;
    const behavior: ScrollBehavior = initialCenterDone.current
      ? "smooth"
      : "instant";

    const attempt = (retriesLeft: number) => {
      if (cancelled) return;
      if (scrollChipIntoCenter(centerTargetKey, behavior)) {
        initialCenterDone.current = true;
        return;
      }
      if (retriesLeft > 0) {
        requestAnimationFrame(() => attempt(retriesLeft - 1));
      }
    };

    attempt(CENTER_MAX_RAF_RETRIES);
    return () => {
      cancelled = true;
    };
  }, [centerTargetKey, daysInMonth.length]);

  useEffect(() => {
    if (!centerTargetKey) 
return;
    let cancelled = false;
    const recenter = () => {
      if (!cancelled) scrollChipIntoCenter(centerTargetKey, "instant");
    };
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(recenter).catch(() => {});
    }
    window.addEventListener("load", recenter, { once: true });
    const settleTimer = window.setTimeout(recenter, 600);
    const container = dayPickerRef.current;
    let observer: ResizeObserver | null = null;
    if (container) {
      observer = new ResizeObserver(() => recenter());
      observer.observe(container);
    }
    return () => {
      cancelled = true;
      window.removeEventListener("load", recenter);
      window.clearTimeout(settleTimer);
      observer?.disconnect();
    };
  }, [centerTargetKey]);

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Fixtures calendar</h1>
      <p className={styles.intro}>
        Premier League, Champions League, FA Cup, and Nations League 26/27 —
        pick a month and date. Times shown in your local timezone.
      </p>

      <div className={styles.toolbar}>
        <div className={styles.monthNav}>
          <button
            type="button"
            className={styles.monthBtn}
            disabled={monthIndex <= 0}
            onClick={() => {
              if (monthIndex > 0) chooseMonth(monthOptions[monthIndex - 1]);
            }}
          >
            Prev
          </button>
          <label className={styles.monthSelectWrap}>
            <span className={styles.srOnly}>Month</span>
            <select
              className={styles.monthSelect}
              value={activeMonth}
              onChange={(e) => chooseMonth(e.target.value)}
              aria-label="Select month"
            >
              {(monthOptions.length ? monthOptions : [activeMonth]).map((ym) => (
                <option key={ym} value={ym}>
                  {formatYearMonthLabel(ym)}
                </option>
        
      ))}
            </select>
          </label>
          <button
            type="button"
            className={styles.monthBtn}
            disabled={monthIndex < 0 || monthIndex >= monthOptions.length - 1}
            onClick={() => {
              if (monthIndex >= 0 && monthIndex < monthOptions.length - 1) {
                chooseMonth(monthOptions[monthIndex + 1]);
              }
            }}
          >
            Next
          </button>
        </div>

        <div className={styles.filters} role="group" aria-label="Competition filter">
          {FILTERS.map((item) => (
            <button
              key={item.key}
              type="button"
              className={styles.pill + " " + (filter === item.key ? styles.pillActive : "")}
              onClick={() => chooseFilter(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {daysInMonth.length > 0 ? (
        <div
          ref={dayPickerRef}
          className={styles.dayPicker}
          role="group"
          aria-label="Pick a date"
          onKeyDown={(e) => {
            if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
            const keys = ["all", ...daysInMonth];
            const current =
              (e.target instanceof HTMLElement && e.target.dataset.dayKey) ||
              activeDay;
            const index = keys.indexOf(current);
            if (index === -1) return;
            e.preventDefault();
            const delta = e.key === "ArrowRight" ? 1 : -1;
            const next = keys[index + delta];
            if (!next) return;
            setSelectedDay(next);
            chipRefs.current.get(next)?.focus();
          }}
        >
          <button
            type="button"
            data-day-key="all"
            ref={(node) => {
              if (node) {
                chipRefs.current.set("all", node);
              } else {
                chipRefs.current.delete("all");
              }
            }}
            className={styles.dayChip + " " + (activeDay === "all" ? styles.dayChipActive : "")}
            onClick={() => setSelectedDay("all")}
          >
            All dates
          </button>
          {daysInMonth.map((day) => {
            const isToday = todayKey !== "" && day === todayKey;
            const classes =
              styles.dayChip +
              " " +
              (activeDay === day ? styles.dayChipActive : "") +
              " " +
              (isToday ? styles.dayChipToday : "");
            return (
              <button
                key={day}
                type="button"
                ref={(node) => {
                  if (node) {
                    chipRefs.current.set(day, node);
                  } else {
                    chipRefs.current.delete(day);
                  }
                }
}
                data-day-key={day}
                aria-current={isToday ? "date" : undefined}
                className={classes}
                onClick={() => setSelectedDay(day)}
              >
                {formatDayChip(day)}
              </button>
            );
          })}
        </div>
      ) : null}

      {loading ? (
        <p className={styles.status}>Loading fixtures…</p>
      ) : null}
      {loadError ? (
        <p className={styles.status}>Could not load fixtures. Try again shortly.</p>
      ) : null}

      {!loading && !loadError && byDay.length === 0 ? (
        <p className={styles.empty}>No fixtures in this month for the selected filter.</p>
      ) : null}

      {byDay.map(([day, rows]) => (
        <section key={day} className={styles.dayBlock}>
          <h2 className={styles.dayHeading}>{day}</h2>
          <ul className={styles.list}>
            {rows.map((row) => (
              <li key={row.id}>
                <Link href={row.href} className={styles.row}>
                  <span className={styles.time}>{formatTime(row.kickoffUtc)}</span>
                  <span className={styles.teams}>
                    <Flag code={row.homeFlag} />
                    <span>
                      {row.homeName} vs {row.awayName}
                    </span>
                    <Flag code={row.awayFlag} />
                  </span>
                  <span className={styles.meta}>
                    <span className={styles.badge}>{row.competitionLabel}</span>
                    {row.groupLabel ? (
                      <span className={styles.group}>{row.groupLabel}</span>
                    ) : null}
                    {row.venueLabel ? (
                      <span className={styles.venue}>{row.venueLabel}</span>
                    ) : null}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}