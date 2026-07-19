import { createServerClient as createSupabaseServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import {
  getSupabaseAnonKey,
  getSupabaseUrl,
  isSupabaseConfigured,
  type SupabaseDatabase,
} from "@/lib/supabase/env";

export async function createServerClient() {
  const url = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();
  if (!url || !anonKey) {
    throw new Error("Supabase is not configured");
  }

  const cookieStore = await cookies();

  return createSupabaseServerClient<SupabaseDatabase>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Components cannot always mutate cookies; Route Handlers can.
        }
      },
    },
  });
}

export async function getOptionalServerClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }
  return createServerClient();
}