# GC-SEPAN-COST-STUDY-001 — Provider and Cost Study

**UK date/time:** 2026-07-20 21:44 BST  
**Access date for official URLs:** 2026-07-20  
**Status:** PROPOSED — FOUNDER APPROVAL REQUIRED

## Official sources

| Provider | URL |
|----------|-----|
| Gemini pricing | https://ai.google.dev/gemini-api/docs/pricing |
| Gemini rate limits | https://ai.google.dev/gemini-api/docs/rate-limits |
| Groq rate limits | https://console.groq.com/docs/rate-limits |
| Groq models | https://console.groq.com/docs/models |
| Groq billing | https://console.groq.com/docs/billing-faqs |
| Cloudflare Workers AI pricing | https://developers.cloudflare.com/workers-ai/platform/pricing/ |
| OpenAI API pricing | https://openai.com/api/pricing/ |

Recheck pricing before account creation or implementation.

## Comparison

| Factor | Gemini 2.5 Flash-Lite | Groq (current production models) | Cloudflare Workers AI | OpenAI low-cost API (rebuild-compatible) | Cached-only |
|--------|----------------------|-----------------------------------|------------------------|------------------------------------------|-------------|
| API vs consumer sub | API billed; ChatGPT Plus ≠ API | API | Workers AI | API; ChatGPT sub ≠ API | N/A |
| Free tier | Documented; free-tier content may improve Google products | Free-plan limits vary by model/account; org-level | Free daily allocation per current terms | Separate free/trial terms — NOT VERIFIED live | Free to serve |
| Paid pricing (pack) | $0.10/MTok in; $0.40/MTok out | Model-specific — see Groq docs | Model-specific | See OpenAI pricing page | $0 generation |
| Privacy posture | Paid tier: content not used to improve products (per pricing table); free differs | See Groq terms — Requires final owner/legal review. | See CF terms — Requires final owner/legal review. | See OpenAI terms — Requires final owner/legal review. | No new provider call |
| Rate limits | Per Gemini rate-limits doc | Per Groq rate-limits doc | Platform limits | OpenAI limits | App rate limit only |
| Model stability | Prefer non-deprecated; avoid Gemini 2.0 | Use current listed models | Model-specific | Use current listed models | N/A |
| Structured output | Suitable candidate | Suitable candidate | Varies by model | Suitable (rebuild used OpenAI) | Pre-stored |
| Latency | Expect low-cost flash class — NOT VERIFIED measured | Often low latency — NOT VERIFIED measured | Edge — NOT VERIFIED measured | NOT VERIFIED measured | Lowest |
| Pilot fit | **Primary candidate** | Optional later eval | Optional later eval | Rebuild has direct coupling — do not make permanent public contract | Always available fallback mode |

## Cost estimate (Gemini 2.5 Flash-Lite paid)

Assumptions from pack: 8,000 input + 1,500 output tokens.

| Volume | Approx USD (pre-tax/FX) |
|--------|-------------------------|
| 1 | $0.0014 |
| 25 | $0.035 |
| 100 | $0.14 |
| 250 | $0.35 |
| 1,000 | $1.40 |

Caveat: currency conversion, VAT/tax, tool calls, retries, and pricing changes apply. Planning estimate only.

## Recommended controls (proposed until Founder Approval)

- Primary: **paid** Gemini 2.5 Flash-Lite.
- Free Gemini tier only with non-personal football data + explicit founder acceptance of free-tier data-use terms — Requires final owner/legal review.
- No automatic paid fallback to another provider.
- On outage/budget block: serve cached explanations; stop new generation.
- Private test monthly ceiling: **£2**.
- Controlled public pilot monthly ceiling: **£5**.
- Warn 60%; critical 80%; stop 100%.
- Max one successful generation per match/version unless admin-authorised.
- Max 10 manual generations/day in private testing.
- Max output tokens and timeouts: propose capped output and 30–60s timeout at implementation (OPEN).

## Recommendation

Primary pilot candidate: paid Gemini 2.5 Flash-Lite for predictable cost and better privacy position than free tier. Final provider and spending ceiling require Founder Approval before any account creation or implementation.