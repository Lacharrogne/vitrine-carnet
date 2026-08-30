import { Heart, Leaf, ShieldCheck } from 'lucide-react'

import { BRAND, CARNETS, LINKS } from '../config'

const TRUST_SIGNALS = [
  { icon: Heart, label: 'Fait avec soin' },
  { icon: ShieldCheck, label: 'Sans publicité' },
  { icon: Leaf, label: '14 jours d’essai gratuit' },
]

const DISCOVER_LINKS = [
  { label: 'Les carnets', href: '#carnets' },
  { label: 'Fonctionnalités', href: '#fonctionnalites' },
  { label: 'Comment ça marche', href: '#comment-ca-marche' },
  { label: 'Tarifs', href: '#tarifs' },
  { label: 'Questions', href: '#faq' },
]

const INFO_LINKS = [
  { label: 'Confidentialité', href: LINKS.PRIVACY_URL },
  { label: "Conditions d'utilisation", href: LINKS.TERMS_URL },
  { label: 'Mentions légales', href: LINKS.LEGAL_URL },
  { label: 'Contact', href: `mailto:${LINKS.CONTACT_EMAIL}` },
]

const YEAR = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="border-t border-bark bg-cream-50">
      <div className="mx-auto grid grid-cols-1 max-w-6xl gap-10 px-6 py-12 md:grid-cols-[1.2fr_2fr]">
        <div>
          <div className="flex items-center gap-3">
            <img
              src={BRAND.logo}
              alt={BRAND.name}
              className="h-14 w-14 object-contain"
            />
            <div>
              <p className="font-display font-black text-espresso">
                {BRAND.name}
              </p>
              <p className="text-sm font-semibold text-hazel">
                {BRAND.tagline}
              </p>
            </div>
          </div>

          <p className="mt-5 max-w-sm text-sm leading-6 text-cacao/80">
            L'écosystème de carnets qui met de l'ordre dans votre quotidien —
            recettes, argent, forme — avec le même soin, le même calme, à chaque
            page.
          </p>

          <ul className="mt-6 space-y-2">
            {TRUST_SIGNALS.map((signal) => {
              const Icon = signal.icon

              return (
                <li
                  key={signal.label}
                  className="flex items-center gap-2 text-sm font-semibold text-cacao/80"
                >
                  <Icon className="h-4 w-4 text-terracotta" />
                  {signal.label}
                </li>
              )
            })}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {/* Les carnets */}
          <nav>
            <p className="text-xs font-black uppercase tracking-[0.12em] text-terracotta">
              Les carnets
            </p>

            <ul className="mt-4 space-y-2.5">
              {CARNETS.map((carnet) =>
                carnet.status === 'live' && carnet.url ? (
                  <li key={carnet.id}>
                    <a
                      href={carnet.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-cacao/80 transition hover:text-terracotta"
                    >
                      {carnet.name}
                    </a>
                  </li>
                ) : (
                  <li key={carnet.id}>
                    <a
                      href="#carnets"
                      className="text-sm font-bold text-cacao/50 transition hover:text-terracotta"
                    >
                      {carnet.name} (bientôt)
                    </a>
                  </li>
                ),
              )}
            </ul>
          </nav>

          {/* Découvrir */}
          <nav>
            <p className="text-xs font-black uppercase tracking-[0.12em] text-terracotta">
              Découvrir
            </p>

            <ul className="mt-4 space-y-2.5">
              {DISCOVER_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm font-bold text-cacao/80 transition hover:text-terracotta"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Informations */}
          <nav>
            <p className="text-xs font-black uppercase tracking-[0.12em] text-terracotta">
              Informations
            </p>

            <ul className="mt-4 space-y-2.5">
              {INFO_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm font-bold text-cacao/80 transition hover:text-terracotta"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="border-t border-bark/70">
        <p className="mx-auto max-w-6xl px-6 py-4 text-sm text-hazel">
          © {YEAR} — {BRAND.name}
        </p>
      </div>
    </footer>
  )
}
