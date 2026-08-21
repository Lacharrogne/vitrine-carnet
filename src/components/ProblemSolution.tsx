import SectionHeader from './SectionHeader'

const PAIN_POINTS = [
  {
    emoji: '😵‍💫',
    title: 'Tout est éparpillé',
    description:
      "Des notes par-ci, une appli par-là, un tableur quelque part… et au final, plus rien sous la main au bon moment.",
  },
  {
    emoji: '🧾',
    title: "L'argent qui file",
    description:
      "Les dépenses s'enchaînent et, à la fin du mois, on se demande encore où est passé le reste.",
  },
  {
    emoji: '🍳',
    title: 'La charge mentale du quotidien',
    description:
      'Les repas, les courses, les petites tâches à ne pas oublier : tout repose sur la même tête, la vôtre.',
  },
  {
    emoji: '🎯',
    title: 'De bonnes intentions, sans suivi',
    description:
      'On se promet de bouger, de mieux s’organiser… puis le quotidien reprend le dessus et les objectifs s’oublient.',
  },
]

export default function ProblemSolution() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
      <SectionHeader
        centered
        eyebrow="Vous vous reconnaissez ?"
        title="Le quotidien mérite mieux qu'un tableur"
        subtitle="Ces petits tracas du quotidien, Les Carnets les apaisent, un carnet à la fois."
      />

      <div className="mt-9 grid gap-4 sm:grid-cols-2 sm:gap-5">
        {PAIN_POINTS.map((point) => (
          <div
            key={point.title}
            className="flex gap-4 rounded-card bg-card p-5 shadow-soft ring-1 ring-bark"
          >
            <span className="mt-0.5 shrink-0 text-3xl">{point.emoji}</span>
            <div>
              <h3 className="font-display text-base font-bold text-espresso">
                {point.title}
              </h3>
              <p className="mt-1 text-sm leading-6 text-cacao/80">
                {point.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-card bg-terracotta-soft p-6 ring-1 ring-terracotta/20">
        <p className="font-display text-xl font-bold text-terracotta-deep">
          ✨ Un esprit, plusieurs carnets.
        </p>
        <p className="mt-2 max-w-3xl leading-7 text-cacao/80">
          Le même soin, le même calme, appliqués à votre cuisine, votre argent
          et votre forme. Chaque carnet sa couleur, tous la même promesse :
          simple, chaleureux et toujours prêt quand vous en avez besoin.
        </p>
      </div>
    </section>
  )
}
