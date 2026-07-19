import assert from "node:assert/strict";
import { describe, it } from "node:test";

describe("canonical metadata titles", async () => {
  const {
    buildStableMatchTitle,
    isUnresolvedMatchParticipantLabel,
    normalizePageTitleText,
  } = await import("@/lib/seo/canonical-titles");
  const { isInvalidAnalyticsPageTitle } = await import("@/lib/analytics/schemas");

  it("normalizes mojibake em dash sequences", () => {
    const normalized = normalizePageTitleText("Title â€” Subtitle");
    assert.match(normalized, /Title/);
    assert.doesNotMatch(normalized, /â€/);
  });

  it("uses stable fallback when bracket placeholders are present", () => {
    assert.equal(isUnresolvedMatchParticipantLabel("Winner Match 62"), true);
    const title = buildStableMatchTitle(
      "Winner Match 62",
      "Loser Match 61",
      "fixture-104",
    );
    assert.equal(title, "World Cup 2026 Match 104");
    assert.doesNotMatch(title, /Winner|Loser|TBD/);
  });

  it("rejects invalid analytics page titles", () => {
    assert.equal(isInvalidAnalyticsPageTitle("Spain vs TBD"), true);
    assert.equal(isInvalidAnalyticsPageTitle("Live Scores"), false);
  });

  it("produces deterministic titles for resolved teams", () => {
    const title = buildStableMatchTitle("Spain", "Argentina", "fixture-104");
    assert.equal(title, "Spain vs Argentina");
  });
});
