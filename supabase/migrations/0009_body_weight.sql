-- ============================================================================
--  « LES CARNETS » — Carnet de sport : suivi du poids corporel.
--  À exécuter dans le projet Supabase « Les Carnets ».
-- ----------------------------------------------------------------------------
--  1) Nouvelle table body_weight_entries : un historique de pesées par personne
--     (une pesée par jour au maximum → contrainte unique user_id + date).
--  2) Nouvelle colonne health_profiles.goal_weight_kg : poids cible (facultatif)
--     pour la projection vers l'objectif.
--  Sport est privé : RLS « propriétaire seul », comme les autres tables sport.
-- ============================================================================

-- ---- body_weight_entries ---------------------------------------------------
create table if not exists public.body_weight_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  weight_kg numeric(5, 2) not null,
  note text,
  created_at timestamptz not null default now(),
  unique (user_id, date)
);

create index if not exists body_weight_entries_user_date_idx
  on public.body_weight_entries (user_id, date);

alter table public.body_weight_entries enable row level security;
drop policy if exists body_weight_entries_all on public.body_weight_entries;
create policy body_weight_entries_all on public.body_weight_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---- health_profiles : poids cible -----------------------------------------
alter table public.health_profiles
  add column if not exists goal_weight_kg numeric(5, 2);
