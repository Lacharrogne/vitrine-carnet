import { CreditCard, KeyRound, PlusCircle, RefreshCw } from 'lucide-react'

const BENEFITS = [
  {
    icon: KeyRound,
    title: 'Un seul compte',
    description:
      'Connectez-vous une fois : vous êtes chez vous dans tous les carnets, sans jamais ressaisir vos identifiants.',
  },
  {
    icon: CreditCard,
    title: 'Un seul abonnement',
    description:
      'Un abonnement débloque tous les carnets — pas besoin de payer chaque application séparément.',
  },
  {
    icon: RefreshCw,
    title: 'Tout synchronisé',
    description:
      'Vos données réunies et toujours à jour, sur téléphone comme sur ordinateur, sans rien installer.',
  },
  {
    icon: PlusCircle,
    title: 'La suite s’agrandit',
    description:
      'De nouveaux carnets arrivent et rejoignent votre abonnement, sans rien changer pour vous.',
  },
]

export default function Benefits() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
        <div className="relative overflow-hidden rounded-[2rem] bg-espresso px-6 py-10 shadow-lift sm:rounded-[2.5rem] sm:px-10 sm:py-14">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-terracotta/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-azure/15 blur-3xl" />

          <div className="relative">
            <p className="text-sm font-bold uppercase tracking-[0.12em] text-honey">
              L’avantage de la suite
            </p>
            <h2 className="mt-2 max-w-2xl font-display text-3xl font-black leading-tight text-white sm:text-4xl">
              Un compte, un abonnement, tous vos carnets
            </h2>

            <div className="mt-9 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {BENEFITS.map((benefit) => {
                const Icon = benefit.icon

                return (
                  <div key={benefit.title}>
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                      <Icon className="h-5 w-5 text-honey" />
                    </span>
                    <h3 className="mt-4 font-display text-lg font-bold text-white">
                      {benefit.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-6 text-cream-100/80">
                      {benefit.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
