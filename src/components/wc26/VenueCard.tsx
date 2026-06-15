import type { Venue } from "@/types/venue";
import styles from "./wc26.module.css";

type VenueCardProps = {
  venue: Venue;
};

export default function VenueCard({ venue }: VenueCardProps) {
  return (
    <div className={styles.venueCard}>
      <div className={styles.venueIcon}>🏟</div>
      <div className={styles.venueLabel}>{venue.name}</div>
      <div className={styles.venueSub}>
        {venue.city} · {venue.country}
      </div>
      {venue.capacity != null ? (
        <div className={styles.venueCapacity}>
          Capacity: {venue.capacity.toLocaleString("en-GB")}
        </div>
      ) : null}
    </div>
  );
}
