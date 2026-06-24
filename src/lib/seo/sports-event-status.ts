import { isLiveMatchStatus } from "@/lib/wc26-live";
import { isCompletedMatchStatus } from "@/lib/wc26-tournament-stats";

/** Map fixture status to schema.org EventStatus URL. */
export function sportsEventStatus(status: string): string {
  const normalized = status.trim().toLowerCase();

  if (isLiveMatchStatus(status)) {
    return "https://schema.org/EventInProgress";
  }

  if (isCompletedMatchStatus(status) || normalized === "ft" || normalized === "finished") {
    return "https://schema.org/EventCompleted";
  }

  if (normalized === "cancelled") {
    return "https://schema.org/EventCancelled";
  }

  if (normalized === "postponed") {
    return "https://schema.org/EventPostponed";
  }

  return "https://schema.org/EventScheduled";
}
