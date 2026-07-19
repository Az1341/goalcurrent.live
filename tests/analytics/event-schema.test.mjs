import assert from "node:assert/strict";
import { describe, it } from "node:test";

describe("GA4 event schemas", async () => {
  const { validateEventParams } = await import("@/lib/analytics/schemas");

  const baseMatch = {
    match_id: "fixture-104",
    competition: "FIFA World Cup 2026",
    home_team: "Spain",
    away_team: "Argentina",
    match_status: "finished",
    source_surface: "match_centre",
    language: "en",
  };

  it("accepts match_open with required parameters", () => {
    const result = validateEventParams("match_open", baseMatch);
    assert.equal(result.ok, true);
  });

  it("rejects PII-like email in parameters", () => {
    const result = validateEventParams("match_open", {
      ...baseMatch,
      home_team: "user@example.com",
    });
    assert.equal(result.ok, false);
  });

  it("validates subscription_complete", () => {
    const result = validateEventParams("subscription_complete", {
      transaction_id: "txn_123",
      plan_id: "pro_monthly",
      plan_name: "Pro",
      billing_period: "monthly",
      currency: "GBP",
      value: 9.99,
    });
    assert.equal(result.ok, true);
  });

  it("validates affiliate_click without match_id", () => {
    const result = validateEventParams("affiliate_click", {
      partner_id: "nordvpn",
      partner_name: "NordVPN",
      offer_id: "15",
      offer_type: "vpn_affiliate",
      destination_domain: "go.nordvpn.net",
      source_surface: "footer_nordvpn",
    });
    assert.equal(result.ok, true);
  });
});
