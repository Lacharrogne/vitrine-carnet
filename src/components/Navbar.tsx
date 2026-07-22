import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import type { Session } from '@supabase/supabase-js'

import { BRAND } from '../config'
import Button from './Button'

type NavbarProps = {
  session: Session | null
  onOpenAuth: (mode: 'login' | 'signup') => void
  onLogout: () => void
}

const NAV_LINKS = [
  { label: 'Les carnets', href: '#carnets' },
  { label: 'Pourquoi', href: '#fonctionnalites' },
  { label: 'Comment ça marche', href: '#comment-ca-marche' },
  { label: 'Tarifs', href: '#tarifs' },
  { label: 'Questions', href: '#faq' },
]

export default function Navbar({ session, onOpenAuth, onLogout }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const userEmail = session?.user.email ?? ''

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors duration-300 ${
        scrolled
          ? 'border-bark/70 bg-card/90 shadow-card'
          : 'border-bark/40 bg-card/70'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        {/* Marque */}
        <a href="#top" className="flex items-center gap-2.5">
          <img
            src={BRAND.logo}
            alt={BRAND.name}
            className="h-10 w-10 object-contain"
          />
          <span className="font-display text-lg font-black text-espresso">
            {BRAND.name}
          </span>
        </a>

        {/* Liens desktop */}
        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-bold text-cacao/80 transition hover:text-terracotta"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA desktop */}
        <div className="hidden items-center gap-3 lg:flex">
          {session ? (
            <>
              <span className="max-w-[12rem] truncate text-sm font-bold text-cacao/80">
                {userEmail}
              </span>
              <Button variant="secondary" size="md" onClick={onLogout}>
                Se déconnecter
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                size="md"
                onClick={() => onOpenAuth('login')}
              >
                Se connecter
              </Button>
              <Button size="md" onClick={() => onOpenAuth('signup')}>
                Créer un compte
              </Button>
            </>
          )}
        </div>

        {/* Burger mobile */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-espresso ring-1 ring-bark lg:hidden"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Menu mobile */}
      {open && (
        <div className="border-t border-bark/60 bg-card px-5 py-4 lg:hidden">
          <nav className="grid gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 font-bold text-cacao transition hover:bg-linen"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="mt-3 grid gap-2">
            {session ? (
              <>
                <span className="truncate px-3 text-sm font-bold text-cacao/80">
                  {userEmail}
                </span>
                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  onClick={() => {
                    setOpen(false)
                    onLogout()
                  }}
                >
                  Se déconnecter
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="lg"
                  fullWidth
                  onClick={() => {
                    setOpen(false)
                    onOpenAuth('signup')
                  }}
                >
                  Créer un compte
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  onClick={() => {
                    setOpen(false)
                    onOpenAuth('login')
                  }}
                >
                  Se connecter
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
