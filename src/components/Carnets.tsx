import { ArrowRight, Check } from 'lucide-react'

import { CARNETS, type CarnetAccent } from '../config'
import SectionHeader from './SectionHeader'

type AccentClasses = {
  ring: string
  glow: string
  badge: string
  emoji: string
  check: string
  button: string
  link: string
}

const ACCENTS: Record<CarnetAccent, AccentClasses> = {
  terracotta: {
    ring: 'ring-terracotta/25 hover:ring-terracotta/50',
    glow: 'bg-terracotta/15',
    badge: 'bg-terracotta-soft text-terracotta-deep',
    emoji: 'bg-terracotta-soft',
    check: 'text-terracotta',
    button:
      'bg-terracotta text-white hover:-translate-y-0.5 hover:bg-terracotta-deep',
    link: 'text-terracotta-deep hover:text-terracotta',
  },
  sage: {
    ring: 'ring-sage/25 hover:ring-sage/50',
    glow: 'bg-sage/20',
    badge: 'bg-sage-soft text-sage-deep',
    emoji: 'bg-sage-soft',
    check: 'text-sage-deep',
    button: 'bg-sage-deep text-white hover:-translate-y-0.5 hover:bg-[#4d5836]',
    link: 'text-sage-deep hover:text-sage',
  },
  azure: {
    ring: 'ring-azure/25 hover:ring-azure/50',
    glow: 'bg-azure/15',
    badge: 'bg-azure-soft text-azure-deep',
    emoji: 'bg-azure-soft',
    check: 'text-azure',
    button:
      'bg-azure text-white hover:-translate-y-0.5 hover:bg-azure-deep',
    link: 'text-azure-deep hover:text-azure',
  },
  honey: {
    ring: 'ring-honey/30 hover:ring-honey/50',
    glow: 'bg-honey/20',
    badge: 'bg-honey-soft text-[#9a6a26]',
    emoji: 'bg-honey-soft',
    check: 'text-[#b27e34]',
    button: 'bg-honey text-espresso hover:-translate-y-0.5 hover:bg-[#e7a94e]',
    link: 'text-[#9a6a26] hover:text-honey',
  },
}

export default function Carnets() {
  return (
    <section id="carnets" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
        <SectionHeader
          centered
          eyebrow="L'écosystème"
          title="Une famille de carnets, un même esprit"
          subtitle="Chaque carnet est pensé pour un pan de votre vie. Le même soin, la même clarté, le même calme — choisissez celui dont vous avez besoin aujourd'hui."
        />

        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CARNETS.map((carnet) => {
            const accent = ACCENTS[carnet.accent]
            const isLive = carnet.status === 'live'

            return (
              <article
                key={carnet.id}
                className={`relative flex flex-col overflow-hidden rounded-card bg-card p-6 shadow-card ring-1 transition duration-300 hover:-translate-y-1 hover:shadow-lift ${accent.ring}`}
              >
                <div
                  className={`pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full blur-3xl ${accent.glow}`}
                />

                <div className="relative flex items-center justify-between gap-3">
                  <span
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl text-3xl ${accent.emoji}`}
                  >
                    {carnet.emoji}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-black ${
                      isLive ? accent.badge : 'bg-linen text-hazel'
                    }`}
                  >
                    {isLive ? 'En ligne' : 'Bientôt'}
                  </span>
                </div>

                <h3 className="relative mt-5 font-display text-xl font-bold text-espresso">
                  {carnet.name}
                </h3>

                <p className="relative mt-1 text-sm font-semibold text-hazel">
                  {carnet.tagline}
                </p>

                <p className="relative mt-3 text-sm leading-6 text-cacao/80">
                  {carnet.description}
                </p>

                <ul className="relative mt-5 space-y-2">
                  {carnet.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm font-medium text-cacao"
                    >
                      <Check
                        className={`mt-0.5 h-4 w-4 shrink-0 ${accent.check}`}
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="relative mt-auto pt-7">
                  {isLive && carnet.url ? (
                    <div className="flex flex-col gap-2">
                      <a
                        href={carnet.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-center font-bold shadow-soft transition ${accent.button}`}
                      >
                        Ouvrir le carnet
                        <ArrowRight className="h-4 w-4" />
                      </a>

                      {carnet.signupUrl && (
                        <a
                          href={carnet.signupUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-center text-sm font-bold transition ${accent.link}`}
                        >
                          Créer un compte gratuit
                        </a>
                      )}
                    </div>
                  ) : (
                    <span className="inline-flex w-full cursor-default items-center justify-center rounded-full bg-linen px-6 py-3 text-center font-bold text-hazel ring-1 ring-bark">
                      Bientôt disponible
                    </span>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
