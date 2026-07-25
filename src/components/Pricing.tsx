import { useState } from 'react'
import { Check, Sparkles } from 'lucide-react'
import type { Session } from '@supabase/supabase-js'

import { PRICING } from '../config'
import {
  IS_BILLING_CONFIGURED,
  LEMONSQUEEZY,
  buildCheckoutUrl,
} from '../lib/subscription'
import { useSubscription } from '../lib/useSubscription'
import Button from './Button'
import SectionHeader from './SectionHeader'

type PricingProps = {
  session: Session | null
  onOpenAuth: () => void
}

/**
 * Tout est inclus, aussi bien pendant l'essai gratuit qu'avec l'abonnement.
 * Le modèle est simple : on essaie librement, puis on s'abonne pour continuer.
 */
const INCLUDED = [
  'Accès complet à toutes les fonctionnalités',
  'Toutes vos données réunies et synchronisées',
  'Application web, sur mobile comme sur ordinateur',
  'Export & impression soignés',
  'Sauvegarde automatique',
  'Sans publicité, vos données privées',
  'Mises à jour et nouveautés en continu',
]

const REASSURANCE = [
  '✅ Essai sans carte bancaire',
  '↩️ Sans engagement, résiliable à tout moment',
  '🔐 Vos données restent privées',
]

export default function Pricing({ session, onOpenAuth }: PricingProps) {
  const [yearly, setYearly] = useState(false)

  const { isPremium, portalUrl } = useSubscription(session)

  const premiumPrice = yearly
    ? PRICING.premium.priceYearly
    : PRICING.premium.priceMonthly
  const premiumPeriod = yearly
    ? PRICING.premium.periodYearly
    : PRICING.premium.periodMonthly

  const user = session?.user ?? null

  const checkoutUrl = user
    ? buildCheckoutUrl(
        yearly ? LEMONSQUEEZY.yearlyUrl : LEMONSQUEEZY.monthlyUrl,
        { userId: user.id, email: user.email ?? undefined },
      )
    : ''

  // Abonné : on remplace les cartes de prix par la gestion de l'abonnement.
  if (user && isPremium) {
    return (
      <section id="tarifs" className="scroll-mt-20">
        <div className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
          <div className="rounded-[2rem] bg-card p-8 text-center shadow-card ring-1 ring-bark sm:p-10">
            <p className="text-4xl">🎉</p>
            <h2 className="mt-3 font-display text-2xl font-black text-espresso sm:text-3xl">
              Vous êtes abonné à « Les Carnets »
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-base leading-7 text-hazel">
              Votre abonnement débloque tous les carnets. Vous pouvez le gérer
              (changer de carte, résilier) à tout moment depuis votre espace
              client — résiliable sans engagement.
            </p>

            {portalUrl ? (
              <Button href={portalUrl} size="lg" className="mt-7">
                Gérer mon abonnement
              </Button>
            ) : (
              <p className="mt-7 text-sm font-semibold text-hazel">
                Accès offert — rien à gérer. Bonne dégustation !
              </p>
            )}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="tarifs" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
        <SectionHeader
          centered
          eyebrow="Offres & tarifs"
          title="Essayez librement, abonnez-vous si vous adorez"
          subtitle={`${PRICING.trialDays} jours d'essai gratuit avec toutes les fonctionnalités, sans carte bancaire. Ensuite, un abonnement simple qui débloque tout — le même principe pour chaque carnet.`}
        />

        {/* Bascule mensuel / annuel */}
        <div className="mt-7 flex items-center justify-center gap-3">
          <span
            className={`text-sm font-bold ${yearly ? 'text-hazel' : 'text-espresso'}`}
          >
            Mensuel
          </span>

          <button
            type="button"
            role="switch"
            aria-checked={yearly}
            onClick={() => setYearly((v) => !v)}
            className={`relative h-7 w-12 rounded-full ring-1 transition ${
              yearly ? 'bg-terracotta ring-terracotta' : 'bg-linen ring-bark'
            }`}
            aria-label="Basculer entre tarif mensuel et annuel"
          >
            <span
              className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-soft transition ${
                yearly ? 'left-[1.4rem]' : 'left-0.5'
              }`}
            />
          </button>

          <span
            className={`text-sm font-bold ${yearly ? 'text-espresso' : 'text-hazel'}`}
          >
            Annuel
          </span>

          <span className="rounded-full bg-sage-soft px-2.5 py-1 text-xs font-black text-sage-deep">
            {PRICING.premium.yearlySavings}
          </span>
        </div>

        {/* Cartes */}
        <div className="mt-8 grid items-stretch gap-6 lg:grid-cols-2">
          {/* Essai gratuit */}
          <div className="flex flex-col rounded-[2rem] bg-card p-6 shadow-card ring-1 ring-bark sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage-soft text-2xl">
                  🌱
                </span>
                <div>
                  <p className="font-display text-xl font-bold text-espresso">
                    Essai gratuit
                  </p>
                  <p className="text-sm text-hazel">Pour vous faire votre avis</p>
                </div>
              </div>

              <span className="rounded-full bg-sage-soft px-3 py-1.5 text-xs font-black text-sage-deep">
                {PRICING.trialDays} jours
              </span>
            </div>

            <div className="mt-6 flex items-end gap-1">
              <span className="font-display text-5xl font-black text-espresso">
                0 €
              </span>
              <span className="mb-1.5 text-sm font-semibold text-hazel">
                pendant {PRICING.trialDays} jours
              </span>
            </div>

            <p className="mt-3 text-sm leading-6 text-cacao/80">
              Toutes les fonctionnalités, sans carte bancaire. Vous décidez à la
              fin de l'essai — sans aucune mauvaise surprise.
            </p>

            <ul className="mt-6 space-y-3">
              {INCLUDED.slice(0, 4).map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-sm font-medium leading-6 text-cacao"
                >
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-sage-deep" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-8">
              {user ? (
                <Button
                  href="#carnets"
                  external={false}
                  variant="secondary"
                  size="lg"
                  fullWidth
                >
                  Ouvrir mes carnets
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  onClick={onOpenAuth}
                >
                  Commencer l'essai gratuit
                </Button>
              )}
            </div>
          </div>

          {/* Abonnement */}
          <div className="relative flex flex-col overflow-hidden rounded-[2rem] bg-espresso p-6 text-white shadow-lift ring-1 ring-espresso sm:p-8">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-terracotta/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-honey/20 blur-3xl" />

            <div className="relative flex flex-1 flex-col">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-2xl">
                    🧡
                  </span>
                  <div>
                    <p className="font-display text-xl font-bold">Abonnement</p>
                    <p className="text-sm text-cream-100/80">
                      Pour continuer sans limite
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-honey px-3 py-1.5 text-xs font-black text-espresso">
                  <Sparkles className="h-3.5 w-3.5" />
                  Tout inclus
                </span>
              </div>

              <div className="mt-6 flex items-end gap-1">
                <span className="font-display text-5xl font-black">
                  {premiumPrice}
                </span>
                <span className="mb-1.5 text-sm font-semibold text-cream-100/80">
                  {premiumPeriod}
                </span>
              </div>

              <p className="mt-1 text-sm text-cream-100/70">
                Soit moins qu'un café par mois, pour un accès complet.
              </p>

              <ul className="mt-6 space-y-3">
                {INCLUDED.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm font-medium leading-6 text-cream-100"
                  >
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-honey" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-8">
                {IS_BILLING_CONFIGURED && user ? (
                  <Button
                    href={checkoutUrl}
                    variant="honey"
                    size="lg"
                    fullWidth
                  >
                    S'abonner
                  </Button>
                ) : (
                  <Button
                    variant="honey"
                    size="lg"
                    fullWidth
                    onClick={onOpenAuth}
                  >
                    {IS_BILLING_CONFIGURED
                      ? "Créer un compte pour s'abonner"
                      : "Commencer l'essai gratuit"}
                  </Button>
                )}

                <p className="mt-3 text-center text-xs font-semibold text-cream-100/70">
                  Essai de {PRICING.trialDays} jours, puis {premiumPrice}{' '}
                  {premiumPeriod} · sans engagement
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Carnet seul */}
        <p className="mt-6 text-center text-sm font-semibold text-hazel">
          Besoin d’un seul carnet ? Débloquez-le à partir de{' '}
          <span className="font-black text-espresso">
            {PRICING.single.priceMonthly}
          </span>{' '}
          / mois depuis{' '}
          <a href="#hub" className="font-black text-terracotta underline">
            votre espace
          </a>
          .
        </p>

        {/* Réassurance */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
          {REASSURANCE.map((item) => (
            <span key={item} className="text-sm font-semibold text-hazel">
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
