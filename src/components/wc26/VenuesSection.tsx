"use client";

import { useEffect, useState } from "react";
import { WC26_VENUES, WC26_VENUE_COUNT } from "@/data/wc26";
import { getVenueStats } from "@/lib/wc26-venue-stats";
import VenueCard from "./VenueCard";
import styles from "./wc26.module.css";

export default function VenuesSection() {
  const [openVenueId, setOpenVenueId] = useState<string | null>(null);

  useEffect(() => {
    if (!openVenueId) {
      return;
    }

    const closeOnOutside = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element) || !target.closest("[data-venue-card]")) {
        setOpenVenueId(null);
      }
    };

    document.addEventListener("pointerdown", closeOnOutside);
    return () => document.removeEventListener("pointerdown", closeOnOutside);
  }, [openVenueId]);

  return (
    <section aria-labelledby="venues-section-heading">
      <h2 id="venues-section-heading" className={styles.sectionTitle}>
        Host stadiums
      </h2>

      <p className={styles.phaseNote}>
        World Cup 2026 venues across USA, Canada and Mexico. {WC26_VENUE_COUNT}{" "}
        host stadiums from the verified FIFA group-stage schedule — hover or tap a
        venue for match counts and tournament roles.
      </p>

      <ul className={styles.venueSeoList} aria-label="World Cup 2026 venue summary">
        {WC26_VENUES.map((venue) => {
          const stats = getVenueStats(venue.id);
          return (
            <li key={venue.id}>
              {venue.name} — {venue.city}, {venue.country}.
              {stats.matchCount > 0
                ? ` ${stats.matchCount} group-stage matches scheduled.`
                : ""}
              {stats.hostsOpeningMatch ? " Hosts the tournament opening match." : ""}
            </li>
          );
        })}
      </ul>

      <div className={styles.venueGrid}>
        {WC26_VENUES.map((venue) => {
          const stats = getVenueStats(venue.id);
          const isOpen = openVenueId === venue.id;

          return (
            <VenueCard
              key={venue.id}
              venue={venue}
              stats={stats}
              isPanelOpen={isOpen}
              onOpen={() => setOpenVenueId(venue.id)}
              onClose={() => setOpenVenueId((current) => (current === venue.id ? null : current))}
            />
          );
        })}
      </div>
    </section>
  );
}
