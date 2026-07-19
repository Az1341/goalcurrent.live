import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function write(rel, content) {
  const file = path.join(root, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, "utf8");
  console.log("wrote", rel);
}

write(
  "supabase/migrations/20260719180000_gc_v2_initial.sql",
  `-- GoalCurrent v2 initial schema (corrected vs z.ai package)
-- Migration: 20260719180000_gc_v2_initial

create extension if not exists "pgcrypto";

create type public.match_status as enum (
  'unknown',
  'not_started',
  'in_play',
  'paused',
  'finished',
  'extra_time',
  'penalties',
  'postponed',
  'cancelled',
  'suspended',
  'interrupted',
  'abandoned',
  'awarded',
  'walkover'
);

create type public.brief_status as enum ('draft', 'in_review', 'published', 'archived');
create type public.section_type as enum ('thesis', 'evidence', 'key_moment', 'verdict');
create type public.feedback_type as enum (
  'learned_something',
  'disagree',
  'too_obvious',
  'too_technical',
  'too_long'
);
create type public.user_role as enum ('reader', 'editor', 'admin');

create or replace function public.is_editor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users
    where id = auth.uid()
      and role in ('editor', 'admin')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users
    where id = auth.uid()
      and role = 'admin'
  );
$$;

revoke all on function public.is_editor() from public;
revoke all on function public.is_admin() from public;
grant execute on function public.is_editor() to authenticated, anon;
grant execute on function public.is_admin() to authenticated, anon;

create table public.competitions (
  id integer primary key,
  name text not null,
  country text,
  logo_url text,
  flag_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.teams (
  id integer primary key,
  name text not null,
  logo_url text,
  country text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.venues (
  id integer primary key,
  name text not null,
  city text,
  country text,
  capacity integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  display_name text,
  role public.user_role not null default 'reader',
  favourite_team_ids integer[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.matches (
  id integer primary key,
  local_fixture_id text unique,
  competition_id integer not null references public.competitions (id),
  season integer not null,
  round text,
  home_team_id integer not null references public.teams (id),
  away_team_id integer not null references public.teams (id),
  home_team_name text not null,
  away_team_name text not null,
  home_team_logo text,
  away_team_logo text,
  venue_id integer references public.venues (id),
  venue_name text,
  venue_city text,
  referee text,
  kickoff_time timestamptz not null,
  api_status_short text,
  api_status_long text,
  status public.match_status not null default 'unknown',
  elapsed_minute integer,
  extra_minute integer,
  home_score integer,
  away_score integer,
  halftime_home_score integer,
  halftime_away_score integer,
  fulltime_home_score integer,
  fulltime_away_score integer,
  extratime_home_score integer,
  extratime_away_score integer,
  penalty_home_score integer,
  penalty_away_score integer,
  winner_team_id integer references public.teams (id),
  provider_updated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint matches_home_away_distinct check (home_team_id <> away_team_id)
);

create index idx_matches_kickoff on public.matches (kickoff_time desc);
create index idx_matches_status on public.matches (status);
create index idx_matches_local_fixture on public.matches (local_fixture_id);
create index idx_matches_finished on public.matches (status) where status = 'finished';

create table public.match_events (
  id uuid primary key default gen_random_uuid(),
  match_id integer not null references public.matches (id) on delete cascade,
  event_fingerprint text not null,
  api_event_id integer,
  team_id integer references public.teams (id),
  team_name text,
  event_type text not null,
  minute integer not null,
  minute_extra integer not null default 0,
  player_name text,
  player_id integer,
  assist_name text,
  assist_id integer,
  detail text,
  comments text,
  is_active boolean not null default true,
  provider_payload jsonb,
  created_at timestamptz not null default now(),
  unique (match_id, event_fingerprint)
);

create index idx_events_match on public.match_events (match_id);
create index idx_events_match_minute on public.match_events (match_id, minute, minute_extra);

create table public.match_statistics (
  id uuid primary key default gen_random_uuid(),
  match_id integer not null references public.matches (id) on delete cascade,
  team_id integer not null references public.teams (id),
  provider_stat_name text not null,
  stat_key text not null,
  stat_value_raw text not null,
  stat_value_numeric numeric,
  unit text,
  provider_updated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (match_id, team_id, provider_stat_name)
);

create index idx_stats_match on public.match_statistics (match_id);
create index idx_stats_match_team on public.match_statistics (match_id, team_id);

create table public.match_lineups (
  id uuid primary key default gen_random_uuid(),
  match_id integer not null references public.matches (id) on delete cascade,
  team_id integer not null references public.teams (id),
  player_id integer not null,
  player_name text not null,
  shirt_number integer,
  position text,
  grid_position text,
  formation text,
  coach_name text,
  is_starter boolean not null default true,
  is_active boolean not null default true,
  provider_updated_at timestamptz,
  created_at timestamptz not null default now(),
  unique (match_id, team_id, player_id, is_starter)
);

create index idx_lineups_match on public.match_lineups (match_id);
create index idx_lineups_match_team on public.match_lineups (match_id, team_id);

create table public.editorial_theses (
  id uuid primary key default gen_random_uuid(),
  match_id integer not null references public.matches (id) on delete cascade,
  author_id uuid not null references public.users (id),
  thesis_text text not null,
  original_thesis_text text not null,
  ai_restatement text,
  angle_tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_theses_match on public.editorial_theses (match_id);
create index idx_theses_author on public.editorial_theses (author_id);

create table public.ai_evidence (
  id uuid primary key default gen_random_uuid(),
  thesis_id uuid not null references public.editorial_theses (id) on delete cascade,
  match_id integer not null references public.matches (id) on delete cascade,
  evidence_type text not null,
  source_table text not null,
  source_id text,
  content text not null,
  supports_thesis boolean,
  relevance_score real not null default 0.5,
  model text,
  prompt_version text,
  created_at timestamptz not null default now()
);

create index idx_evidence_thesis on public.ai_evidence (thesis_id);
create index idx_evidence_match on public.ai_evidence (match_id);

create table public.briefs (
  id uuid primary key default gen_random_uuid(),
  match_id integer not null references public.matches (id) on delete cascade,
  thesis_id uuid references public.editorial_theses (id) on delete set null,
  author_id uuid not null references public.users (id),
  publisher_id uuid references public.users (id),
  title text not null,
  subtitle text,
  status public.brief_status not null default 'draft',
  read_time_minutes integer not null default 3,
  slug text unique,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_briefs_status on public.briefs (status);
create index idx_briefs_published on public.briefs (published_at desc) where status = 'published';
create index idx_briefs_match on public.briefs (match_id);
create index idx_briefs_slug on public.briefs (slug);

create table public.brief_sections (
  id uuid primary key default gen_random_uuid(),
  brief_id uuid not null references public.briefs (id) on delete cascade,
  section_type public.section_type not null,
  sort_order integer not null default 0,
  content text not null,
  ai_generated boolean not null default true,
  edited_by_human boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (brief_id, section_type)
);

create index idx_sections_brief on public.brief_sections (brief_id);
create index idx_sections_brief_order on public.brief_sections (brief_id, sort_order);

create table public.brief_feedback (
  id uuid primary key default gen_random_uuid(),
  brief_id uuid not null references public.briefs (id) on delete cascade,
  section_id uuid not null references public.brief_sections (id) on delete cascade,
  user_id uuid references public.users (id),
  anonymous_identity text,
  feedback_type public.feedback_type not null,
  comment text,
  created_at timestamptz not null default now(),
  constraint brief_feedback_identity_required check (
    user_id is not null or anonymous_identity is not null
  )
);

create unique index brief_feedback_user_unique
  on public.brief_feedback (section_id, user_id)
  where user_id is not null;

create unique index brief_feedback_anon_unique
  on public.brief_feedback (section_id, anonymous_identity)
  where anonymous_identity is not null;

create index idx_feedback_brief on public.brief_feedback (brief_id);
create index idx_feedback_section on public.brief_feedback (section_id);
create index idx_feedback_type on public.brief_feedback (feedback_type);

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at_users
  before update on public.users
  for each row execute function public.handle_updated_at();

create trigger set_updated_at_competitions
  before update on public.competitions
  for each row execute function public.handle_updated_at();

create trigger set_updated_at_teams
  before update on public.teams
  for each row execute function public.handle_updated_at();

create trigger set_updated_at_venues
  before update on public.venues
  for each row execute function public.handle_updated_at();

create trigger set_updated_at_matches
  before update on public.matches
  for each row execute function public.handle_updated_at();

create trigger set_updated_at_match_statistics
  before update on public.match_statistics
  for each row execute function public.handle_updated_at();

create trigger set_updated_at_briefs
  before update on public.briefs
  for each row execute function public.handle_updated_at();

create trigger set_updated_at_brief_sections
  before update on public.brief_sections
  for each row execute function public.handle_updated_at();

create trigger set_updated_at_editorial_theses
  before update on public.editorial_theses
  for each row execute function public.handle_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, display_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(
      new.raw_user_meta_data ->> 'display_name',
      new.raw_user_meta_data ->> 'full_name',
      split_part(coalesce(new.email, ''), '@', 1)
    )
  )
  on conflict (id) do update
    set email = excluded.email,
        updated_at = now();

  return new;
end;
$$;

revoke all on function public.handle_new_user() from public;
grant execute on function public.handle_new_user() to supabase_auth_admin;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.users enable row level security;
alter table public.competitions enable row level security;
alter table public.teams enable row level security;
alter table public.venues enable row level security;
alter table public.matches enable row level security;
alter table public.match_events enable row level security;
alter table public.match_statistics enable row level security;
alter table public.match_lineups enable row level security;
alter table public.editorial_theses enable row level security;
alter table public.ai_evidence enable row level security;
alter table public.briefs enable row level security;
alter table public.brief_sections enable row level security;
alter table public.brief_feedback enable row level security;

create policy users_select_own on public.users
  for select using (auth.uid() = id or public.is_admin());

create policy users_update_own on public.users
  for update using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = (select u.role from public.users u where u.id = auth.uid())
  );

create policy users_admin_manage_roles on public.users
  for update using (public.is_admin())
  with check (public.is_admin());

create policy competitions_public_read on public.competitions
  for select using (true);

create policy teams_public_read on public.teams
  for select using (true);

create policy venues_public_read on public.venues
  for select using (true);

create policy matches_public_read on public.matches
  for select using (true);

create policy events_public_read on public.match_events
  for select using (true);

create policy stats_public_read on public.match_statistics
  for select using (true);

create policy lineups_public_read on public.match_lineups
  for select using (true);

create policy briefs_public_read on public.briefs
  for select using (status = 'published');

create policy briefs_editor_read on public.briefs
  for select using (public.is_editor());

create policy briefs_editor_write on public.briefs
  for all using (public.is_editor())
  with check (public.is_editor());

create policy sections_public_read on public.brief_sections
  for select using (
    exists (
      select 1
      from public.briefs b
      where b.id = brief_id
        and b.status = 'published'
    )
  );

create policy sections_editor_write on public.brief_sections
  for all using (public.is_editor())
  with check (public.is_editor());

create policy feedback_read_public on public.brief_feedback
  for select using (
    exists (
      select 1
      from public.brief_sections bs
      join public.briefs b on b.id = bs.brief_id
      where bs.id = section_id
        and b.status = 'published'
    )
  );

create policy feedback_insert_authenticated on public.brief_feedback
  for insert
  with check (
    user_id is not null
    and auth.uid() = user_id
    and anonymous_identity is null
    and exists (
      select 1
      from public.brief_sections bs
      join public.briefs b on b.id = bs.brief_id
      where bs.id = section_id
        and bs.brief_id = brief_id
        and b.status = 'published'
    )
  );

create policy theses_editor_all on public.editorial_theses
  for all using (public.is_editor())
  with check (public.is_editor());

create policy evidence_editor_all on public.ai_evidence
  for all using (public.is_editor())
  with check (public.is_editor());
`,
);

write(
  "src/types/database.ts",
  `/** Supabase Database types for GoalCurrent v2 (matches 20260719180000_gc_v2_initial). */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type MatchStatus =
  | "unknown"
  | "not_started"
  | "in_play"
  | "paused"
  | "finished"
  | "extra_time"
  | "penalties"
  | "postponed"
  | "cancelled"
  | "suspended"
  | "interrupted"
  | "abandoned"
  | "awarded"
  | "walkover";

export type BriefStatus = "draft" | "in_review" | "published" | "archived";
export type SectionType = "thesis" | "evidence" | "key_moment" | "verdict";
export type FeedbackType =
  | "learned_something"
  | "disagree"
  | "too_obvious"
  | "too_technical"
  | "too_long";
export type UserRole = "reader" | "editor" | "admin";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          role: UserRole;
          favourite_team_ids: number[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          role?: UserRole;
          favourite_team_ids?: number[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string;
          display_name?: string | null;
          role?: UserRole;
          favourite_team_ids?: number[];
          updated_at?: string;
        };
        Relationships: [];
      };
      competitions: {
        Row: {
          id: number;
          name: string;
          country: string | null;
          logo_url: string | null;
          flag_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: number;
          name: string;
          country?: string | null;
          logo_url?: string | null;
          flag_url?: string | null;
        };
        Update: {
          name?: string;
          country?: string | null;
          logo_url?: string | null;
          flag_url?: string | null;
        };
        Relationships: [];
      };
      teams: {
        Row: {
          id: number;
          name: string;
          logo_url: string | null;
          country: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: number;
          name: string;
          logo_url?: string | null;
          country?: string | null;
        };
        Update: {
          name?: string;
          logo_url?: string | null;
          country?: string | null;
        };
        Relationships: [];
      };
      venues: {
        Row: {
          id: number;
          name: string;
          city: string | null;
          country: string | null;
          capacity: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: number;
          name: string;
          city?: string | null;
          country?: string | null;
          capacity?: number | null;
        };
        Update: {
          name?: string;
          city?: string | null;
          country?: string | null;
          capacity?: number | null;
        };
        Relationships: [];
      };
      matches: {
        Row: {
          id: number;
          local_fixture_id: string | null;
          competition_id: number;
          season: number;
          round: string | null;
          home_team_id: number;
          away_team_id: number;
          home_team_name: string;
          away_team_name: string;
          home_team_logo: string | null;
          away_team_logo: string | null;
          venue_id: number | null;
          venue_name: string | null;
          venue_city: string | null;
          referee: string | null;
          kickoff_time: string;
          api_status_short: string | null;
          api_status_long: string | null;
          status: MatchStatus;
          elapsed_minute: number | null;
          extra_minute: number | null;
          home_score: number | null;
          away_score: number | null;
          halftime_home_score: number | null;
          halftime_away_score: number | null;
          fulltime_home_score: number | null;
          fulltime_away_score: number | null;
          extratime_home_score: number | null;
          extratime_away_score: number | null;
          penalty_home_score: number | null;
          penalty_away_score: number | null;
          winner_team_id: number | null;
          provider_updated_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: number;
          local_fixture_id?: string | null;
          competition_id: number;
          season: number;
          round?: string | null;
          home_team_id: number;
          away_team_id: number;
          home_team_name: string;
          away_team_name: string;
          home_team_logo?: string | null;
          away_team_logo?: string | null;
          venue_id?: number | null;
          venue_name?: string | null;
          venue_city?: string | null;
          referee?: string | null;
          kickoff_time: string;
          api_status_short?: string | null;
          api_status_long?: string | null;
          status?: MatchStatus;
          elapsed_minute?: number | null;
          extra_minute?: number | null;
          home_score?: number | null;
          away_score?: number | null;
          halftime_home_score?: number | null;
          halftime_away_score?: number | null;
          fulltime_home_score?: number | null;
          fulltime_away_score?: number | null;
          extratime_home_score?: number | null;
          extratime_away_score?: number | null;
          penalty_home_score?: number | null;
          penalty_away_score?: number | null;
          winner_team_id?: number | null;
          provider_updated_at?: string | null;
        };
        Update: {
          local_fixture_id?: string | null;
          competition_id?: number;
          season?: number;
          round?: string | null;
          home_team_id?: number;
          away_team_id?: number;
          home_team_name?: string;
          away_team_name?: string;
          home_team_logo?: string | null;
          away_team_logo?: string | null;
          venue_id?: number | null;
          venue_name?: string | null;
          venue_city?: string | null;
          referee?: string | null;
          kickoff_time?: string;
          api_status_short?: string | null;
          api_status_long?: string | null;
          status?: MatchStatus;
          elapsed_minute?: number | null;
          extra_minute?: number | null;
          home_score?: number | null;
          away_score?: number | null;
          halftime_home_score?: number | null;
          halftime_away_score?: number | null;
          fulltime_home_score?: number | null;
          fulltime_away_score?: number | null;
          extratime_home_score?: number | null;
          extratime_away_score?: number | null;
          penalty_home_score?: number | null;
          penalty_away_score?: number | null;
          winner_team_id?: number | null;
          provider_updated_at?: string | null;
        };
        Relationships: [];
      };
      match_events: {
        Row: {
          id: string;
          match_id: number;
          event_fingerprint: string;
          api_event_id: number | null;
          team_id: number | null;
          team_name: string | null;
          event_type: string;
          minute: number;
          minute_extra: number;
          player_name: string | null;
          player_id: number | null;
          assist_name: string | null;
          assist_id: number | null;
          detail: string | null;
          comments: string | null;
          is_active: boolean;
          provider_payload: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          match_id: number;
          event_fingerprint: string;
          api_event_id?: number | null;
          team_id?: number | null;
          team_name?: string | null;
          event_type: string;
          minute: number;
          minute_extra?: number;
          player_name?: string | null;
          player_id?: number | null;
          assist_name?: string | null;
          assist_id?: number | null;
          detail?: string | null;
          comments?: string | null;
          is_active?: boolean;
          provider_payload?: Json | null;
        };
        Update: {
          event_fingerprint?: string;
          api_event_id?: number | null;
          team_id?: number | null;
          team_name?: string | null;
          event_type?: string;
          minute?: number;
          minute_extra?: number;
          player_name?: string | null;
          player_id?: number | null;
          assist_name?: string | null;
          assist_id?: number | null;
          detail?: string | null;
          comments?: string | null;
          is_active?: boolean;
          provider_payload?: Json | null;
        };
        Relationships: [];
      };
      match_statistics: {
        Row: {
          id: string;
          match_id: number;
          team_id: number;
          provider_stat_name: string;
          stat_key: string;
          stat_value_raw: string;
          stat_value_numeric: number | null;
          unit: string | null;
          provider_updated_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          match_id: number;
          team_id: number;
          provider_stat_name: string;
          stat_key: string;
          stat_value_raw: string;
          stat_value_numeric?: number | null;
          unit?: string | null;
          provider_updated_at?: string | null;
        };
        Update: {
          provider_stat_name?: string;
          stat_key?: string;
          stat_value_raw?: string;
          stat_value_numeric?: number | null;
          unit?: string | null;
          provider_updated_at?: string | null;
        };
        Relationships: [];
      };
      match_lineups: {
        Row: {
          id: string;
          match_id: number;
          team_id: number;
          player_id: number;
          player_name: string;
          shirt_number: number | null;
          position: string | null;
          grid_position: string | null;
          formation: string | null;
          coach_name: string | null;
          is_starter: boolean;
          is_active: boolean;
          provider_updated_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          match_id: number;
          team_id: number;
          player_id: number;
          player_name: string;
          shirt_number?: number | null;
          position?: string | null;
          grid_position?: string | null;
          formation?: string | null;
          coach_name?: string | null;
          is_starter?: boolean;
          is_active?: boolean;
          provider_updated_at?: string | null;
        };
        Update: {
          player_name?: string;
          shirt_number?: number | null;
          position?: string | null;
          grid_position?: string | null;
          formation?: string | null;
          coach_name?: string | null;
          is_starter?: boolean;
          is_active?: boolean;
          provider_updated_at?: string | null;
        };
        Relationships: [];
      };
      editorial_theses: {
        Row: {
          id: string;
          match_id: number;
          author_id: string;
          thesis_text: string;
          original_thesis_text: string;
          ai_restatement: string | null;
          angle_tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          match_id: number;
          author_id: string;
          thesis_text: string;
          original_thesis_text: string;
          ai_restatement?: string | null;
          angle_tags?: string[];
        };
        Update: {
          thesis_text?: string;
          original_thesis_text?: string;
          ai_restatement?: string | null;
          angle_tags?: string[];
        };
        Relationships: [];
      };
      ai_evidence: {
        Row: {
          id: string;
          thesis_id: string;
          match_id: number;
          evidence_type: string;
          source_table: string;
          source_id: string | null;
          content: string;
          supports_thesis: boolean | null;
          relevance_score: number;
          model: string | null;
          prompt_version: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          thesis_id: string;
          match_id: number;
          evidence_type: string;
          source_table: string;
          source_id?: string | null;
          content: string;
          supports_thesis?: boolean | null;
          relevance_score?: number;
          model?: string | null;
          prompt_version?: string | null;
        };
        Update: {
          evidence_type?: string;
          source_table?: string;
          source_id?: string | null;
          content?: string;
          supports_thesis?: boolean | null;
          relevance_score?: number;
          model?: string | null;
          prompt_version?: string | null;
        };
        Relationships: [];
      };
      briefs: {
        Row: {
          id: string;
          match_id: number;
          thesis_id: string | null;
          author_id: string;
          publisher_id: string | null;
          title: string;
          subtitle: string | null;
          status: BriefStatus;
          read_time_minutes: number;
          slug: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          match_id: number;
          thesis_id?: string | null;
          author_id: string;
          publisher_id?: string | null;
          title: string;
          subtitle?: string | null;
          status?: BriefStatus;
          read_time_minutes?: number;
          slug?: string | null;
          published_at?: string | null;
        };
        Update: {
          thesis_id?: string | null;
          author_id?: string;
          publisher_id?: string | null;
          title?: string;
          subtitle?: string | null;
          status?: BriefStatus;
          read_time_minutes?: number;
          slug?: string | null;
          published_at?: string | null;
        };
        Relationships: [];
      };
      brief_sections: {
        Row: {
          id: string;
          brief_id: string;
          section_type: SectionType;
          sort_order: number;
          content: string;
          ai_generated: boolean;
          edited_by_human: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          brief_id: string;
          section_type: SectionType;
          sort_order?: number;
          content: string;
          ai_generated?: boolean;
          edited_by_human?: boolean;
        };
        Update: {
          section_type?: SectionType;
          sort_order?: number;
          content?: string;
          ai_generated?: boolean;
          edited_by_human?: boolean;
        };
        Relationships: [];
      };
      brief_feedback: {
        Row: {
          id: string;
          brief_id: string;
          section_id: string;
          user_id: string | null;
          anonymous_identity: string | null;
          feedback_type: FeedbackType;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          brief_id: string;
          section_id: string;
          user_id?: string | null;
          anonymous_identity?: string | null;
          feedback_type: FeedbackType;
          comment?: string | null;
        };
        Update: {
          feedback_type?: FeedbackType;
          comment?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_editor: { Args: Record<string, never>; Returns: boolean };
      is_admin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: {
      match_status: MatchStatus;
      brief_status: BriefStatus;
      section_type: SectionType;
      feedback_type: FeedbackType;
      user_role: UserRole;
    };
    CompositeTypes: Record<string, never>;
  };
}
`,
);

write(
  "src/types/domain.ts",
  `/** GoalCurrent v2 domain types (runtime-neutral). */

import type {
  BriefStatus,
  FeedbackType,
  MatchStatus,
  SectionType,
  UserRole,
} from "@/types/database";

export type { BriefStatus, FeedbackType, MatchStatus, SectionType, UserRole };

export type EvidenceItem = {
  readonly type: "stat" | "event" | "lineup" | "context";
  readonly source: string;
  readonly content: string;
  readonly supports_thesis: boolean | null;
};

export type ExplanationRequest = {
  readonly domain: "football";
  readonly thesis: string;
  readonly context_summary: string;
  readonly evidence: readonly EvidenceItem[];
  readonly tone: "authoritative" | "analytical" | "explanatory";
};

export type ExplanationSection = {
  readonly section_type: SectionType;
  readonly content: string;
};

export type ExplanationResponse = {
  readonly sections: readonly ExplanationSection[];
  readonly evidence_analysis: readonly EvidenceItem[];
};

export type MatchIdentity = {
  readonly apiFixtureId: number;
  readonly localFixtureId: string | null;
  readonly homeTeamId: number;
  readonly awayTeamId: number;
  readonly homeTeamName: string;
  readonly awayTeamName: string;
  readonly kickoffUtc: string;
};

export type MatchScoreContext = {
  readonly status: MatchStatus;
  readonly apiStatusShort: string | null;
  readonly apiStatusLong: string | null;
  readonly elapsedMinute: number | null;
  readonly extraMinute: number | null;
  readonly homeScore: number | null;
  readonly awayScore: number | null;
  readonly halftimeHomeScore: number | null;
  readonly halftimeAwayScore: number | null;
  readonly fulltimeHomeScore: number | null;
  readonly fulltimeAwayScore: number | null;
  readonly extratimeHomeScore: number | null;
  readonly extratimeAwayScore: number | null;
  readonly penaltyHomeScore: number | null;
  readonly penaltyAwayScore: number | null;
  readonly winnerTeamId: number | null;
};

export type BriefSummary = {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly subtitle: string | null;
  readonly thesisExcerpt: string;
  readonly readTimeMinutes: number;
  readonly publishedAt: string | null;
  readonly feedbackCount: number;
  readonly match: MatchIdentity;
  readonly score: MatchScoreContext;
};

export type BriefSectionView = {
  readonly id: string;
  readonly sectionType: SectionType;
  readonly sortOrder: number;
  readonly content: string;
  readonly aiGenerated: boolean;
  readonly editedByHuman: boolean;
};

export type BriefDetail = BriefSummary & {
  readonly sections: readonly BriefSectionView[];
  readonly status: BriefStatus;
};

export type FeedbackSubmission = {
  readonly briefId: string;
  readonly sectionId: string;
  readonly feedbackType: FeedbackType;
  readonly comment?: string | null;
};

export type AnonymousFeedbackIdentity = {
  /** HMAC-SHA256 hex digest: sectionId + browser token + secret (server only). */
  readonly anonymousIdentity: string;
  readonly browserToken: string;
};

export type EditorialThesisInput = {
  readonly matchId: number;
  readonly thesisText: string;
  readonly angleTags?: readonly string[];
};

export type EventFingerprintInput = {
  readonly matchId: number;
  readonly teamId: number | null;
  readonly minute: number;
  readonly minuteExtra: number;
  readonly eventType: string;
  readonly detail: string | null;
  readonly playerId: number | null;
  readonly assistId: number | null;
};
`,
);

const envAppend = `
# ── GoalCurrent v2 (Supabase + intelligence briefs) ─────────────────────────
# Supabase project URL (same value for server and browser where noted).
SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_ANON_KEY=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
# Server-only. Never expose to the client bundle.
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI — brief generation (server-only)
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o

# Editorial calendar timezone for "Today's Explanation" (IANA, default Europe/London)
GOALCURRENT_EDITORIAL_TIMEZONE=Europe/London

# Server-only HMAC secret for anonymous feedback identity hashing
GOALCURRENT_ANON_FEEDBACK_SECRET=
`;

const envPath = path.join(root, ".env.example");
const envExisting = fs.readFileSync(envPath, "utf8");
if (!envExisting.includes("SUPABASE_URL=")) {
  fs.writeFileSync(envPath, envExisting.trimEnd() + envAppend, "utf8");
  console.log("updated .env.example");
} else {
  console.log(".env.example already contains Supabase vars");
}

write(
  "FOUNDER_ACTION_REQUIRED.md",
  `# Founder action required — GoalCurrent v2

External credentials and one-time setup that cannot be completed from code alone.

## 1. Supabase project

1. Sign in at [https://supabase.com/dashboard](https://supabase.com/dashboard).
2. Create a new project (recommended name: \`goalcurrent-v2\`) in a region close to Vercel deployment.
3. Open **Project Settings → API** and copy:
   - **Project URL** → \`SUPABASE_URL\` and \`NEXT_PUBLIC_SUPABASE_URL\`
   - **anon public** key → \`SUPABASE_ANON_KEY\` and \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`
   - **service_role** key → \`SUPABASE_SERVICE_ROLE_KEY\` (server-only; never commit)
4. Open **SQL Editor**, paste the migration from \`supabase/migrations/20260719180000_gc_v2_initial.sql\`, and run it.
5. Enable **Email** auth (or your chosen provider) under **Authentication → Providers**.
6. Promote the first editorial account: after sign-up, run in SQL Editor:
   \`update public.users set role = 'admin' where email = 'your@email';\`

Add the keys to **Vercel → goalcurrent.live → Settings → Environment Variables** for Preview and Production.

## 2. OpenAI API

1. Sign in at [https://platform.openai.com](https://platform.openai.com).
2. Create an API key under **API keys**.
3. Confirm billing is active and \`gpt-4o\` (or your chosen \`OPENAI_MODEL\`) is available.
4. Set \`OPENAI_API_KEY\` and \`OPENAI_MODEL\` in Vercel (server-only).

## 3. Anonymous feedback secret

Generate a long random string (32+ characters) and set \`GOALCURRENT_ANON_FEEDBACK_SECRET\` in Vercel. Do not rotate without a migration plan for existing anonymous feedback rows.

## 4. Existing API-Football key

The live site already uses \`API_FOOTBALL_KEY\`. Ensure the same key is present in Supabase Edge Function secrets when ingestion functions are deployed.

---

Until the above are configured, v2 brief generation and Supabase-backed routes remain blocked in production. The existing WC26 live site continues to operate on static data and API-Football overlays.
`,
);

write(
  "docs/implementation/GC-V2-DATA-CONTRACT.md",
  `# GC-V2 Data Contract

**Document:** GC-V2-DATA-CONTRACT  
**Branch:** \`goalcurrent-v2-rebuild\`  
**Migration:** \`20260719180000_gc_v2_initial.sql\`

Field-level contracts for GoalCurrent v2 intelligence data. The existing WC26 SSOT (\`src/data/wc26/*\`, \`fixture-NNN\` slugs) remains for live pages until ingestion is proven; Supabase stores the canonical API-Football identity.

---

## 1. Canonical fixture identity

| Field | Type | Rule |
|-------|------|------|
| \`matches.id\` | \`integer\` PK | API-Football \`fixture.id\` — **canonical** |
| \`matches.local_fixture_id\` | \`text\` unique nullable | Bridge to existing slugs, e.g. \`fixture-104\` |
| \`matches.home_team_id\` / \`away_team_id\` | \`integer\` FK → \`teams.id\` | Never infer from names or array order |
| \`matches.competition_id\` | \`integer\` FK → \`competitions.id\` | API league id |

**Invariant:** Every brief, event, statistic, lineup row, and feedback record resolves to the same \`matches.id\`. URL routes may display \`local_fixture_id\` but must resolve to the API integer before any write.

**Bridge rule:** Populate \`local_fixture_id\` explicitly from \`src/lib/wc26-fixture-match.ts\` / overlay logic — never derive from kickoff date or fixture list index.

---

## 2. Match status and scores

### Raw provider fields (always stored)

- \`api_status_short\` — e.g. \`1H\`, \`2H\`, \`FT\`, \`AET\`, \`PEN\`, \`PST\`
- \`api_status_long\` — provider long label
- \`elapsed_minute\`, \`extra_minute\`

### Normalised enum \`match_status\`

\`unknown\` | \`not_started\` | \`in_play\` | \`paused\` | \`finished\` | \`extra_time\` | \`penalties\` | \`postponed\` | \`cancelled\` | \`suspended\` | \`interrupted\` | \`abandoned\` | \`awarded\` | \`walkover\`

**Rules:**

1. Unknown API codes map to \`unknown\`, not \`not_started\`.
2. Raw short/long values are always persisted even when normalised.
3. \`provider_updated_at\` is set on every successful ingestion upsert.

### Score columns (all nullable until known)

| Column | Meaning |
|--------|---------|
| \`home_score\` / \`away_score\` | Current displayed score |
| \`halftime_*\` | Half-time |
| \`fulltime_*\` | End of 90 minutes |
| \`extratime_*\` | After extra time |
| \`penalty_*\` | Shootout only |
| \`winner_team_id\` | API \`teams.*.winner\` when supplied |

Public UI must show penalties and extra time when \`status\` is \`penalties\` or \`extra_time\`.

---

## 3. Event fingerprint

API-Football may omit stable \`api_event_id\`. Identity is:

\`\`\`text
event_fingerprint = SHA-256 hex of JSON tuple:
  [match_id, team_id, minute, minute_extra, event_type, detail, player_id, assist_id]
\`\`\`

- Unique constraint: \`(match_id, event_fingerprint)\`
- Ingestion upserts by fingerprint; events missing from latest payload are marked \`is_active = false\`
- Optional \`provider_payload\` stores raw event JSON for diagnosis

---

## 4. Brief lifecycle

| Status | Meaning | Public visible |
|--------|---------|----------------|
| \`draft\` | Generated or edited, not reviewed | No |
| \`in_review\` | Ready for editorial QA | No |
| \`published\` | Live on site | Yes |
| \`archived\` | Retired canonical URL may 404 or redirect | No |

**Transitions (server-enforced):**

- \`draft\` → \`in_review\` — editor save with all four sections present
- \`in_review\` → \`published\` — requires title, slug, match, thesis, publisher_id, \`published_at\`, quality validation
- \`published\` → \`archived\` — admin/editor unpublish
- \`archived\` → \`draft\` — admin reopen

Each brief has exactly one row per \`section_type\`: \`thesis\`, \`evidence\`, \`key_moment\`, \`verdict\`.

---

## 5. Feedback and anonymous identity

### Authenticated users

- \`user_id = auth.uid()\`, \`anonymous_identity IS NULL\`
- Partial unique index: \`(section_id, user_id) WHERE user_id IS NOT NULL\`

### Anonymous users

- Server API route validates published brief + section ownership
- \`anonymous_identity = HMAC-SHA256(GOALCURRENT_ANON_FEEDBACK_SECRET, section_id + browser_token)\`
- \`browser_token\` — random UUID stored in \`httpOnly\` cookie or returned once on first visit
- Partial unique index: \`(section_id, anonymous_identity) WHERE anonymous_identity IS NOT NULL\`
- Inserts use service role after HMAC verification (RLS bypass)

**Prohibited:** client-supplied \`user_id\`; trusting \`brief_id\` without verifying \`section_id\` belongs to that brief; exposing raw \`anonymous_identity\` or \`browser_token\` in public APIs.

---

## 6. Editorial timezone

Environment variable: \`GOALCURRENT_EDITORIAL_TIMEZONE\` (IANA, default \`Europe/London\`).

Used for:

- "Today's Explanation" featured brief selection
- Editorial calendar date boundaries
- Publication date display labels on brief cards

Do **not** use the Vercel runtime region timezone for editorial day boundaries.

---

## 7. Related types

- Supabase row types: \`src/types/database.ts\`
- Application DTOs: \`src/types/domain.ts\`
- Live overlay (legacy): \`src/types/fixture-overlay.ts\`
`,
);

write(
  "docs/ARCHITECTURE.md",
  `# GoalCurrent v2 — System Architecture

## Overview

GoalCurrent v2 adds a **Contextual Explanation Engine** on top of the existing live football site at [goalcurrent.live](https://www.goalcurrent.live). The engine transforms verified match data into post-match intelligence briefs that answer *why did this happen?*

The v2 stack integrates into the **existing** Next.js 16 repository (\`src/\` layout), deploys on **Vercel**, persists intelligence data in **Supabase Postgres**, and reuses the proven **API-Football** client under \`src/lib/api-football/\`.

See [GC-V2-DATA-CONTRACT.md](./implementation/GC-V2-DATA-CONTRACT.md) for field-level contracts.

---

## Repository layout (adapted from v2 package)

| Package assumption | This repository |
|------------------|-----------------|
| \`app/(site)/page.tsx\` | \`src/app/[locale]/page.tsx\` + future \`src/app/[locale]/briefs/*\` |
| \`lib/supabase-client.ts\` | \`src/lib/supabase/{browser,server,admin,proxy}.ts\` (async cookies) |
| \`types/*.ts\` | \`src/types/*.ts\` with \`@/*\` alias |
| \`supabase/schema.sql\` | \`supabase/migrations/*.sql\` |
| Netlify deploy | **Vercel** (\`vercel.json\`, \`docs/DEPLOY.md\`) |

Existing WC26 routes (\`/match/[fixtureId]\`, \`/live\`, \`/worldcup2026/*\`) and API routes (\`/api/wc26/*\`) remain until Supabase ingestion is certified.

---

## Component diagram

\`\`\`text
┌──────────────────────────────────────────────────────────────────────┐
│                     Vercel — Next.js 16 (src/app)                     │
│                                                                       │
│  ┌─────────────┐  ┌──────────────────┐  ┌─────────────────────────┐ │
│  │ Site (RSC)  │  │ Brief detail     │  │ Editorial UI            │ │
│  │ [locale]/   │  │ [locale]/briefs/ │  │ [locale]/brief-editor/  │ │
│  └──────┬──────┘  └────────┬─────────┘  └────────────┬────────────┘ │
│         │                  │                         │              │
│         └──────────────────┼─────────────────────────┘              │
│                            │                                          │
│         ┌──────────────────▼──────────────────┐                       │
│         │ src/lib/supabase/* + explanation    │                       │
│         │ src/lib/api-football/client.ts      │                       │
│         └──────────────────┬──────────────────┘                       │
└────────────────────────────┼──────────────────────────────────────────┘
                             │
┌────────────────────────────▼──────────────────────────────────────────┐
│                         Supabase (Postgres + Auth)                       │
│  competitions │ teams │ venues │ matches │ match_events               │
│  match_statistics │ match_lineups │ editorial_theses │ ai_evidence      │
│  briefs │ brief_sections │ brief_feedback │ users                       │
│                                                                          │
│  Edge Functions (Deno, separate deploy):                                 │
│    fetch-match-data  — API-Football → Postgres upsert                   │
│    generate-brief    — OpenAI structured output → draft brief           │
└───────────────┬───────────────────────────────┬─────────────────────────┘
                │                               │
                ▼                               ▼
     ┌────────────────────┐          ┌─────────────────────┐
     │ API-Football REST  │          │ OpenAI (OPENAI_MODEL)│
     │ API_FOOTBALL_KEY   │          │ JSON schema validated│
     └────────────────────┘          └─────────────────────┘
\`\`\`

---

## Data flow

1. **Ingestion** — Scheduler or Vercel cron triggers \`fetch-match-data\` (Edge Function) with service credentials.
2. **Fetch** — Function calls API-Football (same base URL as \`src/lib/pl/constants.ts\`) for fixtures, events, statistics, lineups.
3. **Transform** — Map to corrected schema: canonical \`matches.id\`, \`local_fixture_id\` bridge, extended status/scores, \`event_fingerprint\`.
4. **Upsert** — Atomic match bundle into Supabase (transaction or RPC).
5. **Thesis** — Editor saves human thesis → \`editorial_theses\`.
6. **Generate** — Editor triggers \`generate-brief\`; Edge Function loads match + thesis, calls OpenAI, validates JSON, inserts \`briefs\` + \`brief_sections\` + \`ai_evidence\`.
7. **Review** — \`src/app/[locale]/brief-editor/[id]\` (server-auth enforced) for edit, reorder, regenerate section, publish.
8. **Publish** — \`status = published\`, \`slug\` set; public reads via RLS.
9. **Feedback** — Per-section reactions; authenticated or anonymous (HMAC identity).

---

## Contextual Explanation Engine

Domain-neutral core (future: FAMVI, SepanAI adapters):

| Layer | Location | Role |
|-------|----------|------|
| Request/response types | \`src/types/domain.ts\` | \`ExplanationRequest\`, \`ExplanationResponse\` |
| Validation + prompt | \`src/lib/explanation-engine/*\` | Zod schemas, OpenAI call |
| Football adapter | \`src/lib/football-adapter/*\` | Match rows → evidence items |

The engine knows theses, evidence, and section structure — not football-specific terms.

---

## Authentication

| Concern | Implementation |
|---------|----------------|
| Editorial roles | Supabase Auth + \`public.users.role\` (\`reader\` \| \`editor\` \| \`admin\`) |
| Server enforcement | \`is_editor()\`, \`is_admin()\` in RLS; route handlers verify session |
| Push / optional sign-in | Existing Firebase (\`src/lib/firebase/*\`) remains for FCM |
| Profile creation | \`handle_new_user\` trigger (\`security definer\`, fixed \`search_path\`) |

Never assign \`editor\`/\`admin\` from client-only code.

---

## API-Football integration (existing)

| Module | Path |
|--------|------|
| HTTP client | \`src/lib/api-football/client.ts\` |
| WC26 server | \`src/lib/server/wc26-api-football.ts\`, \`wc26-match-detail.ts\` |
| Fixture bridge | \`src/lib/wc26-fixture-match.ts\`, \`wc26-api-fixture-id.ts\` |
| Status normalisation | \`src/lib/wc26-match-status.ts\` → extended in ingestion layer |

v2 ingestion must produce identical team/score identity to live overlay routes for the same \`matches.id\`.

---

## Supabase tables (summary)

| Table | Purpose |
|-------|---------|
| \`competitions\`, \`teams\`, \`venues\` | Canonical FK targets |
| \`matches\` | API fixture PK + \`local_fixture_id\` + full scores/status |
| \`match_events\` | Fingerprinted events |
| \`match_statistics\` | Raw + normalised stats per team |
| \`match_lineups\` | Player id + role keyed lineups |
| \`editorial_theses\` | Human framing for AI |
| \`ai_evidence\` | Traceable evidence rows |
| \`briefs\`, \`brief_sections\` | Intelligence brief content |
| \`brief_feedback\` | Section-level reactions |
| \`users\` | Auth profile + role |

---

## Environment variables

| Variable | Scope | Purpose |
|----------|-------|---------|
| \`SUPABASE_URL\`, \`SUPABASE_ANON_KEY\` | Server + public | Supabase client |
| \`SUPABASE_SERVICE_ROLE_KEY\` | Server only | Ingestion, anonymous feedback |
| \`API_FOOTBALL_KEY\` | Server only | Live + ingestion (existing) |
| \`OPENAI_API_KEY\`, \`OPENAI_MODEL\` | Server only | Brief generation |
| \`GOALCURRENT_EDITORIAL_TIMEZONE\` | Server | Editorial "today" boundary |
| \`GOALCURRENT_ANON_FEEDBACK_SECRET\` | Server only | HMAC for anonymous feedback |

See \`.env.example\` and \`FOUNDER_ACTION_REQUIRED.md\`.

---

## Deployment

- **Next.js app:** Vercel project \`goalcurrent.live\`, production branch \`main\`; v2 work on \`goalcurrent-v2-rebuild\`.
- **Supabase:** Migrations via \`supabase/migrations/\`; Edge Functions deployed with Supabase CLI separately.
- **Cron:** Extend Vercel cron (\`/api/cron/*\`) to trigger ingestion windows; Edge Function validates shared secret.

---

## Security highlights

- RLS on all public tables; drafts hidden from anon/authenticated readers.
- Service role never imported in client bundles.
- Edge Functions require scheduler secret or editor JWT.
- Feedback: partial unique indexes on \`user_id\` and \`anonymous_identity\`.
- AI content rendered via sanitised Markdown only (no raw \`dangerouslySetInnerHTML\`).

---

## Related documents

- [GC-V2-REPOSITORY-AUDIT.md](./implementation/GC-V2-REPOSITORY-AUDIT.md)
- [GC-V2-DATA-CONTRACT.md](./implementation/GC-V2-DATA-CONTRACT.md)
- [GC-V2-BASELINE-BUILD.md](./implementation/GC-V2-BASELINE-BUILD.md)
- [DEPLOY.md](./DEPLOY.md)
`,
);

console.log("GC v2 milestone 1 files written");
