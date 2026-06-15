import { WC26_VENUES, WC26_VENUE_COUNT } from "@/data/wc26";
import VenueCard from "./VenueCard";
import styles from "./wc26.module.css";

export default function VenuesSection() {
  return (
    <section aria-labelledby="venues-section-heading">
      <h2 id="venues-section-heading" className={styles.sectionTitle}>
        Host stadiums
      </h2>

      <p className={styles.phaseNote}>
        {WC26_VENUE_COUNT} host venues across USA, Mexico and Canada from local
        data.
      </p>

      <div className={styles.venueGrid}>
        {WC26_VENUES.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>
    </section>
  );
}
