import FixturesCalendar from "./FixturesCalendar";

import styles from "./wc26.module.css";



export default function FixturesSection() {

  return (

    <section aria-labelledby="fixtures-section-heading">

      <h2 id="fixtures-section-heading" className={styles.sectionTitle}>

        Official match schedule

      </h2>



      <p className={styles.phaseNote}>
        Verified FIFA World Cup 2026 schedule from local data. Group-stage
        times follow your local timezone; knockout rounds show official stadium
        local kick-off plus BST (UK). Live scores update from API-Football when
        available.
      </p>



      <FixturesCalendar />

    </section>

  );

}

