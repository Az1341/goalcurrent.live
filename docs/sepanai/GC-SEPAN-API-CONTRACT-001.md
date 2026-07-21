# GC-SEPAN-API-CONTRACT-001 — Provider-Neutral Explanation Contract

**UK date/time:** 2026-07-20 21:40 BST  
**Endpoint:** POST /v1/explanations  
**Status:** PROPOSED design — not implemented on main

## Purpose

Versioned SEPANAI boundary for GoalCurrent. Provider identities (OpenAI, Gemini, Groq, Cloudflare) must not appear as permanent public contract fields.

## Authentication and actor context

- Service authentication: server-to-server (GoalCurrent backend to SEPANAI gateway) using a service credential — live values NOT VERIFIED / not created in this batch.
- Actor context: Firebase-verified user or admin id derived server-side; raw Firebase ID tokens are not forwarded to model providers.
- Authorization: only privileged editorial/automation roles may create generations; members consume published artifacts via app APIs (separate from this generation endpoint).

## Headers

| Header | Required | Notes |
|--------|----------|-------|
| Authorization | Yes | Service auth |
| Idempotency-Key | Yes | Unique per intended generation |
| X-Request-Id | Recommended | Correlation |
| Content-Type | application/json | |

## Request schema (logical)

{
  "api_version": "2026-07-20",
  "match_id": "string",
  "thesis_id": "string|null",
  "locale": "string",
  "intelligence_level": "basic",
  "force_regenerate": false,
  "actor": { "member_id": "string|null", "role": "editor|admin|system" },
  "context_ref": "string",
  "policy_profile": "pilot_basic_v1"
}

Rules: intelligence_level must be basic in pilot. force_regenerate requires admin policy and budget headroom.

## Response schema (logical)

{
  "explanation_id": "string",
  "match_id": "string",
  "status": "generated|validated|rejected|budget_blocked|provider_unavailable",
  "editorial_status": "draft|in_review|approved|published|withdrawn",
  "validation_status": "passed|failed|skipped",
  "sections": [{ "id": "string", "title": "string", "body": "string", "claims": [{"id":"string","text":"string","confidence":0.0,"evidence_ids":["string"]}]}],
  "evidence": [{ "id": "string", "type": "string", "summary": "string", "source_ref": "string" }],
  "usage": { "input_tokens": 0, "output_tokens": 0, "estimated_cost_usd": 0.0, "latency_ms": 0 },
  "provider_neutral_model_class": "flash_lite_class",
  "cache_key": "string",
  "audit_id": "string",
  "idempotency_key": "string"
}

No permanent openai_*, gemini_*, groq_*, or cloudflare_* response fields.

## Errors

Envelope: { "error": { "code": "...", "message": "...", "request_id": "...", "retryable": false } }

| Code | HTTP | Retry |
|------|------|-------|
| INVALID_REQUEST | 400 | No |
| UNAUTHENTICATED | 401 | No |
| UNAUTHORISED | 403 | No |
| MATCH_NOT_VERIFIED | 409 | No |
| DUPLICATE_REQUEST | 409 | No (return prior result) |
| GENERATION_LIMIT_REACHED | 429 | No |
| DAILY_BUDGET_REACHED | 429 | No |
| MONTHLY_BUDGET_REACHED | 429 | No |
| PROVIDER_UNAVAILABLE | 503 | Limited |
| VALIDATION_FAILED | 422 | No auto republish |
| GENERATION_DISABLED | 503 | No |
| INTERNAL_ERROR | 500 | Limited |

## Behaviour

- Timeout: propose 30-60s generation timeout (OPEN until implementation).
- Retry: idempotent retries with same Idempotency-Key only; no silent provider cascade.
- Circuit breaker: open on repeated PROVIDER_UNAVAILABLE; serve cache path in app.
- Versioning: api_version + URL /v1; additive fields preferred; breaking changes require /v2.
- Backward compatibility: clients ignore unknown fields.
- Audit: every call writes ai_generation_audit and cost ledger entry when generation attempted.