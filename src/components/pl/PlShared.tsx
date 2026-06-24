"use client";

import { useState } from "react";
import RemoteImage from "@/components/ui/RemoteImage";
import styles from "./PlData.module.css";

function teamInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 3).toUpperCase();
  }
  return parts
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();
}

export function PlTeamLogo({
  name,
  logo,
  size = 40,
  className,
  rounded = false,
}: {
  name: string;
  logo: string | null;
  size?: number;
  className?: string;
  rounded?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const initials = teamInitials(name);

  return (
    <span
      className={className ?? styles.badge}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {logo && !failed ? (
        <RemoteImage
          src={logo}
          alt=""
          width={size}
          height={size}
          sizes={`${size}px`}
          style={{
            width: size,
            height: size,
            objectFit: "cover",
            ...(rounded ? { borderRadius: "999px" } : {}),
          }}
          onError={() => setFailed(true)}
        />
      ) : (
        initials
      )}
    </span>
  );
}

export function PlTeamBadge({
  name,
  logo,
  size = 40,
}: {
  name: string;
  logo: string | null;
  size?: number;
}) {
  return <PlTeamLogo name={name} logo={logo} size={size} />;
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
