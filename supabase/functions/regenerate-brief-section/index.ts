import OpenAI from "https://esm.sh/openai@4.104.0";
import {
  EXPLANATION_PROMPT_VERSION,
  EXPLANATION_SYSTEM_PROMPT,
  buildSectionRegenerationPrompt,
  validateSectionRegenerationDraft,
} from "../_shared/explanation-spec.ts";
import { authorizeEditor } from "../_shared/auth.ts";
import { buildMatchContext, buildSourceIndex } from "../_shared/match-context.ts";
import { jsonResponse } from "../_shared/json-response.ts";
import { createAdminClient } from "../_shared/supabase-admin.ts";

const ALLOWED_SECTIONS = new Set(["thesis", "evidence", "key_moment", "verdict"]);

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const auth = await authorizeEditor(req);
  if (!auth.ok) {
    return jsonResponse({ error: auth.error }, auth.status);
  }

  try {
    const body = await req.json();
    const briefId = body?.brief_id;
    const sectionType = body?.section_type;
    const challengeInstructions =
      typeof body?.challenge_instructions === "string" ? body.challenge_instructions : undefined;

    if (typeof briefId !== "string" || !briefId) {
      return jsonResponse({ error: "brief_id is required" }, 400);
    }
    if (typeof sectionType !== "string" || !ALLOWED_SECTIONS.has(sectionType)) {
      return jsonResponse({ error: "section_type must be thesis|evidence|key_moment|verdict" }, 400);
    }

    const supabase = createAdminClient();

    const { data: brief, error: briefError } = await supabase
      .from("briefs")
      .select("id, match_id, thesis_id, status")
      .eq("id", briefId)
      .single();

    if (briefError || !brief) {
      return jsonResponse({ error: "Brief not found" }, 404);
    }

    const { data: section, error: sectionError } = await supabase
      .from("brief_sections")
      .select("id, content")
      .eq("brief_id", briefId)
      .eq("section_type", sectionType)
      .single();

    if (sectionError || !section) {
      return jsonResponse({ error: "Section not found" }, 404);
    }

    const { data: thesis } = await supabase
      .from("editorial_theses")
      .select("thesis_text")
      .eq("id", brief.thesis_id)
      .single();

    if (!thesis) {
      return jsonResponse({ error: "Thesis not found" }, 404);
    }

    const { data: match } = await supabase
      .from("matches")
      .select("id, home_team_name, away_team_name, home_score, away_score, status")
      .eq("id", brief.match_id)
      .single();

    if (!match) {
      return jsonResponse({ error: "Match not found" }, 404);
    }

    const { data: events } = await supabase
      .from("match_events")
      .select("id, minute, minute_extra, team_name, event_type, player_name, detail")
      .eq("match_id", brief.match_id)
      .eq("is_active", true)
      .order("minute", { ascending: true });

    const { data: statistics } = await supabase
      .from("match_statistics")
      .select("id, team_id, provider_stat_name, stat_key, stat_value_raw")
      .eq("match_id", brief.match_id);

    const { data: lineups } = await supabase
      .from("match_lineups")
      .select("id, team_id, player_name, position, formation")
      .eq("match_id", brief.match_id)
      .eq("is_starter", true)
      .eq("is_active", true);

    const eventRows = events ?? [];
    const statRows = statistics ?? [];
    const lineupRows = lineups ?? [];
    const sourceIndex = buildSourceIndex(brief.match_id, eventRows, statRows, lineupRows);
    const context = buildMatchContext({
      match,
      events: eventRows,
      statistics: statRows,
      lineups: lineupRows,
      sourceIndex,
    });

    const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY") });
    const model = Deno.env.get("OPENAI_MODEL")?.trim() || "gpt-4o";

    const completion = await openai.chat.completions.create({
      model,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: EXPLANATION_SYSTEM_PROMPT },
        {
          role: "user",
          content: buildSectionRegenerationPrompt(
            sectionType,
            thesis.thesis_text,
            context,
            section.content,
            challengeInstructions,
          ),
        },
      ],
      temperature: 0.4,
    });

    const rawContent = completion.choices[0]?.message?.content;
    if (!rawContent) {
      throw new Error("OpenAI returned empty content");
    }

    const parsed = JSON.parse(rawContent);
    const validated = validateSectionRegenerationDraft(sectionType, parsed);
    if (!validated.ok) {
      throw new Error(`Section validation failed: ${validated.error}`);
    }

    const { error: updateError } = await supabase
      .from("brief_sections")
      .update({
        content: validated.content,
        ai_generated: true,
        edited_by_human: false,
      })
      .eq("id", section.id);

    if (updateError) {
      throw new Error(`Failed to update section: ${updateError.message}`);
    }

    return jsonResponse({
      success: true,
      section_id: section.id,
      prompt_version: EXPLANATION_PROMPT_VERSION,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("regenerate-brief-section error:", message);
    return jsonResponse({ error: message }, 500);
  }
});
