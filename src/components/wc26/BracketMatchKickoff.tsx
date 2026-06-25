"use client";

import { getVenueById } from "@/data/wc26";
import { useLocalizedKickoffLabel } from "@/lib/client/use-local-kickoff";
import type { VenueId } from "@/types/venue";
import styles from "./wc26.module.css";

type BracketMatchKickoffProps = { kickoffUtc: string; venueId: VenueId };

export default function BracketMatchKickoff({ kickoffUtc, venueId }: BracketMatchKickoffProps) {
  const kickoffLabel = useLocalizedKickoffLabel(kickoffUtc);
  const venue = getVenueById(venueId);
  const venueLabel = venue ? venue.name + (venue.city ? ", " + venue.city : "") : null;
  return (
    <p className={styles.bracketMatchSchedule}>
      <time dateTime={kickoffUtc}>{kickoffLabel}</time>
      {venueLabel ? <span className={styles.bracketMatchVenue}>{venueLabel}</span> : null}
    </p>
  );
}
