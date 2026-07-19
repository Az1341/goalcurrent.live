/** GoalCurrent v2 domain types (runtime-neutral). */

import type {
  BriefStatus,
  FeedbackType,
  MatchStatus,
  SectionType,
  UserRole,
} from "@/types/database";

export type { BriefStatus, FeedbackType, MatchStatus, SectionType, UserRole };

export type EvidenceItem = {
  readonly type: "stat" | "event" | "lineup" | "context";
  readonly source: string;
  readonly content: string;
  readonly supports_thesis: boolean | null;
};

export type ExplanationRequest = {
  readonly domain: "football";
  readonly thesis: string;
  readonly context_summary: string;
  readonly evidence: readonly EvidenceItem[];
  readonly tone: "authoritative" | "analytical" | "explanatory";
};

export type ExplanationSection = {
  readonly section_type: SectionType;
  readonly content: string;
};

export type ExplanationResponse = {
  readonly sections: readonly ExplanationSection[];
  readonly evidence_analysis: readonly EvidenceItem[];
};

export type MatchIdentity = {
  readonly apiFixtureId: number;
  readonly localFixtureId: string | null;
  readonly homeTeamId: number;
  readonly awayTeamId: number;
  readonly homeTeamName: string;
  readonly awayTeamName: string;
  readonly kickoffUtc: string;
};

export type MatchScoreContext = {
  readonly status: MatchStatus;
  readonly apiStatusShort: string | null;
  readonly apiStatusLong: string | null;
  readonly elapsedMinute: number | null;
  readonly extraMinute: number | null;
  readonly homeScore: number | null;
  readonly awayScore: number | null;
  readonly halftimeHomeScore: number | null;
  readonly halftimeAwayScore: number | null;
  readonly fulltimeHomeScore: number | null;
  readonly fulltimeAwayScore: number | null;
  readonly extratimeHomeScore: number | null;
  readonly extratimeAwayScore: number | null;
  readonly penaltyHomeScore: number | null;
  readonly penaltyAwayScore: number | null;
  readonly winnerTeamId: number | null;
};

export type BriefSummary = {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly subtitle: string | null;
  readonly thesisExcerpt: string;
  readonly readTimeMinutes: number;
  readonly publishedAt: string | null;
  readonly feedbackCount: number;
  readonly match: MatchIdentity;
  readonly score: MatchScoreContext;
};

export type BriefSectionView = {
  readonly id: string;
  readonly sectionType: SectionType;
  readonly sortOrder: number;
  readonly content: string;
  readonly aiGenerated: boolean;
  readonly editedByHuman: boolean;
};

export type BriefDetail = BriefSummary & {
  readonly sections: readonly BriefSectionView[];
  readonly status: BriefStatus;
};

export type FeedbackSubmission = {
  readonly briefId: string;
  readonly sectionId: string;
  readonly feedbackType: FeedbackType;
  readonly comment?: string | null;
};

export type AnonymousFeedbackIdentity = {
  /** HMAC-SHA256 hex digest: sectionId + browser token + secret (server only). */
  readonly anonymousIdentity: string;
  readonly browserToken: string;
};

export type EditorialThesisInput = {
  readonly matchId: number;
  readonly thesisText: string;
  readonly angleTags?: readonly string[];
};

export type EventFingerprintInput = {
  readonly matchId: number;
  readonly teamId: number | null;
  readonly minute: number;
  readonly minuteExtra: number;
  readonly eventType: string;
  readonly detail: string | null;
  readonly playerId: number | null;
  readonly assistId: number | null;
};
