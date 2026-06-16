import { Quote, Star } from 'lucide-react'

import SectionHeader from './SectionHeader'

/**
 * ⚠️ Témoignages d'exemple, à remplacer par de vrais avis.
 *    Garde la même structure pour ajouter/retirer des cartes.
 */
const TESTIMONIALS = [
  {
    name: 'Sophie M.',
    role: 'Utilisatrice du Carnet de recettes',
    quote:
      "Je ne cherche plus mes recettes partout. Tout est réuni, organisé, et la liste de courses se remplit toute seule. Un vrai gain de temps chaque semaine.",
    initial: 'S',
    color: 'bg-terracotta text-white',
  },
  {
    name: 'Marc D.',
    role: 'Utilisateur du Carnet de budget',
    quote:
      "Pour la première fois, je sais où part mon argent sans me prendre la tête avec un tableur. Le ton est doux, jamais culpabilisant : je vois enfin clair.",
    initial: 'M',
    color: 'bg-sage-deep text-white',
  },
  {
    name: 'Julie T.',
    role: 'Utilisatrice du Carnet de sport',
    quote:
      "Je planifie mes séances et je suis mes progrès sans pression. L'appli me motive à garder le rythme, et j'adore retrouver le même esprit que mes autres carnets.",
    initial: 'J',
    color: 'bg-azure text-white',
  },
]

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
      <SectionHeader
        centered
        eyebrowClassName="text-honey"
        eyebrow="Ils utilisent Les Carnets"
        title="Ce qu'en disent nos utilisateurs"
      />

      <div className="mt-9 grid gap-5 md:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.name}
            className="flex flex-col gap-4 rounded-card bg-card p-6 shadow-soft ring-1 ring-bark"
          >
            <Quote className="h-5 w-5 text-bark" />

            <p className="flex-1 text-sm italic leading-6 text-cacao/80">
              &laquo;&nbsp;{t.quote}&nbsp;&raquo;
            </p>

            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-lg font-black ${t.color}`}
              >
                {t.initial}
              </div>

              <div>
                <p className="font-bold text-espresso">{t.name}</p>
                <p className="text-xs text-hazel">{t.role}</p>
              </div>

              <div className="ml-auto flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-honey text-honey" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
