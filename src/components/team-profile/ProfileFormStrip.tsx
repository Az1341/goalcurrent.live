import type { FormResult } from "@/lib/team-profile/fixture-utils";
import styles from "./team-profile.module.css";

export default function ProfileFormStrip({ form }: { form: FormResult[] }) {
  if (!form.length) return null;
  return (
    <div className={styles.formStrip} aria-label="Recent form">
      {form.map((result, index) => (
        <span
          key={`${result}-${index}`}
          className={`${styles.formPill} ${result === "W" ? styles.formW : result === "D" ? styles.formD : styles.formL}`}
        >
          {result}
        </span>
      ))}
    </div>
  );
}