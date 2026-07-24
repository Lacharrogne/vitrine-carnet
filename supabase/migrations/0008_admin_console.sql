-- ============================================================================
--  « LES CARNETS » — Console d'admin transverse (chapeaute les 3 carnets).
--  À exécuter dans le projet commun « Les Carnets ».
-- ----------------------------------------------------------------------------
--  Deux fonctions SECURITY DEFINER, réservées aux admins (is_admin()) :
--   - admin_overview() : chiffres globaux (utilisateurs, abonnements, activité
--     par carnet).
--   - admin_users()    : une ligne par utilisateur avec e-mail, rôle, statut
--     d'abonnement et volume d'activité par carnet (comptes = agrégats, pas de
--     contenu personnel exposé).
--
--  Les actions (changer un rôle, offrir/retirer un accès, supprimer un compte)
--  réutilisent les fonctions déjà en place : admin_set_role, grant_comp_access,
--  revoke_comp_access, admin_delete_user (migration 0001).
-- ============================================================================

create or replace function public.admin_overview()
returns json
language sql
security definer
set search_path = public
as $$
  select case when public.is_admin() then json_build_object(
    'users_total',       (select count(*) from auth.users),
    'admins',            (select count(*) from public.profiles where role = 'admin'),
    'premium',           (select count(*) from public.subscriptions where status in ('active', 'on_trial')),
    'comp',              (select count(*) from public.subscriptions where source = 'comp'),
    'recipes',           (select count(*) from public.recipes),
    'accounts',          (select count(*) from public.accounts),
    'transactions',      (select count(*) from public.transactions),
    'workouts',          (select count(*) from public.workouts),
    'planned_workouts',  (select count(*) from public.planned_workouts)
  ) else null end;
$$;

create or replace function public.admin_users()
returns table (
  user_id uuid,
  email text,
  username text,
  role text,
  created_at timestamptz,
  sub_status text,
  sub_source text,
  recipes_count bigint,
  transactions_count bigint,
  workouts_count bigint
)
language sql
security definer
set search_path = public
as $$
  select
    u.id,
    u.email::text,
    p.username,
    coalesce(p.role, 'user'),
    u.created_at,
    coalesce(s.status, 'none'),
    coalesce(s.source, '—'),
    (select count(*) from public.recipes r where r.user_id = u.id),
    (select count(*) from public.transactions t where t.user_id = u.id),
    (select count(*) from public.workouts w where w.user_id = u.id)
  from auth.users u
  left join public.profiles p on p.user_id = u.id
  left join public.subscriptions s on s.user_id = u.id
  where public.is_admin()
  order by u.created_at desc;
$$;

grant execute on function public.admin_overview() to authenticated;
grant execute on function public.admin_users() to authenticated;
