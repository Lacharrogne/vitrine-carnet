import { supabase } from './supabase'

export type CarnetId = 'recettes' | 'budget' | 'sport'

export type SubscriptionRow = {
  status: string
  /** Carnet(s) débloqué(s) : 'recettes' | 'budget' | 'sport' | 'all' | null. */
  plan: string | null
  endsAt: string | null
  renewsAt: string | null
  customerPortalUrl: string | null
  source: string
}

/** L'abonnement est-il actif à l'instant présent (quel que soit le plan) ? */
export function isSubscriptionActive(row: SubscriptionRow | null): boolean {
  if (!row) return false
  if (row.status === 'active' || row.status === 'on_trial') return true
  if (row.status === 'cancelled' && row.endsAt) {
    return new Date(row.endsAt).getTime() > Date.now()
  }
  return false
}

/** Un plan donne-t-il accès à un carnet précis ? (null et 'all' = tout.) */
export function planGrantsCarnet(
  plan: string | null,
  carnet: CarnetId,
): boolean {
  return plan === null || plan === 'all' || plan === carnet
}

/** Liste des carnets réellement débloqués par un abonnement ACTIF. */
export function ownedCarnets(row: SubscriptionRow | null): CarnetId[] {
  if (!isSubscriptionActive(row)) return []
  return (['recettes', 'budget', 'sport'] as CarnetId[]).filter((carnet) =>
    planGrantsCarnet(row?.plan ?? null, carnet),
  )
}

/** Lit l'abonnement de l'utilisateur (sa propre ligne, protégée par RLS). */
export async function getSubscription(
  userId: string,
): Promise<SubscriptionRow | null> {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('subscriptions')
    .select('status, plan, ends_at, renews_at, customer_portal_url, source')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    console.error('getSubscription', error)
    return null
  }
  if (!data) return null

  return {
    status: (data.status as string) ?? 'none',
    plan: (data.plan as string | null) ?? null,
    endsAt: data.ends_at ?? null,
    renewsAt: data.renews_at ?? null,
    customerPortalUrl: data.customer_portal_url ?? null,
    source: (data.source as string) ?? 'lemonsqueezy',
  }
}
