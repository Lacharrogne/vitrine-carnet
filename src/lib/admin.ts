import { supabase } from './supabase'

export type AdminOverview = {
  users_total: number
  admins: number
  premium: number
  comp: number
  recipes: number
  accounts: number
  transactions: number
  workouts: number
  planned_workouts: number
}

export type AdminUser = {
  user_id: string
  email: string
  username: string | null
  role: string
  created_at: string
  sub_status: string
  sub_source: string
  recipes_count: number
  transactions_count: number
  workouts_count: number
}

function client() {
  if (!supabase) {
    throw new Error('Supabase n’est pas configuré sur cette page.')
  }
  return supabase
}

/** Rôle de l'utilisateur courant (`user` / `admin`). */
export async function getMyRole(userId: string): Promise<string> {
  const { data, error } = await client()
    .from('profiles')
    .select('role')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error
  return (data?.role as string | undefined) ?? 'user'
}

/** Chiffres globaux (null si l'appelant n'est pas admin). */
export async function getOverview(): Promise<AdminOverview | null> {
  const { data, error } = await client().rpc('admin_overview')
  if (error) throw error
  return (data as AdminOverview | null) ?? null
}

/** Liste des utilisateurs avec activité par carnet. */
export async function listUsers(): Promise<AdminUser[]> {
  const { data, error } = await client().rpc('admin_users')
  if (error) throw error
  return (data as AdminUser[] | null) ?? []
}

export async function setRole(userId: string, role: 'user' | 'admin') {
  const { error } = await client().rpc('admin_set_role', {
    target_user_id: userId,
    new_role: role,
  })
  if (error) throw error
}

export async function grantComp(email: string) {
  const { error } = await client().rpc('grant_comp_access', {
    target_email: email,
  })
  if (error) throw error
}

export async function revokeComp(email: string) {
  const { error } = await client().rpc('revoke_comp_access', {
    target_email: email,
  })
  if (error) throw error
}

export async function deleteUser(userId: string) {
  const { error } = await client().rpc('admin_delete_user', {
    target_user_id: userId,
  })
  if (error) throw error
}

/* -------------------------------------------------------------------------- */
/*  Erreurs rencontrées par les utilisateurs (table `client_errors`)           */
/* -------------------------------------------------------------------------- */

export type ClientError = {
  id: string
  user_id: string | null
  app: string
  message: string
  stack: string | null
  path: string | null
  user_agent: string | null
  created_at: string
}

/**
 * Dernières erreurs remontées, les plus récentes d'abord.
 *
 * La RLS réserve déjà la lecture aux administrateurs : un non-admin reçoit
 * simplement une liste vide.
 */
export async function listClientErrors(limit = 200): Promise<ClientError[]> {
  const { data, error } = await client()
    .from('client_errors')
    .select('id, user_id, app, message, stack, path, user_agent, created_at')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return (data as ClientError[] | null) ?? []
}

/** Supprime les erreurs plus vieilles que `days` jours. Renvoie le nombre effacé. */
export async function purgeClientErrors(days: number): Promise<number> {
  const { data, error } = await client().rpc('purge_client_errors', { days })
  if (error) throw error
  return (data as number | null) ?? 0
}
