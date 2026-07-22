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
