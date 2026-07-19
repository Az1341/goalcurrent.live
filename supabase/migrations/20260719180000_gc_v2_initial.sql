-- GoalCurrent v2 initial schema (corrected vs z.ai package)
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
