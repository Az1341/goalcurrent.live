import type { ReactNode } from "react";
import styles from "./team-profile.module.css";

type ProfileSectionProps = {
  id?: string;
  title: string;
  children: ReactNode;
};

export default function ProfileSection({ id, title, children }: ProfileSectionProps) {
  return (
    <section className={styles.section} aria-labelledby={id}>
      <h2 id={id} className={styles.sectionTitle}>{title}</h2>
      {children}
    </section>
  );
}