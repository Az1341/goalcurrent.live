"use client";

import {
  WC26_TV_REGIONS,
  formatVisitorTimezone,
  type Wc26TvRegionCode,
} from "@/lib/wc26-fixtures-page";
import styles from "./wc26.module.css";

type TvRegionSelectProps = {
  tvRegion: Wc26TvRegionCode;
  onChange: (region: Wc26TvRegionCode) => void;
  showTimezonePill?: boolean;
};

export default function TvRegionSelect({
  tvRegion,
  onChange,
  showTimezonePill = true,
}: TvRegionSelectProps) {
  return (
    <div className={styles.fixTvBar}>
      <strong>TV in:</strong>
      <select
        className={styles.fixTvSelect}
        value={tvRegion}
        onChange={(e) => onChange(e.target.value as Wc26TvRegionCode)}
        aria-label="TV region"
      >
        {WC26_TV_REGIONS.map((region) => (
          <option key={region.code} value={region.code}>
            {region.label}
          </option>
        ))}
      </select>
      {showTimezonePill ? (
        <span className={styles.fixTzPill}>{formatVisitorTimezone()} times</span>
      ) : null}
    </div>
  );
}
