import type { SectionType } from "@/types/database";

export const REQUIRED_BRIEF_SECTIONS: readonly SectionType[] = [
  "thesis",
  "evidence",
  "key_moment",
  "verdict",
] as const;

export const ALLOWED_EVIDENCE_SOURCE_TABLES = [
  "matches",
  "match_events",
  "match_statistics",
  "match_lineups",
] as const;

export type BriefSectionDraft = {
  section_type: SectionType;
  content: string;
};

export type EvidenceAnalysisDraft = {
  type: "stat" | "event" | "lineup" | "context";
  source: string;
  content: string;
  supports_thesis: boolean | null;
};

export type BriefGenerationDraft = {
  sections: BriefSectionDraft[];
  evidence_analysis: EvidenceAnalysisDraft[];
};

const MIN_SECTION_LENGTH = 40;
const MAX_SECTION_LENGTH = 8000;
const MIN_EVIDENCE_ITEMS = 1;
const MAX_EVIDENCE_ITEMS = 12;

function isSectionType(value: string): value is SectionType {
  return (REQUIRED_BRIEF_SECTIONS as readonly string[]).includes(value);
}

function isEvidenceType(value: string): value is EvidenceAnalysisDraft["type"] {
  return value === "stat" || value === "event" || value === "lineup" || value === "context";
}

function parseSourceReference(source: string): { table: string; id: string } | null {
  const trimmed = source.trim();
  const colon = trimmed.indexOf(":");
  if (colon <= 0) {
    return null;
  }
  const table = trimmed.slice(0, colon);
  const id = trimmed.slice(colon + 1);
  if (!id) {
    return null;
  }
  if (!(ALLOWED_EVIDENCE_SOURCE_TABLES as readonly string[]).includes(table)) {
    return null;
  }
  return { table, id };
}

export type BriefQualityResult =
  | { ok: true; draft: BriefGenerationDraft }
  | { ok: false; error: string };

export function validateBriefGenerationDraft(input: unknown): BriefQualityResult {
  if (!input || typeof input !== "object") {
    return { ok: false, error: "Response is not an object" };
  }

  const payload = input as Record<string, unknown>;
  if (!Array.isArray(payload.sections)) {
    return { ok: false, error: "sections must be an array" };
  }
  if (!Array.isArray(payload.evidence_analysis)) {
    return { ok: false, error: "evidence_analysis must be an array" };
  }

  const sections: BriefSectionDraft[] = [];
  for (const raw of payload.sections) {
    if (!raw || typeof raw !== "object") {
      return { ok: false, error: "Invalid section entry" };
    }
    const section = raw as Record<string, unknown>;
    if (typeof section.section_type !== "string" || !isSectionType(section.section_type)) {
      return { ok: false, error: `Invalid section_type: ${String(section.section_type)}` };
    }
    if (typeof section.content !== "string") {
      return { ok: false, error: "Section content must be a string" };
    }
    const content = section.content.trim();
    if (content.length < MIN_SECTION_LENGTH || content.length > MAX_SECTION_LENGTH) {
      return { ok: false, error: `Section ${section.section_type} length out of bounds` };
    }
    sections.push({ section_type: section.section_type, content });
  }

  const seenTypes = new Set<SectionType>();
  for (const section of sections) {
    if (seenTypes.has(section.section_type)) {
      return { ok: false, error: `Duplicate section_type: ${section.section_type}` };
    }
    seenTypes.add(section.section_type);
  }

  for (const required of REQUIRED_BRIEF_SECTIONS) {
    if (!seenTypes.has(required)) {
      return { ok: false, error: `Missing required section: ${required}` };
    }
  }

  const evidenceItems = payload.evidence_analysis;
  if (evidenceItems.length < MIN_EVIDENCE_ITEMS || evidenceItems.length > MAX_EVIDENCE_ITEMS) {
    return { ok: false, error: "evidence_analysis length out of bounds" };
  }

  const evidence_analysis: EvidenceAnalysisDraft[] = [];
  for (const raw of evidenceItems) {
    if (!raw || typeof raw !== "object") {
      return { ok: false, error: "Invalid evidence entry" };
    }
    const item = raw as Record<string, unknown>;
    if (typeof item.type !== "string" || !isEvidenceType(item.type)) {
      return { ok: false, error: "Invalid evidence type" };
    }
    if (typeof item.source !== "string" || !parseSourceReference(item.source)) {
      return { ok: false, error: "Evidence source must be table:id from match data" };
    }
    if (typeof item.content !== "string" || item.content.trim().length < 8) {
      return { ok: false, error: "Evidence content too short" };
    }
    const supports =
      item.supports_thesis === null ||
      item.supports_thesis === true ||
      item.supports_thesis === false
        ? item.supports_thesis
        : null;
    evidence_analysis.push({
      type: item.type,
      source: item.source.trim(),
      content: item.content.trim(),
      supports_thesis: supports,
    });
  }

  return {
    ok: true,
    draft: { sections, evidence_analysis },
  };
}

export function validateSectionRegenerationDraft(
  sectionType: SectionType,
  input: unknown,
): { ok: true; content: string } | { ok: false; error: string } {
  if (!input || typeof input !== "object") {
    return { ok: false, error: "Response is not an object" };
  }
  const payload = input as Record<string, unknown>;
  if (payload.section_type !== sectionType) {
    return { ok: false, error: "section_type mismatch" };
  }
  if (typeof payload.content !== "string") {
    return { ok: false, error: "content must be a string" };
  }
  const content = payload.content.trim();
  if (content.length < MIN_SECTION_LENGTH || content.length > MAX_SECTION_LENGTH) {
    return { ok: false, error: "Section content length out of bounds" };
  }
  return { ok: true, content };
}

export function splitEvidenceSource(source: string): { sourceTable: string; sourceId: string } {
  const parsed = parseSourceReference(source);
  if (!parsed) {
    throw new Error(`Invalid evidence source: ${source}`);
  }
  return { sourceTable: parsed.table, sourceId: parsed.id };
}