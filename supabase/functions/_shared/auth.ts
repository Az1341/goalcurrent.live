import { createAdminClient } from "./supabase-admin.ts";

export type AuthResult =
  | { ok: true; userId?: string; mode: "ingestion_secret" | "admin_jwt" | "editor_jwt" }
  | { ok: false; status: number; error: string };

function bearerToken(req: Request): string | null {
  const header = req.headers.get("Authorization") ?? "";
  if (!header.startsWith("Bearer ")) return null;
  const token = header.slice(7).trim();
  return token || null;
}

export async function authorizeIngestion(req: Request): Promise<AuthResult> {
  const token = bearerToken(req);
  if (!token) {
    return { ok: false, status: 401, error: "Authorization required" };
  }

  const ingestionSecret = Deno.env.get("GOALCURRENT_INGESTION_SECRET")?.trim();
  if (ingestionSecret && token === ingestionSecret) {
    return { ok: true, mode: "ingestion_secret" };
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return { ok: false, status: 401, error: "Invalid token" };
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!profile || profile.role !== "admin") {
    return { ok: false, status: 403, error: "Admin role required" };
  }

  return { ok: true, userId: data.user.id, mode: "admin_jwt" };
}

export async function authorizeEditor(req: Request): Promise<AuthResult> {
  const token = bearerToken(req);
  if (!token) {
    return { ok: false, status: 401, error: "Authorization required" };
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return { ok: false, status: 401, error: "Invalid token" };
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!profile || (profile.role !== "editor" && profile.role !== "admin")) {
    return { ok: false, status: 403, error: "Editor role required" };
  }

  return { ok: true, userId: data.user.id, mode: "editor_jwt" };
}
