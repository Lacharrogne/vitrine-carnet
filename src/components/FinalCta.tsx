import { Sparkles } from 'lucide-react'

import Button from './Button'

export default function FinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
      <div className="relative overflow-hidden rounded-[2rem] bg-espresso px-6 py-12 text-center shadow-lift sm:rounded-[2.5rem] sm:px-10 sm:py-16">
        <div className="animate-glow pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-terracotta/30 blur-3xl" />
        <div className="animate-glow pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-azure/20 blur-3xl" />

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-cream-100">
            <Sparkles className="h-4 w-4" />
            Essai gratuit · sans engagement
          </span>

          <h2 className="mx-auto mt-5 max-w-2xl font-display text-3xl font-black leading-tight text-white sm:text-4xl">
            Commencez avec le carnet qu'il vous faut
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-cream-100/85">
            Vos recettes, votre argent, votre forme — réunis au même endroit,
            avec le même soin. Choisissez le carnet qui vous ressemble et
            lancez-vous.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              href="#carnets"
              external={false}
              size="lg"
              className="w-full sm:w-auto"
            >
              Découvrir les carnets
            </Button>

            <a
              href="#tarifs"
              className="inline-flex w-full items-center justify-center rounded-full border border-white/30 bg-white/10 px-7 py-4 font-bold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-white/20 sm:w-auto"
            >
              Voir les tarifs
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
