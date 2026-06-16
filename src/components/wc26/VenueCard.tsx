import type { Venue } from "@/types/venue";

import TeamFlag from "@/components/TeamFlag";

import { getHostCountryTeamId } from "@/lib/host-country-flag";

import styles from "./wc26.module.css";



type VenueCardProps = {

  venue: Venue;

};



export default function VenueCard({ venue }: VenueCardProps) {

  const hostTeamId = getHostCountryTeamId(venue.country);



  return (

    <div className={styles.venueCard}>

      <div className={styles.venueCardHead}>

        <div className={styles.venueIcon}>🏟</div>

        <TeamFlag teamId={hostTeamId} size={22} className={styles.venueHostFlag} />

      </div>

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

