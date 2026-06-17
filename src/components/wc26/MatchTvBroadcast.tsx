"use client";

import {
  getTvBroadcastDisplay,
  getTvChannels,
  type Wc26TvRegionCode,
} from "@/lib/wc26-fixtures-page";
import matchStyles from "@/components/match/match.module.css";
import wc26Styles from "./wc26.module.css";

type MatchTvBroadcastProps = {
  tvRegion: Wc26TvRegionCode;
  variant?: "chips" | "detail" | "inline";
  className?: string;
};

export default function MatchTvBroadcast({
  tvRegion,
  variant = "chips",
  className,
}: MatchTvBroadcastProps) {
  const broadcast = getTvBroadcastDisplay(tvRegion);

  if (variant === "detail") {
    return (
      <div className={`${matchStyles.watchOn} ${className ?? ""}`.trim()}>
        <span className={matchStyles.watchOnLabel}>Regional coverage:</span>
        <span className={matchStyles.watchOnChannels}>
          {broadcast.available
            ? broadcast.line
            : "Broadcast information unavailable for your region"}
        </span>
      </div>
    );
  }

  if (!broadcast.available) {
    return (
      <span className={`${wc26Styles.fixTvUnavailable} ${className ?? ""}`.trim()}>
        Broadcast information unavailable for your region
      </span>
    );
  }

  if (variant === "inline") {
    return (
      <span className={`${wc26Styles.fixTvInline} ${className ?? ""}`.trim()}>
        {broadcast.regionalLine}
      </span>
    );
  }

  return (
    <div className={`${wc26Styles.fixTvWrap} ${className ?? ""}`.trim()}>
      <span className={wc26Styles.fixTvRegionalLabel}>Regional coverage:</span>
      <div className={wc26Styles.fixTv}>
        {getTvChannels(tvRegion).map((channel) => (
          <span key={channel} className={wc26Styles.fixTvChip}>
            {channel}
          </span>
        ))}
      </div>
    </div>
  );
}
