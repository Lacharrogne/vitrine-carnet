import { ArrowRight, Sparkles } from 'lucide-react'

import { CARNETS } from '../config'
import Button from './Button'

const ACCENT_DOT: Record<string, string> = {
  terracotta: 'bg-terracotta',
  sage: 'bg-sage-deep',
  azure: 'bg-azure',
  honey: 'bg-honey',
}

const ACCENT_TILE: Record<string, string> = {
  terracotta: 'bg-terracotta-soft',
  sage: 'bg-sage-soft',
  azure: 'bg-azure-soft',
  honey: 'bg-honey-soft',
}

const PREVIEW_CARNETS = CARNETS.slice(0, 3)

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 pb-12 pt-12 sm:pb-16 sm:pt-16 lg:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          {/* ── Texte ── */}
          <div className="reveal flex flex-col">
            <span className="flex w-fit items-center gap-2 rounded-full bg-terracotta-soft px-4 py-2 text-sm font-bold text-terracotta-deep">
              <Sparkles className="h-4 w-4" />
              L’écosystème « Carnet »
            </span>

            <h1 className="mt-5 font-display text-4xl font-black leading-[1.08] text-espresso sm:text-5xl lg:text-6xl">
              Une vie organisée,
              <br />
              <span className="text-terracotta">carnet après carnet</span>.
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-8 text-cacao/80">
              Vos recettes, votre argent, votre forme : une famille
              d’applications claires et chaleureuses, pensées avec le même soin.
              Choisissez le carnet dont vous avez besoin — ils parlent tous la
              même langue.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="#carnets" external={false} size="lg">
                Découvrir les carnets
                <ArrowRight className="h-4 w-4" />
              </Button>

              <Button
                href="#fonctionnalites"
                external={false}
                variant="secondary"
                size="lg"
              >
                Pourquoi Les Carnets
              </Button>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2">
              {['14 jours d’essai gratuit', 'Sans publicité', 'Vos données privées'].map(
                (label) => (
                  <span
                    key={label}
                    className="flex items-center gap-1.5 text-sm font-semibold text-hazel"
                  >
                    <span className="text-sage-deep">✓</span>
                    {label}
                  </span>
                ),
              )}
            </div>
          </div>

          {/* ── Aperçu de l'écosystème ── */}
          <div className="reveal relative mx-auto w-full max-w-sm lg:mx-0">
            <div className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-terracotta/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-azure/15 blur-3xl" />

            <div className="absolute -right-3 -top-3 z-10 flex items-center gap-1.5 rounded-full bg-espresso px-3 py-1.5 shadow-lift">
              <Sparkles className="h-3 w-3 text-honey" />
              <span className="text-xs font-black text-white">3 carnets</span>
            </div>

            <div className="relative rounded-[2rem] bg-linen p-4 shadow-lift ring-1 ring-bark">
              {/* En-tête mockup */}
              <div className="mb-4 flex items-center justify-between px-1">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-terracotta">
                    Mon étagère
                  </p>
                  <p className="font-display text-lg font-bold text-espresso">
                    Mes carnets
                  </p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-terracotta text-lg font-bold text-white shadow-soft">
                  +
                </div>
              </div>

              {/* Carnets */}
              <div className="space-y-2">
                {PREVIEW_CARNETS.map((carnet, i) => (
                  <div
                    key={carnet.id}
                    className={`flex items-center gap-3 rounded-xl bg-card p-3 ring-1 ${
                      i === 0 ? 'ring-terracotta/40' : 'ring-bark'
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xl ${
                        ACCENT_TILE[carnet.accent]
                      }`}
                    >
                      {carnet.emoji}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-espresso">
                        {carnet.name}
                      </p>
                      <p className="truncate text-xs text-hazel">
                        {carnet.tagline}
                      </p>
                    </div>
                    <span
                      className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                        ACCENT_DOT[carnet.accent]
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* Pied mockup */}
              <div className="mt-3 rounded-xl bg-honey-soft p-3 ring-1 ring-bark">
                <p className="mb-2 text-xs font-bold text-hazel">
                  ✨ Essai gratuit, sans carte
                </p>
                <p className="text-xs leading-5 text-cacao">
                  Testez chaque carnet librement, puis gardez seulement celui
                  qui vous ressemble.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
