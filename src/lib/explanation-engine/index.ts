import { z } from "zod";
import type { ExplanationRequest, ExplanationResponse } from "@/types/domain";

const evidenceItemSchema = z.object({
  type: z.enum(["stat", "event", "lineup", "context"]),
  source: z.string().min(1),
  content: z.string().min(1),
  supports_thesis: z.boolean().nullable(),
});

export const explanationRequestSchema = z.object({
  domain: z.literal("football"),
  thesis: z.string().min(1),
  context_summary: z.string().min(1),
  evidence: z.array(evidenceItemSchema).min(1),
  tone: z.enum(["authoritative", "analytical", "explanatory"]),
});

export const explanationResponseSchema = z.object({
  sections: z.array(
    z.object({
      section_type: z.enum(["thesis", "evidence", "key_moment", "verdict"]),
      content: z.string().min(1),
    }),
  ).min(1),
  evidence_analysis: z.array(evidenceItemSchema),
});

export function validateExplanationRequest(input: unknown): ExplanationRequest {
  return explanationRequestSchema.parse(input);
}

export function validateExplanationResponse(input: unknown): ExplanationResponse {
  return explanationResponseSchema.parse(input);
}