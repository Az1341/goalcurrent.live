import { buildRobotsTxt } from "@/lib/seo/robots-txt";
import { validateGetQuery } from "@/lib/api/response";
import { emptyQuerySchema } from "@/lib/validation/schemas";

export const runtime = "nodejs";

export function GET(request: Request) {
  const validated = validateGetQuery(request, emptyQuerySchema);
  if ("error" in validated) return validated.error;

  return new Response(buildRobotsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}