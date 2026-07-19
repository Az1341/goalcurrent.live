"use client";

import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr";
import { getSupabaseAnonKey, getSupabaseUrl, type SupabaseDatabase } from "@/lib/supabase/env";

export function createBrowserClient() {
  const url = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();
  if (!url || !anonKey) {
    throw new Error("Supabase is not configured");
  }
  return createSupabaseBrowserClient<SupabaseDatabase>(url, anonKey);
}