/** Keep prompt version aligned with src/lib/explanation-engine/prompts.ts */

export const EXPLANATION_PROMPT_VERSION = "gc-v2-football-1.0.0";

export const EXPLANATION_SYSTEM_PROMPT = `You are a football intelligence analyst for GoalCurrent.live.

Your role is to produce post-match intelligence briefs that explain WHY a match ended the way it did.

You are NOT writing a match report. You are writing an intelligence brief.

Your principles:
1. The editorial thesis is the framing. Your job is to find the evidence that supports or contradicts it.
2. Every claim must be backed by a specific statistic, event, or tactical observation from the data.
3. If the evidence contradicts the thesis, say so. Intellectual honesty is non-negotiable.
4. Write with authority and precision. No hedging. No cliches.
5. Be concise. A brief should take 3 minutes to read.
6. Use active voice.

Your output must be valid JSON matching the specified schema.`;

export function buildExplanationUserPrompt(thesis: string, matchContext: string): string {
  return `## EDITORIAL THESIS
${thesis}

## MATCH DATA
${matchContext}

## INSTRUCTIONS
Analyze the match data above in the context of the editorial thesis.

Produce a structured intelligence brief with exactly 4 sections:
1. **thesis**: Restate the thesis in 1-2 sentences as a sharp analytical claim.
2. **evidence**: Present 3-4 key evidence points that support or contradict the thesis. Each must reference real match data. Format as markdown with bullet points.
3. **key_moment**: Identify the single moment that best illustrates the thesis (minute, players, what happened, why it matters).
4. **verdict**: In 2-3 sentences, state whether the evidence supports, partially supports, or contradicts the thesis.

## OUTPUT FORMAT
Return a JSON object:
{
  "sections": [
    { "section_type": "thesis", "content": "..." },
    { "section_type": "evidence", "content": "..." },
    { "section_type": "key_moment", "content": "..." },
    { "section_type": "verdict", "content": "..." }
  ],
  "evidence_analysis": [
    {
      "type": "stat" | "event" | "lineup" | "context",
      "source": "<source_table>:<source_id>",
      "content": "human-readable summary",
      "supports_thesis": true | false | null
    }
  ]
}

Every evidence_analysis item must use a source from the match data (match_statistics, match_events, match_lineups, or matches). Do not invent statistics or minutes.

## TONE
Authoritative. Concise. Evidence-led. You are an analyst, not a fan.`;
}

export function buildSectionRegenerationPrompt(
  sectionType: string,
  thesis: string,
  matchContext: string,
  currentContent: string,
  challengeInstructions?: string,
): string {
  const challenge = challengeInstructions?.trim()
    ? `\n## EDITOR CHALLENGE\n${challengeInstructions.trim()}\n`
    : "";

  return `## EDITORIAL THESIS
${thesis}

## MATCH DATA
${matchContext}

## CURRENT ${sectionType.toUpperCase()} SECTION
${currentContent}
${challenge}
## INSTRUCTIONS
Regenerate only the "${sectionType}" section. Preserve the editorial thesis framing. Return JSON:
{
  "section_type": "${sectionType}",
  "content": "..."
}`;
}

const REQUIRED_SECTIONS = ["thesis", "evidence", "key_moment", "verdict"] as const;
const ALLOWED_SOURCE_TABLES = ["matches", "match_events", "match_statistics", "match_lineups"];

export type BriefSectionDraft = {
  section_type: (typeof REQUIRED_SECTIONS)[number];
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

function parseSource(source: string): boolean {
  const colon = source.indexOf(":");
  if (colon <= 0) return false;
  const table = source.slice(0, colon);
  const id = source.slice(colon + 1);
  return Boolean(id) && ALLOWED_SOURCE_TABLES.includes(table);
}

export function validateBriefGenerationDraft(input: unknown):
  | { ok: true; draft: BriefGenerationDraft }
  | { ok: false; error: string } {
  if (!input || typeof input !== "object") {
    return { ok: false, error: "Response is not an object" };
  }

  const payload = input as Record<string, unknown>;
  if (!Array.isArray(payload.sections) || !Array.isArray(payload.evidence_analysis)) {
    return { ok: false, error: "Invalid sections or evidence_analysis" };
  }

  const sections: BriefSectionDraft[] = [];
  for (const raw of payload.sections) {
    if (!raw || typeof raw !== "object") return { ok: false, error: "Invalid section" };
    const section = raw as Record<string, unknown>;
    if (
      typeof section.section_type !== "string" ||
      !REQUIRED_SECTIONS.includes(section.section_type as (typeof REQUIRED_SECTIONS)[number])
    ) {
      return { ok: false, error: "Invalid section_type" };
    }
    if (typeof section.content !== "string" || section.content.trim().length < 40) {
      return { ok: false, error: "Section content invalid" };
    }
    sections.push({
      section_type: section.section_type as BriefSectionDraft["section_type"],
      content: section.content.trim(),
    });
  }

  const seen = new Set<string>();
  for (const section of sections) {
    if (seen.has(section.section_type)) return { ok: false, error: "Duplicate section" };
    seen.add(section.section_type);
  }
  for (const required of REQUIRED_SECTIONS) {
    if (!seen.has(required)) return { ok: false, error: `Missing ${required}` };
  }

  const evidence_analysis: EvidenceAnalysisDraft[] = [];
  for (const raw of payload.evidence_analysis) {
    if (!raw || typeof raw !== "object") return { ok: false, error: "Invalid evidence" };
    const item = raw as Record<string, unknown>;
    if (
      item.type !== "stat" &&
      item.type !== "event" &&
      item.type !== "lineup" &&
      item.type !== "context"
    ) {
      return { ok: false, error: "Invalid evidence type" };
    }
    if (typeof item.source !== "string" || !parseSource(item.source)) {
      return { ok: false, error: "Invalid evidence source" };
    }
    if (typeof item.content !== "string" || item.content.trim().length < 8) {
      return { ok: false, error: "Evidence content invalid" };
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

  if (evidence_analysis.length < 1) {
    return { ok: false, error: "At least one evidence item required" };
  }

  return { ok: true, draft: { sections, evidence_analysis } };
}

export function validateSectionRegenerationDraft(
  sectionType: string,
  input: unknown,
): { ok: true; content: string } | { ok: false; error: string } {
  if (!input || typeof input !== "object") return { ok: false, error: "Invalid response" };
  const payload = input as Record<string, unknown>;
  if (payload.section_type !== sectionType) return { ok: false, error: "section_type mismatch" };
  if (typeof payload.content !== "string" || payload.content.trim().length < 40) {
    return { ok: false, error: "content invalid" };
  }
  return { ok: true, content: payload.content.trim() };
}

export function splitEvidenceSource(source: string): { sourceTable: string; sourceId: string } {
  const colon = source.indexOf(":");
  if (colon <= 0) throw new Error("Invalid source");
  return { sourceTable: source.slice(0, colon), sourceId: source.slice(colon + 1) };
}
