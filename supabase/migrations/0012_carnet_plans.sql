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

-- Les accès offerts créés à l'avenir débloquent tout par défaut.
create or replace function public.grant_comp_access(target_email text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  target_id uuid;
begin
  if not public.is_admin() then
    raise exception 'Réservé aux administrateurs';
  end if;

  select id into target_id from auth.users where email = target_email;

  if target_id is null then
    raise exception 'Aucun compte pour cet email';
  end if;

  insert into public.subscriptions (user_id, status, source, plan, updated_at)
  values (target_id, 'active', 'comp', 'all', now())
  on conflict (user_id) do update
    set status = 'active', source = 'comp', plan = 'all',
        updated_at = now();
end;
$$;

-- Helper pur : un plan donne-t-il accès à un carnet précis ?
-- (NULL et 'all' donnent tout ; sinon il faut la correspondance exacte.)
create or replace function public.plan_grants(plan text, carnet text)
returns boolean
language sql
immutable
as $$
  select plan is null or plan = 'all' or plan = carnet;
$$;
