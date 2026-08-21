-- ============================================================================
--  « LES CARNETS » — Schéma du Carnet de sport (données) dans le projet commun.
--  À exécuter dans le projet Supabase « Les Carnets ».
-- ----------------------------------------------------------------------------
--  5 tables recréées à l'identique de l'ancien projet Sport. Sport est privé :
--  chaque personne ne voit que SES données → RLS « propriétaire seul ».
--
--  Particularités respectées :
--   - workouts.id : uuid (gen_random_uuid())
--   - planned_workouts.id : text (id généré côté client)
--   - weekly_goals / health_profiles / user_profiles : user_id = clé primaire
--     (une seule ligne par personne, géré par upsert on conflict user_id).
-- ============================================================================

-- ---- workouts --------------------------------------------------------------
create table if not exists public.workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  sport text not null,
  date date not null,
  duration_minutes integer not null,
  intensity text not null,
  feeling text,
  progress text,
  notes text,
  improvement text,
  is_record boolean not null default false,
  details jsonb not null default '{}'::jsonb,
  duration integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---- planned_workouts ------------------------------------------------------
create table if not exists public.planned_workouts (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  category text not null,
  date date not null,
  duration integer not null default 0,
  objective text not null default ''::text,
  details jsonb,
  notes text,
  improvement_idea text,
  created_at timestamptz not null default now()
);

-- ---- weekly_goals (1 ligne / personne) -------------------------------------
create table if not exists public.weekly_goals (
  user_id uuid primary key references auth.users (id) on delete cascade,
  target_minutes integer not null default 180,
  updated_at timestamptz not null default now()
);

-- ---- health_profiles (1 ligne / personne) ----------------------------------
create table if not exists public.health_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  height_cm integer,
  weight_kg numeric,
  age integer,
  activity_level text,
  main_goal text,
  updated_at timestamptz not null default now()
);

-- ---- user_profiles (profil sportif : pseudo + avatar) ----------------------
create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default ''::text,
  avatar text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
--  RLS — « propriétaire seul » sur les 5 tables.
-- ============================================================================

alter table public.workouts enable row level security;
drop policy if exists workouts_all on public.workouts;
create policy workouts_all on public.workouts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.planned_workouts enable row level security;
drop policy if exists planned_workouts_all on public.planned_workouts;
create policy planned_workouts_all on public.planned_workouts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.weekly_goals enable row level security;
drop policy if exists weekly_goals_all on public.weekly_goals;
create policy weekly_goals_all on public.weekly_goals for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.health_profiles enable row level security;
drop policy if exists health_profiles_all on public.health_profiles;
create policy health_profiles_all on public.health_profiles for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.user_profiles enable row level security;
drop policy if exists user_profiles_all on public.user_profiles;
create policy user_profiles_all on public.user_profiles for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
