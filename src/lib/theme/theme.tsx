"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type ThemeMode = "light" | "dark";

const STORAGE_KEY = "gc-theme";

type ThemeContextValue = {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

function applyTheme(mode: ThemeMode): void {
  document.documentElement.setAttribute("data-theme", mode);
  try {
    window.localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    /* ignore */
  }
}

const themeListeners = new Set<() => void>();
let themeSnapshot: ThemeMode = "light";

function subscribeTheme(listener: () => void): () => void {
  themeListeners.add(listener);
  return () => themeListeners.delete(listener);
}

function getThemeSnapshot(): ThemeMode {
  return themeSnapshot;
}

function emitTheme(): void {
  for (const listener of themeListeners) {
    listener();
  }
}

function setThemeSnapshot(mode: ThemeMode): void {
  themeSnapshot = mode;
  applyTheme(mode);
  emitTheme();
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    () => "light" as ThemeMode,
  );

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeSnapshot(mode);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeSnapshot(theme === "dark" ? "light" : "dark");
  }, [theme]);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}

/** Call once on mount to sync React state with localStorage / data-theme. */
export function ThemeBootstrap(): null {
  useSyncExternalStore(
    subscribeTheme,
    () => {
      if (typeof window !== "undefined" && themeSnapshot === "light") {
        const stored = readStoredTheme();
        if (stored !== themeSnapshot) {
          setThemeSnapshot(stored);
        }
      }
      return themeSnapshot;
    },
    () => "light" as ThemeMode,
  );
  return null;
}
