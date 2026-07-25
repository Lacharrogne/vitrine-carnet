/**
 * Abonnement unique « Les Carnets » — un seul paiement débloque tous les
 * carnets. Les liens de checkout Lemon Squeezy viennent des variables d'env.
 */
export const LEMONSQUEEZY = {
  monthlyUrl: (import.meta.env.VITE_LS_MONTHLY_URL as string | undefined) ?? '',
  yearlyUrl: (import.meta.env.VITE_LS_YEARLY_URL as string | undefined) ?? '',
}

/** Le paiement est-il configuré (au moins un lien de checkout) ? */
export const IS_BILLING_CONFIGURED = Boolean(
  LEMONSQUEEZY.monthlyUrl || LEMONSQUEEZY.yearlyUrl,
)

const env = import.meta.env

function envUrl(key: string): string {
  return (env[key as keyof typeof env] as string | undefined) ?? ''
}

export type CheckoutCycle = { monthly: string; yearly: string }

/**
 * Liens de checkout Lemon Squeezy par formule (env). L'offre globale `all`
 * retombe sur les liens existants `LEMONSQUEEZY` si ses propres liens ne sont
 * pas encore renseignés (compatibilité).
 */
export const CHECKOUT: Record<
  'recettes' | 'budget' | 'sport' | 'all',
  CheckoutCycle
> = {
  recettes: {
    monthly: envUrl('VITE_LS_RECETTES_MONTHLY_URL'),
    yearly: envUrl('VITE_LS_RECETTES_YEARLY_URL'),
  },
  budget: {
    monthly: envUrl('VITE_LS_BUDGET_MONTHLY_URL'),
    yearly: envUrl('VITE_LS_BUDGET_YEARLY_URL'),
  },
  sport: {
    monthly: envUrl('VITE_LS_SPORT_MONTHLY_URL'),
    yearly: envUrl('VITE_LS_SPORT_YEARLY_URL'),
  },
  all: {
    monthly: envUrl('VITE_LS_ALL_MONTHLY_URL') || LEMONSQUEEZY.monthlyUrl,
    yearly: envUrl('VITE_LS_ALL_YEARLY_URL') || LEMONSQUEEZY.yearlyUrl,
  },
}

/** Grille tarifaire (affichage). */
export const PRICES = {
  single: { monthly: '2,49 €', yearly: '24,99 €' },
  all: { monthly: '3,99 €', yearly: '39,99 €' },
  yearlySavings: '2 mois offerts',
}

/**
 * Construit l'URL de checkout : pré-remplit l'email et joint le `user_id`
 * (compte commun) en donnée custom, renvoyée par le webhook pour rattacher
 * le paiement au bon compte.
 */
export function buildCheckoutUrl(
  baseUrl: string,
  { userId, email }: { userId: string; email?: string },
): string {
  if (!baseUrl) {
    return ''
  }

  const url = new URL(baseUrl)

  if (email) {
    url.searchParams.set('checkout[email]', email)
  }

  url.searchParams.set('checkout[custom][user_id]', userId)

  return url.toString()
}
