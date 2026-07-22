import { supabase } from './supabase'

export type SubscriptionRow = {
  status: string
  endsAt: string | null
  renewsAt: string | null
  customerPortalUrl: string | null
  source: string
}

/** L'abonnement donne-t-il accès premium à l'instant présent ? */
export function isSubscriptionActive(row: SubscriptionRow | null): boolean {
  if (!row) return false
  if (row.status === 'active' || row.status === 'on_trial') return true
  if (row.status === 'cancelled' && row.endsAt) {
    return new Date(row.endsAt).getTime() > Date.now()
  }
  return false
}

/** Lit l'abonnement de l'utilisateur (sa propre ligne, protégée par RLS). */
export async function getSubscription(
  userId: string,
): Promise<SubscriptionRow | null> {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('subscriptions')
    .select('status, ends_at, renews_at, customer_portal_url, source')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    console.error('getSubscription', error)
    return null
  }
  if (!data) return null

  return {
    status: (data.status as string) ?? 'none',
    endsAt: data.ends_at ?? null,
    renewsAt: data.renews_at ?? null,
    customerPortalUrl: data.customer_portal_url ?? null,
    source: (data.source as string) ?? 'lemonsqueezy',
  }
}
