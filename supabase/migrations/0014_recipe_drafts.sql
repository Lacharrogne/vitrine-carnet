-- ============================================================================
--  « LES CARNETS » — Carnet de recettes : brouillons de recette.
--  À exécuter dans le projet Supabase « Les Carnets ».
-- ----------------------------------------------------------------------------
--  Ajoute une colonne `status` aux recettes :
--    - 'published' (défaut) : visible de toute la communauté ;
--    - 'draft'              : brouillon, visible du seul auteur.
--  Les recettes existantes restent publiées (valeur par défaut).
--  Le code reste tolérant si cette migration n'est pas encore lancée.
-- ============================================================================

alter table public.recipes
  add column if not exists status text not null default 'published';

-- Index pour ne lister que les recettes publiées côté communauté.
create index if not exists recipes_status_idx
  on public.recipes (status);
