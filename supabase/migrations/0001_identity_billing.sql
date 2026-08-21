-- ============================================================================
--  « LES CARNETS » — Backend central : identité + abonnement partagés.
-- ----------------------------------------------------------------------------
--  À exécuter UNE FOIS dans le nouveau projet Supabase « Les Carnets »
--  (SQL Editor). C'est le socle commun à TOUS les carnets : un seul compte,
--  un seul abonnement débloque tout.
--
--  Les données propres à chaque carnet vivront dans des schémas dédiés
--  (recettes / budget / sport), ajoutés lors de la phase de migration.
-- ============================================================================

-- ---- Profils (partagés par tous les carnets) -------------------------------
create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  username text,
  avatar_url text,
  bio text,
  role text not null default 'user',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Helper : l'appelant est-il administrateur ? (SECURITY DEFINER pour éviter
-- la récursion sur les politiques de profiles).
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where user_id = auth.uid() and role = 'admin'
  );
$$;

-- Création automatique du profil à l'inscription.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, username)
  values (new.id, split_part(new.email, '@', 1))
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Lecture publique des profils (profils publics) ; chacun ne modifie que le
-- sien ; l'admin peut tout modifier / supprimer.
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select using (true);

drop policy if exists profiles_insert on public.profiles;
create policy profiles_insert on public.profiles
  for insert with check (auth.uid() = user_id);

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists profiles_update_admin on public.profiles;
create policy profiles_update_admin on public.profiles
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists profiles_delete_admin on public.profiles;
create policy profiles_delete_admin on public.profiles
  for delete using (public.is_admin());

-- Anti-escalade : personne (hors service_role / fonctions) ne change `role`.
revoke update (role) on public.profiles from anon, authenticated;

-- ---- Abonnement unique (Lemon Squeezy) -------------------------------------
create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users (id) on delete cascade,
  status text not null default 'none',
  source text not null default 'lemonsqueezy',
  variant_id text,
  ls_subscription_id text,
  renews_at timestamptz,
  ends_at timestamptz,
  customer_portal_url text,
  update_payment_url text,
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

drop policy if exists subscriptions_select_own on public.subscriptions;
create policy subscriptions_select_own on public.subscriptions
  for select using (auth.uid() = user_id);

drop policy if exists subscriptions_select_admin on public.subscriptions;
create policy subscriptions_select_admin on public.subscriptions
  for select using (public.is_admin());

drop policy if exists subscriptions_update_admin on public.subscriptions;
create policy subscriptions_update_admin on public.subscriptions
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists subscriptions_delete_admin on public.subscriptions;
create policy subscriptions_delete_admin on public.subscriptions
  for delete using (public.is_admin());
-- Écriture normale : réservée au webhook (service_role, contourne la RLS).

-- ---- Accès offerts (comp) : premium sans paiement --------------------------
create or replace function public.grant_comp_access(target_email text)
returns text
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

  select id into target_id
  from auth.users
  where lower(email) = lower(trim(target_email))
  limit 1;

  if target_id is null then
    raise exception 'Aucun compte pour cet email';
  end if;

  insert into public.subscriptions (user_id, status, source, updated_at)
  values (target_id, 'active', 'comp', now())
  on conflict (user_id) do update
    set status = 'active', source = 'comp',
        ends_at = null, renews_at = null, updated_at = now();

  return 'ok';
end;
$$;

create or replace function public.revoke_comp_access(target_email text)
returns text
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

  select id into target_id
  from auth.users
  where lower(email) = lower(trim(target_email))
  limit 1;

  if target_id is null then
    raise exception 'Aucun compte pour cet email';
  end if;

  delete from public.subscriptions
  where user_id = target_id and source = 'comp';

  return 'ok';
end;
$$;

create or replace function public.list_comp_access()
returns table (user_id uuid, email text, username text, granted_at timestamptz)
language sql
security definer
set search_path = public
as $$
  select s.user_id, u.email::text, p.username, s.updated_at
  from public.subscriptions s
  join auth.users u on u.id = s.user_id
  left join public.profiles p on p.user_id = s.user_id
  where s.source = 'comp' and public.is_admin()
  order by s.updated_at desc;
$$;

-- ---- Administration des rôles & comptes ------------------------------------
create or replace function public.admin_set_role(target_user_id uuid, new_role text)
returns text
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Réservé aux administrateurs';
  end if;
  if new_role not in ('user', 'admin') then
    raise exception 'Rôle invalide (attendu: user ou admin)';
  end if;
  update public.profiles set role = new_role where user_id = target_user_id;
  return 'ok';
end;
$$;

-- Supprime un compte (auth + profil + abonnement). Les données des carnets
-- (schémas recettes/budget/sport) seront ajoutées ici lors de la migration.
create or replace function public.admin_delete_user(target_user_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Réservé aux administrateurs';
  end if;
  if target_user_id = auth.uid() then
    raise exception 'Vous ne pouvez pas supprimer votre propre compte';
  end if;

  delete from public.subscriptions where user_id = target_user_id;
  delete from public.profiles where user_id = target_user_id;
  delete from auth.users where id = target_user_id;

  return 'ok';
end;
$$;

grant execute on function public.grant_comp_access(text) to authenticated;
grant execute on function public.revoke_comp_access(text) to authenticated;
grant execute on function public.list_comp_access() to authenticated;
grant execute on function public.admin_set_role(uuid, text) to authenticated;
grant execute on function public.admin_delete_user(uuid) to authenticated;
