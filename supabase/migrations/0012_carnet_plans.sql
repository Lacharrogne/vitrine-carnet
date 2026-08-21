-- ============================================================================
--  « LES CARNETS » — Abonnement par carnet (fondations).
--  À exécuter dans le projet Supabase « Les Carnets ».
-- ----------------------------------------------------------------------------
--  On passe d'un premium global unique à des DROITS PAR CARNET.
--  subscriptions.plan indique ce que l'abonnement débloque :
--    'recettes' | 'budget' | 'sport'  → un seul carnet
--    'all'                            → les trois (offre complète)
--    NULL                             → interprété comme 'all' (héritage)
--
--  Règles de conception validées :
--   - L'essai gratuit (14 j, calculé depuis la création du compte) débloque
--     TOUT → aucune notion de plan pendant l'essai.
--   - Les abonnés existants et les accès offerts (comp) → 'all' (personne ne
--     perd l'accès lors de la bascule).
-- ============================================================================

alter table public.subscriptions
  add column if not exists plan text;

-- Héritage : tout abonnement déjà en base bascule en accès complet.
update public.subscriptions
set plan = 'all'
where plan is null;

-- NB : les accès offerts (comp) fonctionnent sans modification — un `plan` NULL
-- est déjà interprété comme « tout » par l'app (voir planGrantsCarnet). On ne
-- redéfinit donc PAS grant_comp_access ici (sa signature existante rendrait un
-- CREATE OR REPLACE impossible sans DROP préalable).
