import type { Metadata } from "next";
import Link from "next/link";
import layoutStyles from "@/components/layout/layout.module.css";
import styles from "@/components/wc26/wc26.module.css";

export const metadata: Metadata = {
  title: "Favourites",
  description:
    "Your saved teams, matches, national sides and competitions on GoalCurrent.online.",
};

const FAVOURITE_SECTIONS = [
  {
    id: "teams",
    title: "Favourite teams",
    description: "Club and national teams you follow across any competition.",
  },
  {
    id: "matches",
    title: "Favourite matches",
    description: "Fixtures and results you want quick access to.",
  },
  {
    id: "countries",
    title: "Favourite countries",
    description: "National teams and countries saved for easy tracking.",
  },
  {
    id: "competitions",
    title: "Favourite competitions",
    description: "Leagues, cups and tournaments you follow on GoalCurrent.",
  },
] as const;

export default function FavouritesPage() {
  return (
    <main className={layoutStyles.content}>
      <h1 className={styles.pageTitle}>Favourites</h1>
      <p className={styles.pageIntro}>
        Saved teams, matches, countries and competitions will appear here —
        across World Cup 2026, leagues and any future competitions on
        GoalCurrent.
      </p>

      <div className={styles.placeholderPanel}>
        <h2>No favourites saved yet</h2>
        <p>
          When saving is enabled, your picks will show in the sections below.
          Removing favourites will be available in a later phase.
        </p>
      </div>

      {FAVOURITE_SECTIONS.map((section) => (
        <section key={section.id} aria-labelledby={`fav-${section.id}-heading`}>
          <h2
            id={`fav-${section.id}-heading`}
            className={styles.sectionTitle}
          >
            {section.title}
          </h2>
          <div className={styles.placeholderPanel}>
            <p>{section.description}</p>
            <p>Nothing saved yet.</p>
            <button type="button" disabled aria-disabled="true">
              Remove — Coming soon
            </button>
          </div>
        </section>
      ))}

      <p className={styles.hubBack}>
        <Link href="/">← Back to Home</Link>
      </p>
    </main>
  );
}
