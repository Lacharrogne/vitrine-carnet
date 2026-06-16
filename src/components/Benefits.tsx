import { Heart, LayoutGrid, ShieldCheck, Sparkles } from 'lucide-react'

const BENEFITS = [
  {
    icon: LayoutGrid,
    title: 'Tout au même endroit',
    description:
      'Vos recettes, votre budget, votre forme : un seul esprit, des carnets qui se parlent. Fini de chercher dans dix applis.',
  },
  {
    icon: Heart,
    title: 'Clair et rassurant',
    description:
      'Des chiffres et des suivis présentés avec douceur, pour vous éclairer sans jamais vous culpabiliser.',
  },
  {
    icon: Sparkles,
    title: 'Beau au quotidien',
    description:
      'Une interface premium, calme et soignée, agréable à ouvrir chaque jour — parce que le quotidien mérite du beau.',
  },
  {
    icon: ShieldCheck,
    title: 'Vos données privées',
    description:
      'Sans publicité, sans revente. Ce que vous notez reste à vous, protégé et en sécurité.',
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
              Les bénéfices au quotidien
            </p>
            <h2 className="mt-2 max-w-2xl font-display text-3xl font-black leading-tight text-white sm:text-4xl">
              Plus que des applis, un quotidien plus calme
            </h2>

            <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
