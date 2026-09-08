-- ============================================================================
--  « LES CARNETS » — Avis et retours d'expérience des utilisateurs.
--  À exécuter dans le projet Supabase « Les Carnets ».
-- ----------------------------------------------------------------------------
--  Pendant technique de `client_errors` (migration 0020), mais pour ce qu'aucune
--  trace ne dira jamais : ce qui manque, ce qui agace, ce qu'on n'a pas compris.
--  Une erreur signale ce qui plante ; un avis signale ce qui déçoit.
--
--  Écriture ouverte (on peut vouloir écrire sans compte), lecture de ses
--  propres avis, et **lecture complète réservée aux administrateurs**.
-- ============================================================================

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),

  -- Null si l'avis est déposé sans être connecté.
  user_id uuid references auth.users (id) on delete set null,

  -- Quel carnet : 'recettes' | 'budget' | 'sport' | 'vitrine'.
  app text not null,

  -- Nature du retour, pour trier sans avoir à tout lire.
  kind text not null,

  -- Satisfaction de 1 à 5. Facultative : on n'oblige pas à noter pour parler.
  rating smallint,

  message text not null,

  -- Page depuis laquelle l'avis est envoyé (chemin seul, jamais les
  -- paramètres d'URL). Précieux pour situer un « ça ne marche pas ».
  path text,

  -- Adresse laissée volontairement pour obtenir une réponse.
  contact_email text,

  -- Suivi du traitement : 'new' | 'read' | 'done'.
  status text not null default 'new',

  created_at timestamptz not null default now(),

  constraint feedback_app_valid check (
    app in ('recettes', 'budget', 'sport', 'vitrine')
  ),
  constraint feedback_kind_valid check (
    kind in ('bug', 'idea', 'praise', 'other')
  ),
  constraint feedback_status_valid check (
    status in ('new', 'read', 'done')
  ),
  constraint feedback_rating_valid check (
    rating is null or rating between 1 and 5
  ),
  -- Un avis vide n'apprend rien ; la borne haute évite les envois abusifs.
  constraint feedback_message_sane check (
    length(btrim(message)) between 1 and 4000
  ),
  constraint feedback_email_sane check (
    contact_email is null or length(contact_email) <= 320
  )
);

create index if not exists feedback_created_idx
  on public.feedback (created_at desc);
create index if not exists feedback_status_created_idx
  on public.feedback (status, created_at desc);
create index if not exists feedback_user_idx
  on public.feedback (user_id);

alter table public.feedback enable row level security;

-- Écriture : chacun ne dépose qu'un avis non attribué ou le sien.
drop policy if exists feedback_insert on public.feedback;
create policy feedback_insert on public.feedback
  for insert to anon, authenticated
  with check (user_id is null or user_id = auth.uid());

-- Lecture : ses propres avis (pour les retrouver), et tout pour l'admin.
drop policy if exists feedback_select_own on public.feedback;
create policy feedback_select_own on public.feedback
  for select using (user_id is not null and user_id = auth.uid());

drop policy if exists feedback_select_admin on public.feedback;
create policy feedback_select_admin on public.feedback
  for select using (public.is_admin());

-- Le suivi du traitement et la suppression restent à l'administrateur.
drop policy if exists feedback_update_admin on public.feedback;
create policy feedback_update_admin on public.feedback
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists feedback_delete_admin on public.feedback;
create policy feedback_delete_admin on public.feedback
  for delete using (public.is_admin());
