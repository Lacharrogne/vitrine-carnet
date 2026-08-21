-- ============================================================================
--  « LES CARNETS » — Carnet de recettes : collections (dossiers) de recettes.
--  À exécuter dans le projet Supabase « Les Carnets ».
-- ----------------------------------------------------------------------------
--  Deux tables :
--   - recipe_collections       : les dossiers d'une personne (nom + emoji) ;
--   - recipe_collection_items  : le contenu (une recette peut être dans
--                                plusieurs collections).
--  Privé → RLS « propriétaire seul ». Pour les items, la propriété est
--  vérifiée via la collection parente.
-- ============================================================================

create table if not exists public.recipe_collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  emoji text not null default '📁',
  created_at timestamptz not null default now()
);

create index if not exists recipe_collections_user_idx
  on public.recipe_collections (user_id, created_at);

alter table public.recipe_collections enable row level security;

drop policy if exists recipe_collections_all on public.recipe_collections;
create policy recipe_collections_all on public.recipe_collections
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.recipe_collection_items (
  collection_id uuid not null
    references public.recipe_collections (id) on delete cascade,
  recipe_id bigint not null references public.recipes (id) on delete cascade,
  added_at timestamptz not null default now(),
  primary key (collection_id, recipe_id)
);

create index if not exists recipe_collection_items_collection_idx
  on public.recipe_collection_items (collection_id);

create index if not exists recipe_collection_items_recipe_idx
  on public.recipe_collection_items (recipe_id);

alter table public.recipe_collection_items enable row level security;

-- La propriété d'un item découle de la collection parente.
drop policy if exists recipe_collection_items_all on public.recipe_collection_items;
create policy recipe_collection_items_all on public.recipe_collection_items
  for all using (
    exists (
      select 1 from public.recipe_collections c
      where c.id = collection_id and c.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.recipe_collections c
      where c.id = collection_id and c.user_id = auth.uid()
    )
  );
