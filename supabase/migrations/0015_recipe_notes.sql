-- ============================================================================
--  « LES CARNETS » — Carnet de recettes : notes personnelles privées.
--  À exécuter dans le projet Supabase « Les Carnets ».
-- ----------------------------------------------------------------------------
--  Table recipe_notes : une note privée par utilisateur et par recette
--  (« la prochaine fois, moins de sel »). Visible du seul auteur → RLS
--  « propriétaire seul ». Le code reste tolérant si la table n'existe pas.
-- ============================================================================

create table if not exists public.recipe_notes (
  user_id uuid not null references auth.users (id) on delete cascade,
  recipe_id bigint not null references public.recipes (id) on delete cascade,
  note text not null default '',
  updated_at timestamptz not null default now(),
  primary key (user_id, recipe_id)
);

alter table public.recipe_notes enable row level security;

drop policy if exists recipe_notes_all on public.recipe_notes;
create policy recipe_notes_all on public.recipe_notes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
