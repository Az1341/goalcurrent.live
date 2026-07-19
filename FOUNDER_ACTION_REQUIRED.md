# Founder action required — GoalCurrent v2

External credentials and one-time setup that cannot be completed from code alone.

## 1. Supabase project

1. Sign in at [https://supabase.com/dashboard](https://supabase.com/dashboard).
2. Create a new project (recommended name: `goalcurrent-v2`) in a region close to Vercel deployment.
3. Open **Project Settings → API** and copy:
   - **Project URL** → `SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (server-only; never commit)
4. Open **SQL Editor**, paste the migration from `supabase/migrations/20260719180000_gc_v2_initial.sql`, and run it.
5. Enable **Email** auth (or your chosen provider) under **Authentication → Providers**.
6. Promote the first editorial account: after sign-up, run in SQL Editor:
   `update public.users set role = 'admin' where email = 'your@email';`

Add the keys to **Vercel → goalcurrent.live → Settings → Environment Variables** for Preview and Production.

## 2. OpenAI API

1. Sign in at [https://platform.openai.com](https://platform.openai.com).
2. Create an API key under **API keys**.
3. Confirm billing is active and `gpt-4o` (or your chosen `OPENAI_MODEL`) is available.
4. Set `OPENAI_API_KEY` and `OPENAI_MODEL` in Vercel (server-only).

## 3. Anonymous feedback secret

Generate a long random string (32+ characters) and set `GOALCURRENT_ANON_FEEDBACK_SECRET` in Vercel. Do not rotate without a migration plan for existing anonymous feedback rows.

## 4. Existing API-Football key

The live site already uses `API_FOOTBALL_KEY`. Ensure the same key is present in Supabase Edge Function secrets when ingestion functions are deployed.

---

Until the above are configured, v2 brief generation and Supabase-backed routes remain blocked in production. The existing WC26 live site continues to operate on static data and API-Football overlays.
