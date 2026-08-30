import { useEffect, useRef, useState } from 'react'
import { LogOut, Menu, ShieldCheck, X } from 'lucide-react'
import type { Session } from '@supabase/supabase-js'

import { BRAND } from '../config'
import Button from './Button'

type NavbarProps = {
  session: Session | null
  isAdmin?: boolean
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

export default function Navbar({
  session,
  isAdmin = false,
  onOpenAuth,
  onLogout,
}: NavbarProps) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const accountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!accountOpen) return
    const onClick = (event: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [accountOpen])

  const userEmail = session?.user.email ?? ''
  const initial = userEmail ? userEmail.charAt(0).toUpperCase() : '?'

  return (
    <header
      className={`sticky top-0 z-40 border-b pt-[env(safe-area-inset-top)] backdrop-blur-md transition-colors duration-300 ${
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
            className="h-12 w-12 object-contain drop-shadow-sm"
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
              <a
                href="#hub"
                className="inline-flex items-center gap-2 rounded-full bg-espresso px-5 py-2.5 text-sm font-black text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-espresso/90"
              >
                Mes carnets
              </a>

              <div ref={accountRef} className="relative">
                <button
                  type="button"
                  onClick={() => setAccountOpen((v) => !v)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-linen text-sm font-black text-espresso ring-1 ring-bark transition hover:bg-sand"
                  aria-label="Mon compte"
                  aria-expanded={accountOpen}
                >
                  {initial}
                </button>

                {accountOpen && (
                  <div className="absolute right-0 top-full mt-2 w-60 rounded-2xl border border-bark bg-card p-2 shadow-lift">
                    <p className="truncate px-3 pb-2 pt-1 text-xs font-bold text-hazel">
                      {userEmail}
                    </p>

                    {isAdmin && (
                      <a
                        href="#admin"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-terracotta-deep transition hover:bg-terracotta-soft"
                      >
                        <ShieldCheck className="h-4 w-4" />
                        Console admin
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setAccountOpen(false)
                        onLogout()
                      }}
                      className="mt-0.5 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-cacao transition hover:bg-rose-50 hover:text-rose-700"
                    >
                      <LogOut className="h-4 w-4" />
                      Se déconnecter
                    </button>
                  </div>
                )}
              </div>
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
        <div className="min-h-[calc(100dvh-77px)] max-h-[calc(100dvh-77px)] overflow-y-auto border-t border-bark/60 bg-card px-5 py-4 lg:hidden">
          {/* Fondu épinglé : le contenu défilé se fond dans le fond au lieu
              d'être coupé net sous la barre. */}
          <div
            aria-hidden="true"
            className="pointer-events-none sticky top-0 z-10 -mx-5 -mt-4 h-6 bg-gradient-to-b from-card to-transparent"
          />
          <nav className="grid grid-cols-1 gap-1">
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

          <div className="mt-3 grid grid-cols-1 gap-2">
            {session ? (
              <>
                <a
                  href="#hub"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-bark bg-card px-3 py-2.5 text-center font-black text-cacao"
                >
                  Mes carnets
                </a>
                {isAdmin && (
                  <a
                    href="#admin"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-terracotta/30 bg-terracotta-soft px-3 py-2.5 text-center font-black text-terracotta-deep"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Console admin
                  </a>
                )}
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
