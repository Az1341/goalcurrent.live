import assert from "node:assert/strict";
import { test } from "node:test";

test("validateBriefGenerationDraft accepts a complete four-section brief", async () => {
  const { validateBriefGenerationDraft } = await import("@/lib/explanation-engine/quality");

  const result = validateBriefGenerationDraft({
    sections: [
      { section_type: "thesis", content: "Argentina controlled midfield tempo through vertical passing sequences." },
      { section_type: "evidence", content: "- Higher duel win rate in central zones supported sustained pressure." },
      { section_type: "key_moment", content: "At 67' the press trap forced a turnover that opened the decisive channel." },
      { section_type: "verdict", content: "The evidence supports the thesis that midfield control decided the tie." },
    ],
    evidence_analysis: [
      {
        type: "stat",
        source: "match_statistics:abc-123",
        content: "Argentina won 58% of duels in midfield third.",
        supports_thesis: true,
      },
    ],
  });

  assert.equal(result.ok, true);
});

test("validateBriefGenerationDraft rejects missing sections", async () => {
  const { validateBriefGenerationDraft } = await import("@/lib/explanation-engine/quality");

  const result = validateBriefGenerationDraft({
    sections: [
      { section_type: "thesis", content: "Argentina controlled midfield tempo through vertical passing sequences." },
    ],
    evidence_analysis: [
      {
        type: "event",
        source: "match_events:evt-1",
        content: "Goal at 67 changed the game state.",
        supports_thesis: true,
      },
    ],
  });

  assert.equal(result.ok, false);
});

test("validateBriefGenerationDraft rejects invalid evidence source", async () => {
  const { validateBriefGenerationDraft } = await import("@/lib/explanation-engine/quality");

  const result = validateBriefGenerationDraft({
    sections: [
      { section_type: "thesis", content: "Argentina controlled midfield tempo through vertical passing sequences." },
      { section_type: "evidence", content: "- Higher duel win rate in central zones supported sustained pressure." },
      { section_type: "key_moment", content: "At 67' the press trap forced a turnover that opened the decisive channel." },
      { section_type: "verdict", content: "The evidence supports the thesis that midfield control decided the tie." },
    ],
    evidence_analysis: [
      {
        type: "stat",
        source: "ai_generated:1",
        content: "Fabricated stat should fail validation.",
        supports_thesis: true,
      },
    ],
  });

  assert.equal(result.ok, false);
});