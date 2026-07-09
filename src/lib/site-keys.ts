/** localStorage keys — site-wide first-visit prompts */
export const COOKIE_CONSENT_KEY = "gc_cookie_consent_v1";
export const COOKIE_CONSENT_ACCEPTED = "accepted";
export const COOKIE_CONSENT_DECLINED = "declined";

export const SUBSCRIBE_POPUP_KEY = "gc_subscribe_popup_v1";
export const SUBSCRIBE_POPUP_DISMISSED = "1";

/** Persisted WC26 TV broadcast region (GB, US, CA, …). */
export const TV_REGION_KEY = "gc_tv_region_v1";

/** NordVPN affiliate placeholder — replace when live link is confirmed */
export const NORDVPN_HREF = "https://go.nordvpn.net/aff_c?offer_id=15&aff_id=148347";

export const GOOGLE_PLAY_APP_URL =
  "https://play.google.com/store/apps/details?id=com.goalcurrent.app";
export const GOOGLE_PLAY_BADGE_SRC = "/images/google-play-badge.png";

/** Official social profile URLs (footer + JSON-LD sameAs). */
export const FACEBOOK_HREF =
  "https://www.facebook.com/profile.php?id=61591562350580";
export const INSTAGRAM_HREF = "https://www.instagram.com/goalcurrentlive";
export const TIKTOK_HREF = "https://www.tiktok.com/@goalcurrent";

export const SOCIAL_PROFILE_URLS = [
  FACEBOOK_HREF,
  INSTAGRAM_HREF,
  TIKTOK_HREF,
] as const;
