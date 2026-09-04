-- ============================================================================
--  « LES CARNETS » — Suivi des erreurs rencontrées par les utilisateurs.
--  À exécuter dans le projet Supabase « Les Carnets ».
-- ----------------------------------------------------------------------------
--  Jusqu'ici, une erreur survenue chez quelqu'un n'allait nulle part : elle
--  s'affichait dans une console que personne ne regarde. Un incident n'était
--  connu que si la personne prenait la peine d'écrire — ou jamais.
--
--  Cette table reçoit les erreurs non rattrapées des quatre applications.
--  Écriture ouverte (une erreur peut survenir avant même la connexion), mais
--  **lecture réservée aux administrateurs** : les messages peuvent contenir des
--  bribes de données personnelles.
-- ============================================================================

create table if not exists public.client_errors (
  id uuid primary key default gen_random_uuid(),

  -- Null si l'erreur survient avant la connexion.
  user_id uuid references auth.users (id) on delete set null,

  -- Quel carnet : 'recettes' | 'budget' | 'sport' | 'vitrine'.
  app text not null,

  message text not null,
  stack text,
  -- Chemin de la page (sans domaine ni paramètres : voir le code client).
  path text,
  user_agent text,

  created_at timestamptz not null default now(),

  constraint client_errors_app_valid check (
    app in ('recettes', 'budget', 'sport', 'vitrine')
  ),
  -- Un message vide n'apprend rien ; on borne aussi la taille pour qu'une
  -- boucle d'erreurs ne puisse pas gonfler la base.
  constraint client_errors_message_sane check (
    length(message) between 1 and 2000
  ),
  constraint client_errors_stack_sane check (
    stack is null or length(stack) <= 8000
  )
);

-- Lecture par l'admin : les plus récentes d'abord, filtrables par carnet.
create index if not exists client_errors_created_idx
  on public.client_errors (created_at desc);
create index if not exists client_errors_app_created_idx
  on public.client_errors (app, created_at desc);

alter table public.client_errors enable row level security;

-- Écriture : chacun ne peut déposer qu'une erreur non attribuée ou la sienne.
-- (Une erreur peut survenir déconnecté, d'où le cas `user_id is null`.)
drop policy if exists client_errors_insert on public.client_errors;
create policy client_errors_insert on public.client_errors
  for insert to anon, authenticated
  with check (user_id is null or user_id = auth.uid());

-- Lecture et purge : administrateurs uniquement.
drop policy if exists client_errors_select_admin on public.client_errors;
create policy client_errors_select_admin on public.client_errors
  for select using (public.is_admin());

drop policy if exists client_errors_delete_admin on public.client_errors;
create policy client_errors_delete_admin on public.client_errors
  for delete using (public.is_admin());

-- ----------------------------------------------------------------------------
--  Purge : à appeler ponctuellement pour ne pas conserver indéfiniment des
--  messages pouvant contenir des bribes de données personnelles.
-- ----------------------------------------------------------------------------
create or replace function public.purge_client_errors(days integer default 30)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  removed integer;
begin
  if not public.is_admin() then
    raise exception 'Réservé aux administrateurs';
  end if;

  delete from public.client_errors
  where created_at < now() - make_interval(days => days);

  get diagnostics removed = row_count;
  return removed;
end;
$$;

grant execute on function public.purge_client_errors(integer) to authenticated;
