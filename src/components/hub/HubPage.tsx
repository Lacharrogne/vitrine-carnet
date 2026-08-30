import { useState } from 'react'
import { ArrowRight, Check, Lock, Sparkles } from 'lucide-react'
import type { Session } from '@supabase/supabase-js'

import { BRAND, CARNETS } from '../../config'
import { CHECKOUT, PRICES, buildCheckoutUrl } from '../../lib/subscription'
import { useSubscription } from '../../lib/useSubscription'
import { planGrantsCarnet, type CarnetId } from '../../lib/subscriptionService'

const DAY_MS = 24 * 60 * 60 * 1000
const TRIAL_DAYS = 14

type HubPageProps = {
  session: Session
}

export default function HubPage({ session }: HubPageProps) {
  const [yearly, setYearly] = useState(false)
  const { subscription, isPremium, portalUrl } = useSubscription(session)

  const user = session.user
  const plan = subscription?.plan ?? null

  // Essai gratuit (débloque tout) tant qu'on n'est pas abonné payant.
  const createdAt = user.created_at ? new Date(user.created_at) : null
  const trialEndsAt = createdAt
    ? new Date(createdAt.getTime() + TRIAL_DAYS * DAY_MS)
    : null
  const trialDaysLeft = trialEndsAt
    ? Math.max(0, Math.ceil((trialEndsAt.getTime() - Date.now()) / DAY_MS))
    : 0
  const trialActive = !isPremium && trialDaysLeft > 0

  const hasAll = isPremium && (plan === 'all' || plan === null)
  const ownsSingle =
    isPremium && plan !== null && plan !== 'all'

  const checkout = (baseUrl: string) =>
    buildCheckoutUrl(baseUrl, { userId: user.id, email: user.email ?? undefined })

  const allCheckout = checkout(yearly ? CHECKOUT.all.yearly : CHECKOUT.all.monthly)
  const allPrice = yearly ? PRICES.all.yearly : PRICES.all.monthly
  const singlePrice = yearly ? PRICES.single.yearly : PRICES.single.monthly
  const period = yearly ? '/ an' : '/ mois'

  const isCarnetAccessible = (id: string) =>
    trialActive || (isPremium && planGrantsCarnet(plan, id as CarnetId))

  // État de l'abonnement (affichage).
  const planLabel =
    plan === 'recettes'
      ? 'Carnet de recettes'
      : plan === 'budget'
        ? 'Carnet de budget'
        : plan === 'sport'
          ? 'Carnet de sport'
          : 'Les Carnets'
  const isCancelled = subscription?.status === 'cancelled'
  const subEndsAt = subscription?.endsAt ? new Date(subscription.endsAt) : null
  const subRenewsAt = subscription?.renewsAt
    ? new Date(subscription.renewsAt)
    : null

  return (
    <div className="paper-grain min-h-screen">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:py-12">
        {/* Barre haute */}
        <div className="flex items-center justify-between gap-3">
          <a href="#top" className="flex items-center gap-2.5">
            <img
              src={BRAND.logo}
              alt={BRAND.name}
              className="h-10 w-10 object-contain"
            />
            <span className="font-display text-lg font-black text-espresso">
              {BRAND.name}
            </span>
          </a>

          <a
            href="#top"
            className="rounded-full border border-bark bg-card px-4 py-2 text-sm font-bold text-cacao transition hover:bg-linen"
          >
            Retour au site
          </a>
        </div>

        {/* En-tête / statut */}
        <header className="mt-8 rounded-[2rem] bg-card p-7 shadow-card ring-1 ring-bark sm:p-9">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-terracotta">
            Mon espace
          </p>
          <h1 className="mt-3 font-display text-3xl font-black text-espresso sm:text-4xl">
            Vos carnets
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-hazel">
            {hasAll
              ? 'Votre abonnement complet débloque les trois carnets. Ouvrez celui que vous voulez.'
              : ownsSingle
                ? 'Vous avez débloqué un carnet. Ajoutez-en ou passez à l’offre complète.'
                : trialActive
                  ? `Essai gratuit en cours — ${trialDaysLeft} jour${
                      trialDaysLeft > 1 ? 's' : ''
                    } restant${trialDaysLeft > 1 ? 's' : ''}, tous les carnets inclus.`
                  : 'Votre essai est terminé. Choisissez un carnet, ou débloquez tout.'}
          </p>

          {isPremium ? (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-sage-soft px-3 py-1.5 text-xs font-black text-sage-deep">
                Formule : {planLabel}
              </span>

              {isCancelled && subEndsAt ? (
                <span className="rounded-full bg-honey-soft px-3 py-1.5 text-xs font-black text-[#9a6a26]">
                  Résilié — accès jusqu’au {formatDate(subEndsAt)}
                </span>
              ) : subRenewsAt ? (
                <span className="text-xs font-bold text-hazel">
                  Renouvellement le {formatDate(subRenewsAt)}
                </span>
              ) : null}

              {portalUrl ? (
                <a
                  href={portalUrl}
                  className="inline-flex items-center gap-2 rounded-full border border-bark bg-card px-5 py-2 text-sm font-bold text-cacao transition hover:bg-linen"
                >
                  Gérer mon abonnement
                </a>
              ) : null}
            </div>
          ) : null}
        </header>

        {/* Offre globale mise en avant (sauf si déjà tout débloqué) */}
        {!hasAll ? (
          <section className="relative mt-6 overflow-hidden rounded-[2rem] bg-espresso p-7 text-white shadow-lift sm:p-9">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-terracotta/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-honey/20 blur-3xl" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-honey px-3 py-1.5 text-xs font-black text-espresso">
                  <Sparkles className="h-3.5 w-3.5" />
                  Meilleure offre
                </span>
                <h2 className="mt-3 font-display text-2xl font-black sm:text-3xl">
                  Tout débloquer — Les Carnets
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-cream-100/80">
                  Les trois carnets réunis. À partir de 2 carnets, c’est déjà
                  moins cher que deux abonnements séparés — et le 3ᵉ est offert.
                </p>
              </div>

              <div className="shrink-0 text-center">
                <div className="flex items-end justify-center gap-1">
                  <span className="font-display text-4xl font-black">
                    {allPrice}
                  </span>
                  <span className="mb-1 text-sm font-semibold text-cream-100/80">
                    {period}
                  </span>
                </div>

                <a
                  href={allCheckout || undefined}
                  className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-honey px-7 py-3 text-sm font-black text-espresso shadow-soft transition hover:-translate-y-0.5 ${
                    allCheckout ? '' : 'pointer-events-none opacity-60'
                  }`}
                >
                  {allCheckout ? 'Tout débloquer' : 'Bientôt disponible'}
                </a>
              </div>
            </div>
          </section>
        ) : null}

        {/* Bascule mensuel / annuel */}
        {!hasAll ? (
          <div className="mt-6 flex items-center justify-center gap-3">
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
              {PRICES.yearlySavings}
            </span>
          </div>
        ) : null}

        {/* Cartes carnet */}
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
          {CARNETS.map((carnet) => {
            const accessible = isCarnetAccessible(carnet.id)
            const paidOwned =
              isPremium && planGrantsCarnet(plan, carnet.id as CarnetId)
            const singleCheckout = checkout(
              yearly
                ? CHECKOUT[carnet.id as CarnetId].yearly
                : CHECKOUT[carnet.id as CarnetId].monthly,
            )

            return (
              <article
                key={carnet.id}
                className="flex flex-col rounded-[2rem] bg-card p-6 shadow-card ring-1 ring-bark"
              >
                <div className="flex items-start justify-between gap-3">
                  <img
                    src={carnet.logo}
                    alt={carnet.name}
                    className="h-14 w-14 object-contain"
                  />
                  {paidOwned ? (
                    <span className="rounded-full bg-sage-soft px-3 py-1 text-xs font-black text-sage-deep">
                      Actif
                    </span>
                  ) : accessible ? (
                    <span className="rounded-full bg-honey-soft px-3 py-1 text-xs font-black text-[#9a6a26]">
                      Inclus dans l’essai
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 rounded-full bg-linen px-3 py-1 text-xs font-black text-hazel">
                      <Lock className="h-3 w-3" /> Verrouillé
                    </span>
                  )}
                </div>

                <h3 className="mt-4 font-display text-xl font-black text-espresso">
                  {carnet.name}
                </h3>
                <p className="mt-1 text-sm text-hazel">{carnet.tagline}</p>

                <ul className="mt-4 space-y-2">
                  {carnet.highlights.slice(0, 3).map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-2 text-sm leading-6 text-cacao"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage-deep" />
                      {h}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-6">
                  {accessible ? (
                    <a
                      href={carnet.url ?? '#'}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-espresso px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5"
                    >
                      Ouvrir <ArrowRight className="h-4 w-4" />
                    </a>
                  ) : (
                    <>
                      <div className="mb-3 flex items-end gap-1">
                        <span className="font-display text-2xl font-black text-espresso">
                          {singlePrice}
                        </span>
                        <span className="mb-0.5 text-xs font-semibold text-hazel">
                          {period}
                        </span>
                      </div>
                      <a
                        href={singleCheckout || undefined}
                        className={`inline-flex w-full items-center justify-center gap-2 rounded-full border border-terracotta/30 bg-terracotta-soft px-5 py-3 text-sm font-black text-terracotta-deep transition hover:-translate-y-0.5 hover:bg-terracotta hover:text-white ${
                          singleCheckout ? '' : 'pointer-events-none opacity-60'
                        }`}
                      >
                        {singleCheckout ? 'Débloquer ce carnet' : 'Bientôt'}
                      </a>
                    </>
                  )}
                </div>
              </article>
            )
          })}
        </div>

        {/* Nudge : possède 1 carnet seul → pousse au global */}
        {ownsSingle ? (
          <section className="mt-6 rounded-[2rem] border border-terracotta/25 bg-terracotta-soft/60 p-6 text-center sm:p-7">
            <p className="font-display text-lg font-black text-espresso">
              Besoin d’un 2ᵉ carnet ?
            </p>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-cacao">
              Deux carnets à l’unité coûtent 4,98 € — l’offre complète est à{' '}
              {PRICES.all.monthly}/mois et débloque les trois. Passez au global,
              c’est tout bénéfice.
            </p>
            <a
              href={allCheckout || undefined}
              className={`mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-espresso px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 ${
                allCheckout ? '' : 'pointer-events-none opacity-60'
              }`}
            >
              Passer à l’offre complète
            </a>
          </section>
        ) : null}

        {/* Réassurance */}
        {!hasAll ? (
          <p className="mt-6 text-center text-sm font-semibold text-hazel">
            Sans engagement · résiliable à tout moment · paiement sécurisé
          </p>
        ) : null}
      </div>
    </div>
  )
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}
