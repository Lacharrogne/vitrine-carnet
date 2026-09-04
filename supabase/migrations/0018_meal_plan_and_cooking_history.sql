-- ============================================================================
--  « LES CARNETS » — Carnet de recettes : planning de repas & historique de
--  cuisine, synchronisés au compte.
--  À exécuter dans le projet Supabase « Les Carnets ».
-- ----------------------------------------------------------------------------
--  Jusqu'ici, ces deux données vivaient uniquement dans le navigateur
--  (localStorage). Le planning est pourtant une fonctionnalité payante : on le
--  remplissait sur son téléphone et on ne le retrouvait pas sur son ordinateur,
--  et vider le cache effaçait tout sans recours.
--
--  Deux tables, privées (RLS « propriétaire seul ») :
--   - meal_plan_entries : une ligne par créneau REMPLI de la semaine type.
--                         Vider un créneau = supprimer sa ligne.
--   - cooking_history   : combien de fois et quand une recette a été cuisinée.
--
--  Choix de conception — une ligne par créneau plutôt qu'un document unique :
--  modifier un repas ne touche qu'une ligne, donc deux appareils qui éditent
--  des repas différents ne s'écrasent pas l'un l'autre. Cela évite aussi
--  d'avoir à réécrire tout le planning à chaque changement (le motif « tout
--  supprimer puis réinsérer » a déjà causé des pertes de données ailleurs).
-- ============================================================================

-- ---- Planning de repas de la semaine type ----------------------------------
create table if not exists public.meal_plan_entries (
  user_id uuid not null references auth.users (id) on delete cascade,
  -- Semaine type, pas de dates : « lundi », « mardi »… (voir DAYS côté app).
  day_key text not null,
  -- Repas de la journée : petit déjeuner, déjeuner, goûter, dîner, dessert.
  meal_key text not null,
  recipe_id bigint not null references public.recipes (id) on delete cascade,
  updated_at timestamptz not null default now(),

  primary key (user_id, day_key, meal_key),

  constraint meal_plan_entries_day_key_valid check (
    day_key in (
      'monday', 'tuesday', 'wednesday', 'thursday',
      'friday', 'saturday', 'sunday'
    )
  ),
  constraint meal_plan_entries_meal_key_valid check (
    meal_key in ('breakfast', 'lunch', 'snack', 'dinner', 'dessert')
  )
);

-- La clé primaire commence par user_id : la lecture du planning d'une personne
-- est déjà couverte. Cet index-ci sert aux suppressions en cascade de recettes.
create index if not exists meal_plan_entries_recipe_idx
  on public.meal_plan_entries (recipe_id);

alter table public.meal_plan_entries enable row level security;

drop policy if exists meal_plan_entries_all on public.meal_plan_entries;
create policy meal_plan_entries_all on public.meal_plan_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---- Historique « déjà cuisiné » -------------------------------------------
create table if not exists public.cooking_history (
  user_id uuid not null references auth.users (id) on delete cascade,
  recipe_id bigint not null references public.recipes (id) on delete cascade,
  cooked_count integer not null default 1,
  last_cooked_at timestamptz not null default now(),

  primary key (user_id, recipe_id),

  -- Un compteur ne descend jamais sous zéro (« annuler » décrémente).
  constraint cooking_history_count_positive check (cooked_count >= 0)
);

create index if not exists cooking_history_recipe_idx
  on public.cooking_history (recipe_id);

alter table public.cooking_history enable row level security;

drop policy if exists cooking_history_all on public.cooking_history;
create policy cooking_history_all on public.cooking_history
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
--  Suppression de compte : rien à ajouter à `admin_delete_user`. Les deux
--  tables référencent auth.users avec `on delete cascade`, leurs lignes
--  partent donc avec le compte.
-- ----------------------------------------------------------------------------
