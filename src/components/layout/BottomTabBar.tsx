"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  MOBILE_BOTTOM_TABS,
  isMobileBottomTabActive,
} from "@/lib/nav";
import MoreBottomSheet from "./MoreBottomSheet";
import styles from "./BottomTabBar.module.css";

function HomeIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 3 3 10.5V21h6v-6h6v6h6V10.5L12 3Z"
      />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm7.93 9H17.1a16.4 16.4 0 0 0-1.2-5.02A8.03 8.03 0 0 1 19.93 11ZM12 4c.95 1.2 1.66 2.86 1.93 5H10.07C10.34 6.86 11.05 5.2 12 4ZM8.1 5.98A16.4 16.4 0 0 0 6.9 11H4.07A8.03 8.03 0 0 1 8.1 5.98ZM4.07 13H6.9c.28 1.86.98 3.52 2.2 4.72A8.03 8.03 0 0 1 4.07 13Zm3.83 5.02c.28-1.86.98-3.52 2.2-4.72h3.46c-.95 1.2-1.66 2.86-1.93 5H7.9Zm5.17 0c-.27-2.14-.98-3.8-1.93-5h3.86c-.95 1.2-1.66 2.86-1.93 5H13.07Zm5.83-5.02h2.83a8.03 8.03 0 0 1-4.03 4.72c1.22-1.2 1.92-2.86 2.2-4.72Zm0-2h-2.83a16.4 16.4 0 0 0-1.2-5.02 8.03 8.03 0 0 1 4.03 4.02ZM12 20c-.95-1.2-1.66-2.86-1.93-5h3.86C13.66 17.14 12.95 18.8 12 20Z"
      />
    </svg>
  );
}

function FlagIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M6 3v18H4V3h2Zm2 0 3.5 2H20v2h-8.5L14 9h6v2h-4.5L12 15h8v2H8V3Z"
      />
    </svg>
  );
}

function TableIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Zm4 2v3h4V7H7Zm6 0v3h4V7h-4ZM7 14v3h4v-3H7Zm6 0v3h4v-3h-4Z"
      />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M6 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"
      />
    </svg>
  );
}

function TabIcon({ tabId }: { tabId: string }) {
  switch (tabId) {
    case "home":
      return <HomeIcon />;
    case "worldcup":
      return <GlobeIcon />;
    case "fixtures":
      return <FlagIcon />;
    case "pl-table":
      return <TableIcon />;
    default:
      return null;
  }
}

export default function BottomTabBar() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      <nav
        className={styles.bar}
        aria-label="Mobile bottom navigation"
        data-gc-chrome="mobile-tab-bar"
      >
        {MOBILE_BOTTOM_TABS.map((tab) => {
          const active = isMobileBottomTabActive(pathname, tab);
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`${styles.tabLink} ${active ? styles.tabLinkActive : ""}`}
              aria-current={active ? "page" : undefined}
            >
              <span className={styles.iconWrap}>
                <TabIcon tabId={tab.id} />
              </span>
              {tab.label}
            </Link>
          );
        })}

        <button
          type="button"
          className={`${styles.tabButton} ${moreOpen ? styles.tabButtonActive : ""}`}
          aria-expanded={moreOpen}
          aria-label="Open more navigation"
          onClick={() => setMoreOpen(true)}
        >
          <span className={styles.iconWrap}>
            <MoreIcon />
          </span>
          More
        </button>
      </nav>

      <MoreBottomSheet open={moreOpen} onClose={() => setMoreOpen(false)} />
    </>
  );
}
