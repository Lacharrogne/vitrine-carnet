/**
 * Abonnement unique « Les Carnets » — un seul paiement débloque tous les
 * carnets. Les liens de checkout Lemon Squeezy viennent des variables d'env.
 */
export const LEMONSQUEEZY = {
  monthlyUrl: (import.meta.env.VITE_LS_MONTHLY_URL as string | undefined) ?? '',
  yearlyUrl: (import.meta.env.VITE_LS_YEARLY_URL as string | undefined) ?? '',
}

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
// Liens de checkout par défaut (boutique « carnet-de-recettes », mode TEST
// pour l'instant). Surchargés par les variables d'env si elles sont définies.
// ⚠️ Au passage en LIVE : remplacer par les liens de production (ou définir
// les variables d'env correspondantes).
const LS = 'https://carnet-de-recettes.lemonsqueezy.com/checkout/buy'

const DEFAULT_CHECKOUT = {
  recettes: {
    monthly: `${LS}/3a9199cd-8f72-4559-93ad-bcf14304b854?enabled=1948085`,
    yearly: `${LS}/45128758-cf8b-4491-a851-1da5efa22540?enabled=1948090`,
  },
  budget: {
    monthly: `${LS}/3ea70d0e-f89a-40f6-bf4f-db1d9506e232?enabled=1948105`,
    yearly: `${LS}/049dfd2c-cbf6-4367-a769-b2de1980ad4f?enabled=1948106`,
  },
  sport: {
    monthly: `${LS}/2c0c0e15-31fa-4378-8d57-f65df203dcd0?enabled=1948112`,
    yearly: `${LS}/02b31ec6-6fd5-4976-9b0d-888c056bebb3?enabled=1948113`,
  },
  all: {
    monthly: `${LS}/79d9381a-78f2-4d3f-a198-0d46a8da44dc?enabled=1938453`,
    yearly: `${LS}/1a1d891b-cf86-4b65-8fad-4442cadd1ed6?enabled=1938448`,
  },
}

export const CHECKOUT: Record<
  'recettes' | 'budget' | 'sport' | 'all',
  CheckoutCycle
> = {
  recettes: {
    monthly:
      envUrl('VITE_LS_RECETTES_MONTHLY_URL') || DEFAULT_CHECKOUT.recettes.monthly,
    yearly:
      envUrl('VITE_LS_RECETTES_YEARLY_URL') || DEFAULT_CHECKOUT.recettes.yearly,
  },
  budget: {
    monthly:
      envUrl('VITE_LS_BUDGET_MONTHLY_URL') || DEFAULT_CHECKOUT.budget.monthly,
    yearly:
      envUrl('VITE_LS_BUDGET_YEARLY_URL') || DEFAULT_CHECKOUT.budget.yearly,
  },
  sport: {
    monthly:
      envUrl('VITE_LS_SPORT_MONTHLY_URL') || DEFAULT_CHECKOUT.sport.monthly,
    yearly:
      envUrl('VITE_LS_SPORT_YEARLY_URL') || DEFAULT_CHECKOUT.sport.yearly,
  },
  all: {
    monthly:
      envUrl('VITE_LS_ALL_MONTHLY_URL') ||
      LEMONSQUEEZY.monthlyUrl ||
      DEFAULT_CHECKOUT.all.monthly,
    yearly:
      envUrl('VITE_LS_ALL_YEARLY_URL') ||
      LEMONSQUEEZY.yearlyUrl ||
      DEFAULT_CHECKOUT.all.yearly,
  },
}

/** Le paiement est-il configuré (au moins un lien de checkout pour le global) ? */
export const IS_BILLING_CONFIGURED = Boolean(
  CHECKOUT.all.monthly || CHECKOUT.all.yearly,
)

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
