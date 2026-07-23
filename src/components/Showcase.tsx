import BrowserFrame from './BrowserFrame'
import SectionHeader from './SectionHeader'

const SHOTS = [
  {
    src: '/shot-recettes.png',
    alt: 'Aperçu du Carnet de recettes',
    url: 'recettes.lescarnets.app',
    name: 'Carnet de recettes',
    tagline: 'Vos recettes de famille, le planning et les courses au même endroit.',
    accent: 'text-terracotta',
  },
  {
    src: '/shot-budget.png',
    alt: 'Aperçu du Carnet de budget',
    url: 'budget.lescarnets.app',
    name: 'Carnet de budget',
    tagline: 'Un vrai cockpit financier : comptes, budgets, épargne et objectifs.',
    accent: 'text-sage-deep',
  },
]

export default function Showcase() {
  return (
    <section id="apercu" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
        <SectionHeader
          centered
          eyebrow="Un aperçu"
          title="Beau, clair, et prêt à l'emploi"
          subtitle="Le même soin dans chaque carnet — une interface douce et lisible, pensée pour que tout soit à portée de main."
        />

        <div className="mt-9 grid gap-8 lg:grid-cols-2">
          {SHOTS.map((shot) => (
            <figure key={shot.src} className="flex flex-col">
              <BrowserFrame
                src={shot.src}
                alt={shot.alt}
                url={shot.url}
                className="transition duration-300 hover:-translate-y-1 hover:shadow-lift"
              />

              <figcaption className="mt-4 px-1">
                <p className={`font-display text-lg font-bold ${shot.accent}`}>
                  {shot.name}
                </p>
                <p className="mt-1 text-sm leading-6 text-cacao/80">
                  {shot.tagline}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
