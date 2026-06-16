import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

import SectionHeader from './SectionHeader'

const FAQ_ITEMS = [
  {
    question: 'Qu’est-ce que Les Carnets ?',
    answer:
      "Les Carnets, c'est une famille d'applications qui mettent de l'ordre dans votre quotidien : vos recettes, votre argent, votre sport. Tous partagent le même esprit clair, premium et rassurant.",
  },
  {
    question: 'Quels carnets existent aujourd’hui ?',
    answer:
      "Trois carnets sont déjà en ligne : le Carnet de recettes, le Carnet de budget et le Carnet de sport. Un Hub pour les réunir tous arrive bientôt.",
  },
  {
    question: 'Dois-je créer un compte par carnet ?',
    answer:
      "Pour l'instant, oui : chaque carnet a son propre compte. Le Hub, à venir, unifiera tout avec un compte unique pour accéder à l'ensemble de vos carnets.",
  },
  {
    question: 'Combien ça coûte ?',
    answer:
      "Chaque carnet est gratuit pour démarrer, avec tout l'essentiel pour bien commencer. Un abonnement Premium est ensuite disponible en option pour aller plus loin.",
  },
  {
    question: 'Puis-je annuler à tout moment ?',
    answer:
      "Oui, à tout moment et sans engagement. L'abonnement Premium est résiliable sans frais ni délai de préavis.",
  },
  {
    question: 'Mes données sont-elles privées ?',
    answer:
      "Vos données restent privées, accessibles uniquement à vous et aux personnes que vous invitez. Aucune n'est jamais revendue à des tiers.",
  },
  {
    question: 'Ça marche sur mobile ?',
    answer:
      'Oui, tous nos carnets sont des applications web qui fonctionnent sur smartphone, tablette et ordinateur, directement depuis votre navigateur.',
  },
  {
    question: 'De nouveaux carnets vont-ils arriver ?',
    answer:
      "Oui, l'écosystème s'agrandit régulièrement. De nouveaux carnets sont à l'étude, et le Hub viendra prochainement les rassembler en un seul endroit.",
  },
]

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="scroll-mt-20">
      <div className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
        <SectionHeader
          centered
          eyebrow="Questions fréquentes"
          title="Tout ce que vous voulez savoir"
        />

        <div className="mt-8 divide-y divide-bark rounded-card bg-card px-5 shadow-soft ring-1 ring-bark sm:px-7">
          {FAQ_ITEMS.map((item, index) => (
            <div key={index}>
              <button
                type="button"
                onClick={() => setOpen(open === index ? null : index)}
                className="flex w-full items-center justify-between gap-4 py-4 text-left"
                aria-expanded={open === index}
              >
                <span className="font-display font-bold text-espresso">
                  {item.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-hazel transition-transform duration-200 ${
                    open === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {open === index && (
                <p className="pb-4 text-sm leading-6 text-cacao/80">
                  {item.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
