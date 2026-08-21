-- ============================================================================
--  « LES CARNETS » — Préférences utilisateur synchronisées (suivent le compte).
--  À exécuter dans le projet Supabase « Les Carnets ».
-- ----------------------------------------------------------------------------
--  Table user_preferences : préférences légères qui suivent l'utilisateur d'un
--  appareil à l'autre (aujourd'hui : visibilité des recettes + curseur du
--  Carnet de recettes). Privé → RLS « propriétaire seul ».
--  Le code reste tolérant si cette table n'existe pas (repli sur le local).
-- ============================================================================

create table if not exists public.user_preferences (
  user_id uuid primary key references auth.users (id) on delete cascade,
  -- Visibilité des recettes (JSON sérialisé : { mode, friendId }).
  recipe_visibility text,
  -- Curseur du Carnet de recettes ('kitchen' | 'default').
  cursor text,
  updated_at timestamptz not null default now()
);

alter table public.user_preferences enable row level security;

drop policy if exists user_preferences_all on public.user_preferences;
create policy user_preferences_all on public.user_preferences
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
