-- ============================================================================
--  « LES CARNETS » — Carnet de recettes : photo du plat dans les avis.
--  À exécuter dans le projet Supabase « Les Carnets ».
-- ----------------------------------------------------------------------------
--  Ajoute une colonne `image_url` (facultative) aux avis de recette, pour
--  joindre la photo du plat réalisé. Les avis existants restent inchangés.
--  Les photos sont stockées dans le bucket `recipe-images` (déjà en place).
-- ============================================================================

alter table public.recipe_reviews
  add column if not exists image_url text;
