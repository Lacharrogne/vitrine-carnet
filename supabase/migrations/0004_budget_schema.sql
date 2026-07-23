-- ============================================================================
--  « LES CARNETS » — Schéma du Carnet de budget (données) dans le projet
--  commun. À exécuter dans le projet Supabase « Les Carnets ».
-- ----------------------------------------------------------------------------
--  `profiles` et `subscriptions` sont déjà là (partagés, migration 0001) :
--  on ne recrée QUE les 8 tables de données propres au Budget.
--
--  Les identifiants sont des uuid (`gen_random_uuid()`), comme sur l'ancien
--  projet Budget : on pourra insérer des id explicites pendant la migration
--  des données sans avoir à recaler de séquence.
--
--  Budget est strictement privé : chaque personne ne voit que SES données
--  (pas de partage public, pas d'accès admin) — RLS « propriétaire seul ».
-- ============================================================================

-- ---- accounts --------------------------------------------------------------
create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  type text not null,
  balance numeric not null default 0,
  emoji text,
  color_class text,
  holder text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---- debts -----------------------------------------------------------------
create table if not exists public.debts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  emoji text,
  total_amount numeric not null default 0,
  remaining_amount numeric not null default 0,
  monthly_payment numeric not null default 0,
  interest_rate numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---- saving_goals ----------------------------------------------------------
create table if not exists public.saving_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  emoji text,
  target_amount numeric not null default 0,
  current_amount numeric not null default 0,
  deadline date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---- sinking_funds ---------------------------------------------------------
create table if not exists public.sinking_funds (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  emoji text,
  target_amount numeric not null default 0,
  current_amount numeric not null default 0,
  monthly_contribution numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---- investments -----------------------------------------------------------
create table if not exists public.investments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  emoji text,
  type text,
  platform text,
  invested_amount numeric not null default 0,
  current_value numeric not null default 0,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---- transactions ----------------------------------------------------------
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  account_id uuid references public.accounts (id) on delete cascade,
  title text not null,
  amount numeric not null default 0,
  type text not null,
  category text,
  date date not null,
  note text,
  is_recurring boolean not null default false,
  to_account_id uuid references public.accounts (id) on delete set null,
  linked_debt_id uuid references public.debts (id) on delete set null,
  linked_saving_goal_id uuid references public.saving_goals (id) on delete set null,
  linked_sinking_fund_id uuid references public.sinking_funds (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---- recurring_payments ----------------------------------------------------
create table if not exists public.recurring_payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  account_id uuid references public.accounts (id) on delete cascade,
  title text not null,
  amount numeric not null default 0,
  category text,
  day_of_month integer not null default 1,
  is_active boolean not null default true,
  type text not null default 'expense',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---- monthly_budgets -------------------------------------------------------
create table if not exists public.monthly_budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  category text not null,
  limit_amount numeric not null default 0,
  month text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
--  RLS — « propriétaire seul » sur les 8 tables (aucun partage, aucun admin).
-- ============================================================================

alter table public.accounts enable row level security;
drop policy if exists accounts_all on public.accounts;
create policy accounts_all on public.accounts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.debts enable row level security;
drop policy if exists debts_all on public.debts;
create policy debts_all on public.debts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.saving_goals enable row level security;
drop policy if exists saving_goals_all on public.saving_goals;
create policy saving_goals_all on public.saving_goals for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.sinking_funds enable row level security;
drop policy if exists sinking_funds_all on public.sinking_funds;
create policy sinking_funds_all on public.sinking_funds for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.investments enable row level security;
drop policy if exists investments_all on public.investments;
create policy investments_all on public.investments for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.transactions enable row level security;
drop policy if exists transactions_all on public.transactions;
create policy transactions_all on public.transactions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.recurring_payments enable row level security;
drop policy if exists recurring_payments_all on public.recurring_payments;
create policy recurring_payments_all on public.recurring_payments for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.monthly_budgets enable row level security;
drop policy if exists monthly_budgets_all on public.monthly_budgets;
create policy monthly_budgets_all on public.monthly_budgets for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
