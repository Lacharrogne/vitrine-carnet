import {
  Feather,
  HeartHandshake,
  LayoutGrid,
  Palette,
  ShieldCheck,
  Smartphone,
} from 'lucide-react'

import SectionHeader from './SectionHeader'

type Tone = 'terracotta' | 'honey' | 'sage' | 'azure'

const TONE_BG: Record<Tone, string> = {
  terracotta: 'bg-terracotta-soft',
  honey: 'bg-honey-soft',
  sage: 'bg-sage-soft',
  azure: 'bg-azure-soft',
}

type Feature = {
  icon: typeof Feather
  tone: Tone
  title: string
  description: string
}

const FEATURES: Feature[] = [
  {
    icon: Feather,
    tone: 'terracotta',
    title: 'Simple, jamais intimidant',
    description:
      "Toute la puissance d'un tableur, sans la complexité. Chaque carnet va à l'essentiel et se prend en main en quelques minutes.",
  },
  {
    icon: HeartHandshake,
    tone: 'sage',
    title: 'Clair et rassurant',
    description:
      'Vous savez toujours où vous en êtes. Un ton bienveillant, jamais culpabilisant, qui vous accompagne plutôt que de vous juger.',
  },
  {
    icon: Palette,
    tone: 'honey',
    title: 'Beau au quotidien',
    description:
      "Un design premium aux airs de papier chaleureux. Des outils qu'on a vraiment plaisir à ouvrir, jour après jour.",
  },
  {
    icon: LayoutGrid,
    tone: 'azure',
    title: 'Tout réuni',
    description:
      "Fini les notes, tableurs et applis éparpillés. Vos recettes, votre argent, votre sport : chacun a enfin sa place.",
  },
  {
    icon: Smartphone,
    tone: 'terracotta',
    title: 'Pensé pour le mobile',
    description:
      "Des applications web qui s'utilisent aussi bien sur téléphone que sur ordinateur, sans rien à installer.",
  },
  {
    icon: ShieldCheck,
    tone: 'sage',
    title: 'Vos données privées',
    description:
      "Vos informations restent les vôtres : sécurisées, sans publicité et jamais revendues. C'est notre engagement.",
  },
]

export default function Features() {
  return (
    <section id="fonctionnalites" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
        <SectionHeader
          centered
          eyebrow="Pourquoi Les Carnets"
          title="Le même soin, dans chaque carnet"
          subtitle="Recettes, budget ou sport : tous nos carnets partagent le même esprit. Pensés pour durer, pas pour impressionner."
        />

        <div className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon

            return (
              <div
                key={feature.title}
                className="flex flex-col gap-3 rounded-card bg-card p-6 shadow-soft ring-1 ring-bark transition duration-300 hover:-translate-y-1 hover:shadow-card"
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${TONE_BG[feature.tone]}`}
                >
                  <Icon className="h-5 w-5 text-espresso" />
                </span>

                <h3 className="font-display text-lg font-bold leading-snug text-espresso">
                  {feature.title}
                </h3>

                <p className="text-sm leading-6 text-cacao/80">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
