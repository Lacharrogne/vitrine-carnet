-- ============================================================================
--  « LES CARNETS » — Carnet de sport : modèles de séances réutilisables.
--  À exécuter dans le projet Supabase « Les Carnets ».
-- ----------------------------------------------------------------------------
--  Table workout_templates : des patrons de séance (nom + contenu) propres à
--  chaque personne. Sport est privé → RLS « propriétaire seul ».
-- ============================================================================

create table if not exists public.workout_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  category text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists workout_templates_user_idx
  on public.workout_templates (user_id, created_at desc);

alter table public.workout_templates enable row level security;
drop policy if exists workout_templates_all on public.workout_templates;
create policy workout_templates_all on public.workout_templates
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
