-- ============================================================================
--  « LES CARNETS » — Carnet de sport : intégration Strava (import d'activités).
--  À exécuter dans le projet Supabase « Les Carnets ».
-- ----------------------------------------------------------------------------
--  1) Table strava_connections : jetons OAuth Strava par personne (privé, RLS).
--  2) Colonnes source + external_id sur workouts, pour taguer les séances
--     importées et éviter les doublons lors des synchronisations.
-- ============================================================================

-- ---- strava_connections ----------------------------------------------------
create table if not exists public.strava_connections (
  user_id uuid primary key references auth.users (id) on delete cascade,
  athlete_id bigint,
  athlete_name text,
  access_token text not null,
  refresh_token text not null,
  expires_at timestamptz not null,
  scope text,
  last_sync_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.strava_connections enable row level security;
drop policy if exists strava_connections_all on public.strava_connections;
create policy strava_connections_all on public.strava_connections
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---- workouts : provenance + dédoublonnage ---------------------------------
alter table public.workouts
  add column if not exists source text not null default 'manual';

alter table public.workouts
  add column if not exists external_id text;

-- Une même activité externe (ex. Strava) ne peut exister qu'une fois par
-- personne. external_id NULL pour les séances manuelles → doublons autorisés
-- (les NULL sont distincts en Postgres).
create unique index if not exists workouts_user_external_idx
  on public.workouts (user_id, external_id)
  where external_id is not null;
