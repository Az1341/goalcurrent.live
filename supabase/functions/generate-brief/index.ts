import OpenAI from "https://esm.sh/openai@4.104.0";
import {
  EXPLANATION_PROMPT_VERSION,
  EXPLANATION_SYSTEM_PROMPT,
  buildExplanationUserPrompt,
  splitEvidenceSource,
  validateBriefGenerationDraft,
} from "../_shared/explanation-spec.ts";
import { authorizeEditor } from "../_shared/auth.ts";
import { buildMatchContext, buildSourceIndex } from "../_shared/match-context.ts";
import { jsonResponse } from "../_shared/json-response.ts";
import { createAdminClient } from "../_shared/supabase-admin.ts";

const MAX_THESIS_LENGTH = 4000;

async function gatherMatchData(matchId: number) {
  const supabase = createAdminClient();

  const { data: match, error: matchError } = await supabase
    .from("matches")
    .select("id, home_team_name, away_team_name, home_score, away_score, status")
    .eq("id", matchId)
    .single();

  if (matchError || !match) {
    throw new Error(`Match ${matchId} not found`);
  }

  const { data: events } = await supabase
    .from("match_events")
    .select("id, minute, minute_extra, team_name, event_type, player_name, detail")
    .eq("match_id", matchId)
    .eq("is_active", true)
    .order("minute", { ascending: true });

  const { data: statistics } = await supabase
    .from("match_statistics")
    .select("id, team_id, provider_stat_name, stat_key, stat_value_raw")
    .eq("match_id", matchId);

  const { data: lineups } = await supabase
    .from("match_lineups")
    .select("id, team_id, player_name, position, formation")
    .eq("match_id", matchId)
    .eq("is_starter", true)
    .eq("is_active", true);

  const eventRows = events ?? [];
  const statRows = statistics ?? [];
  const lineupRows = lineups ?? [];
  const sourceIndex = buildSourceIndex(matchId, eventRows, statRows, lineupRows);

  return {
    bundle: {
      match,
      events: eventRows,
      statistics: statRows,
      lineups: lineupRows,
      sourceIndex,
    },
    context: buildMatchContext({
      match,
      events: eventRows,
      statistics: statRows,
      lineups: lineupRows,
      sourceIndex,
    }),
  };
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const auth = await authorizeEditor(req);
  if (!auth.ok || !auth.userId) {
    return jsonResponse({ error: auth.error }, auth.status);
  }

  try {
    const body = await req.json();
    const matchId = body?.match_id;
    const thesisText = typeof body?.thesis_text === "string" ? body.thesis_text.trim() : "";

    if (typeof matchId !== "number" || !Number.isFinite(matchId)) {
      return jsonResponse({ error: "match_id (number) is required" }, 400);
    }
    if (!thesisText || thesisText.length > MAX_THESIS_LENGTH) {
      return jsonResponse({ error: "thesis_text is required and must be <= 4000 chars" }, 400);
    }

    const supabase = createAdminClient();
    const authorId = auth.userId;

    const { data: thesis, error: thesisError } = await supabase
      .from("editorial_theses")
      .insert({
        match_id: matchId,
        author_id: authorId,
        thesis_text: thesisText,
        original_thesis_text: thesisText,
      })
      .select("id")
      .single();

    if (thesisError || !thesis) {
      throw new Error(`Failed to insert thesis: ${thesisError?.message ?? "unknown"}`);
    }

    const { bundle, context } = await gatherMatchData(matchId);
    const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY") });
    const model = Deno.env.get("OPENAI_MODEL")?.trim() || "gpt-4o";

    const completion = await openai.chat.completions.create({
      model,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: EXPLANATION_SYSTEM_PROMPT },
        { role: "user", content: buildExplanationUserPrompt(thesisText, context) },
      ],
      temperature: 0.4,
    });

    const rawContent = completion.choices[0]?.message?.content;
    if (!rawContent) {
      throw new Error("OpenAI returned empty content");
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      throw new Error("OpenAI returned invalid JSON");
    }

    const validated = validateBriefGenerationDraft(parsed);
    if (!validated.ok) {
      throw new Error(`Brief quality validation failed: ${validated.error}`);
    }

    const thesisSection = validated.draft.sections.find((section) => section.section_type === "thesis");
    if (thesisSection) {
      await supabase
        .from("editorial_theses")
        .update({ ai_restatement: thesisSection.content })
        .eq("id", thesis.id);
    }

    const { data: brief, error: briefError } = await supabase
      .from("briefs")
      .insert({
        match_id: matchId,
        thesis_id: thesis.id,
        author_id: authorId,
        title: `${bundle.match.home_team_name} vs ${bundle.match.away_team_name} Analysis`,
        status: "draft",
      })
      .select("id")
      .single();

    if (briefError || !brief) {
      throw new Error(`Failed to insert brief: ${briefError?.message ?? "unknown"}`);
    }

    const sectionRows = validated.draft.sections.map((section, index) => ({
      brief_id: brief.id,
      section_type: section.section_type,
      sort_order: index,
      content: section.content,
      ai_generated: true,
      edited_by_human: false,
    }));

    const { error: sectionsError } = await supabase.from("brief_sections").insert(sectionRows);
    if (sectionsError) {
      throw new Error(`Failed to insert sections: ${sectionsError.message}`);
    }

    const evidenceRows = validated.draft.evidence_analysis.map((item) => {
      const { sourceTable, sourceId } = splitEvidenceSource(item.source);
      return {
        thesis_id: thesis.id,
        match_id: matchId,
        evidence_type: item.type,
        source_table: sourceTable,
        source_id: sourceId,
        content: item.content,
        supports_thesis: item.supports_thesis,
        relevance_score: 0.8,
        model,
        prompt_version: EXPLANATION_PROMPT_VERSION,
      };
    });

    const { error: evidenceError } = await supabase.from("ai_evidence").insert(evidenceRows);
    if (evidenceError) {
      throw new Error(`Failed to insert evidence: ${evidenceError.message}`);
    }

    return jsonResponse({
      success: true,
      draft_id: brief.id,
      thesis_id: thesis.id,
      prompt_version: EXPLANATION_PROMPT_VERSION,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("generate-brief error:", message);
    return jsonResponse({ error: message }, 500);
  }
});
