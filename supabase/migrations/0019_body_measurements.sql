-- ============================================================================
--  « LES CARNETS » — Carnet de sport : mensurations corporelles.
--  À exécuter dans le projet Supabase « Les Carnets ».
-- ----------------------------------------------------------------------------
--  Sur la page « Corps », le poids était déjà rattaché au compte
--  (`body_weight_entries`, migration 0009) mais les mensurations vivaient
--  uniquement dans le navigateur. Résultat : dans une même interface, la
--  moitié des données suivait l'utilisateur et l'autre non — sans que rien ne
--  le laisse deviner. Changer de téléphone effaçait son historique de
--  mensurations, silencieusement.
--
--  Une ligne par date (comme pour le poids), avec cinq mesures facultatives en
--  centimètres : on renseigne ce qu'on veut, quand on veut.
--  Sport est privé : RLS « propriétaire seul ».
-- ============================================================================

create table if not exists public.body_measurements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,

  -- Toutes facultatives : une séance de mesure peut n'en couvrir qu'une seule.
  waist_cm numeric(5, 1),
  chest_cm numeric(5, 1),
  arm_cm numeric(5, 1),
  thigh_cm numeric(5, 1),
  hips_cm numeric(5, 1),

  created_at timestamptz not null default now(),

  -- Une seule série de mesures par jour, comme pour la pesée.
  unique (user_id, date),

  -- Une ligne entièrement vide n'aurait aucun sens : on la refuse plutôt que
  -- de laisser s'accumuler des entrées fantômes dans l'historique.
  constraint body_measurements_not_empty check (
    coalesce(waist_cm, chest_cm, arm_cm, thigh_cm, hips_cm) is not null
  ),

  -- Une mensuration nulle ou négative est une erreur de saisie, pas une donnée.
  constraint body_measurements_positive check (
    (waist_cm is null or waist_cm > 0)
    and (chest_cm is null or chest_cm > 0)
    and (arm_cm is null or arm_cm > 0)
    and (thigh_cm is null or thigh_cm > 0)
    and (hips_cm is null or hips_cm > 0)
  )
);

create index if not exists body_measurements_user_date_idx
  on public.body_measurements (user_id, date);

alter table public.body_measurements enable row level security;

drop policy if exists body_measurements_all on public.body_measurements;
create policy body_measurements_all on public.body_measurements
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
--  Suppression de compte : rien à ajouter à `admin_delete_user`, la table
--  référence auth.users avec `on delete cascade`.
-- ----------------------------------------------------------------------------
