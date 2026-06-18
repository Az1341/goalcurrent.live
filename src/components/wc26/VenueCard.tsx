"use client";

import { useId } from "react";
import type { Venue } from "@/types/venue";
import TeamFlag from "@/components/TeamFlag";
import { getHostCountryTeamId } from "@/lib/host-country-flag";
import {
  buildVenueDescription,
  formatVenueTimezoneLabel,
  type VenueStats,
} from "@/lib/wc26-venue-stats";
import styles from "./wc26.module.css";

type VenueCardProps = {
  venue: Venue;
  stats: VenueStats;
  isPanelOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export default function VenueCard({
  venue,
  stats,
  isPanelOpen,
  onOpen,
  onClose,
}: VenueCardProps) {
  const panelId = useId();
  const hostTeamId = getHostCountryTeamId(venue.country);
  const description = buildVenueDescription(venue, stats);
  const timezoneLabel = formatVenueTimezoneLabel(venue.timezone);

  return (
    <div
      className={styles.venueCardWrap}
      data-venue-card
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      onFocus={onOpen}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          onClose();
        }
      }}
    >
      <button
        type="button"
        className={styles.venueCard}
        aria-expanded={isPanelOpen}
        aria-controls={panelId}
        onClick={() => (isPanelOpen ? onClose() : onOpen())}
      >
        <div className={styles.venueCardHead}>
          <div className={styles.venueIcon} aria-hidden="true">
            🏟
          </div>
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
      </button>

      {isPanelOpen ? (
        <div
          id={panelId}
          className={styles.venuePanel}
          role="region"
          aria-label={`${venue.name} details`}
        >
          <div className={styles.venuePanelHead}>
            <TeamFlag teamId={hostTeamId} size={28} />
            <div>
              <div className={styles.venuePanelTitle}>{venue.name}</div>
              <div className={styles.venuePanelSub}>
                {venue.city} · {venue.country}
              </div>
            </div>
          </div>
          <p className={styles.venuePanelDescription}>{description}</p>
          <dl className={styles.venuePanelFacts}>
            <div>
              <dt>Stadium</dt>
              <dd>{venue.name}</dd>
            </div>
            <div>
              <dt>City</dt>
              <dd>{venue.city}</dd>
            </div>
            <div>
              <dt>Country</dt>
              <dd>{venue.country}</dd>
            </div>
            {venue.capacity != null ? (
              <div>
                <dt>Capacity</dt>
                <dd>{venue.capacity.toLocaleString("en-GB")}</dd>
              </div>
            ) : null}
            <div>
              <dt>Matches hosted</dt>
              <dd>
                {stats.matchCount > 0
                  ? `${stats.matchCount} group-stage ${stats.matchCount === 1 ? "match" : "matches"}`
                  : "No group-stage matches on current schedule"}
              </dd>
            </div>
            <div>
              <dt>Opening match</dt>
              <dd>
                {stats.hostsOpeningMatch
                  ? "Yes — tournament opener (Match 1)"
                  : "Not on current schedule"}
              </dd>
            </div>
            <div>
              <dt>Final</dt>
              <dd>
                {stats.hostsFinal
                  ? "Yes — hosts the World Cup final"
                  : "Not on current schedule"}
              </dd>
            </div>
            {timezoneLabel ? (
              <div>
                <dt>Time zone</dt>
                <dd>{timezoneLabel}</dd>
              </div>
            ) : null}
          </dl>
        </div>
      ) : null}
    </div>
  );
}
