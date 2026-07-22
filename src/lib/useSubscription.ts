import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'

import {
  getSubscription,
  isSubscriptionActive,
  type SubscriptionRow,
} from './subscriptionService'

/** Abonnement de l'utilisateur connecté (statut premium + portail client). */
export function useSubscription(session: Session | null) {
  const [subscription, setSubscription] = useState<SubscriptionRow | null>(null)
  const [loading, setLoading] = useState(false)

  const userId = session?.user.id ?? null

  useEffect(() => {
    let ignore = false

    if (!userId) {
      setSubscription(null)
      return
    }

    setLoading(true)
    getSubscription(userId).then((row) => {
      if (!ignore) {
        setSubscription(row)
        setLoading(false)
      }
    })

    return () => {
      ignore = true
    }
  }, [userId])

  return {
    subscription,
    isPremium: isSubscriptionActive(subscription),
    portalUrl: subscription?.customerPortalUrl ?? null,
    loading,
  }
}
