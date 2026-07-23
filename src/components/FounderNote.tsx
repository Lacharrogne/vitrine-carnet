import { Heart, Shield, Sparkles } from 'lucide-react'

const PROMISES = [
  {
    icon: Heart,
    title: 'Fait maison, avec soin',
    text: "Des applis qu'on utilise nous-mêmes, au quotidien — pensées pour durer, pas pour impressionner.",
  },
  {
    icon: Shield,
    title: 'Vos données restent privées',
    text: 'Pas de publicité, pas de revente de données. Vos recettes et vos comptes n’appartiennent qu’à vous.',
  },
  {
    icon: Sparkles,
    title: 'Simple, sans engagement',
    text: 'Essai gratuit sans carte bancaire, résiliable à tout moment. Vous gardez la main.',
  },
]

export default function FounderNote() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
      <div className="relative overflow-hidden rounded-[2rem] bg-card p-8 shadow-card ring-1 ring-bark sm:p-12">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-terracotta/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-sage/10 blur-3xl" />

        <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
          {/* Intention */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3.5 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-terracotta shadow-soft ring-1 ring-bark">
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              Notre intention
            </span>

            <h2 className="mt-4 font-display text-3xl font-black leading-tight text-espresso sm:text-4xl">
              Un carnet né à la maison
            </h2>

            <p className="mt-4 text-lg leading-8 text-cacao/80">
              «&nbsp;Les Carnets, c’est parti d’un besoin tout simple : arrêter
              de chercher nos recettes partout, y voir clair dans nos dépenses,
              garder le rythme côté sport. On a voulu des applis douces, sans
              publicité, qui respectent vos données — celles qu’on a envie
              d’utiliser soi-même, en famille.&nbsp;»
            </p>

            <p className="mt-5 font-hand text-3xl text-terracotta">
              L’équipe Les Carnets
            </p>
          </div>

          {/* Engagements */}
          <div className="grid gap-4">
            {PROMISES.map((promise) => {
              const Icon = promise.icon
              return (
                <div
                  key={promise.title}
                  className="flex gap-4 rounded-2xl bg-paper p-5 ring-1 ring-bark"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-terracotta-soft text-terracotta-deep">
                    <Icon className="h-5 w-5" />
                  </span>

                  <div>
                    <p className="font-bold text-espresso">{promise.title}</p>
                    <p className="mt-1 text-sm leading-6 text-cacao/80">
                      {promise.text}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
