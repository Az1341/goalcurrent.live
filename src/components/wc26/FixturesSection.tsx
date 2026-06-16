import FixturesCalendar from "./FixturesCalendar";

import styles from "./wc26.module.css";



export default function FixturesSection() {

  return (

    <section aria-labelledby="fixtures-section-heading">

      <h2 id="fixtures-section-heading" className={styles.sectionTitle}>

        Official match schedule

      </h2>



      <p className={styles.phaseNote}>

        Verified FIFA World Cup 2026 group-stage fixtures from local data.

        Times display in your local timezone. Status reflects the current overlay

        — scores sync in a later phase.

      </p>



      <FixturesCalendar />

    </section>

  );

}

