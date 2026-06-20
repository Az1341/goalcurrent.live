"use client";

import { useState } from "react";
import styles from "./PlData.module.css";

export function PlTeamBadge({
  name,
  logo,
  size = 40,
}: {
  name: string;
  logo: string | null;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();

  return (
    <span
      className={styles.badge}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {logo && !failed ? (
        <img
          src={logo}
          alt=""
          width={size}
          height={size}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        initials
      )}
    </span>
  );
}

export function PlLoadingPanel({ title, text }: { title: string; text: string }) {
  return (
    <div className={styles.panel} role="status" aria-live="polite">
      <div className={styles.spinner} aria-hidden="true" />
      <p className={styles.panelTitle}>{title}</p>
      <p className={styles.panelText}>{text}</p>
    </div>
  );
}

export function PlEmptyPanel({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className={styles.panel} role="status">
      <p className={styles.panelTitle}>{title}</p>
      <p className={styles.panelText}>{text}</p>
    </div>
  );
}

export function PlErrorPanel({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className={styles.panel} role="alert">
      <p className={styles.panelTitle}>{title}</p>
      <p className={styles.panelText}>{text}</p>
    </div>
  );
}

export function PlSearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className={styles.searchWrap}>
      <input
        type="search"
        className={styles.searchInput}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
    </div>
  );
}
