"use client";

import { useTheme } from "@/lib/theme/theme";
import styles from "./theme-toggle.module.css";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const label =
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggleTheme}
      aria-pressed={theme === "dark"}
      aria-label={label}
      title={label}
    >
      <span className={styles.icon} aria-hidden="true">
        {theme === "dark" ? "☀" : "☾"}
      </span>
    </button>
  );
}
