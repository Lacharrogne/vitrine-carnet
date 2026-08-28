import { useEffect, useState } from 'react'

import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ProblemSolution from './components/ProblemSolution'
import Carnets from './components/Carnets'
import Showcase from './components/Showcase'
import Features from './components/Features'
import Benefits from './components/Benefits'
import HowItWorks from './components/HowItWorks'
import FounderNote from './components/FounderNote'
import Pricing from './components/Pricing'
import Faq from './components/Faq'
import FinalCta from './components/FinalCta'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'
import InstallPrompt from './components/InstallPrompt'
import Reveal from './components/Reveal'
import AdminPage from './components/admin/AdminPage'
import HubPage from './components/hub/HubPage'
import LegalPage from './components/legal/LegalPage'
import { useSession } from './lib/useSession'
import { supabase } from './lib/supabase'
import { getMyRole } from './lib/admin'

/** Suit `window.location.hash` (mini-routing sans dépendance). */
function useHash() {
  const [hash, setHash] = useState(() =>
    typeof window !== 'undefined' ? window.location.hash : '',
  )

  useEffect(() => {
    const onChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return hash
}

export default function App() {
  const { session } = useSession()
  const [authMode, setAuthMode] = useState<'login' | 'signup' | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const hash = useHash()

  useEffect(() => {
    let active = true
    const uid = session?.user?.id

    if (!uid) {
      setIsAdmin(false)
      return
    }

    getMyRole(uid)
      .then((role) => {
        if (active) setIsAdmin(role === 'admin')
      })
      .catch(() => {
        if (active) setIsAdmin(false)
      })

    return () => {
      active = false
    }
  }, [session])

  async function handleLogout() {
    await supabase?.auth.signOut()
  }

  // Pages légales (#cgu, #confidentialite, #mentions-legales).
  if (hash === '#cgu') {
    return <LegalPage kind="cgu" />
  }
  if (hash === '#confidentialite') {
    return <LegalPage kind="confidentialite" />
  }
  if (hash === '#mentions-legales') {
    return <LegalPage kind="mentions-legales" />
  }

  // Mon espace / Hub d'abonnement (#hub).
  if (hash === '#hub') {
    if (!session) {
      return (
        <div className="paper-grain flex min-h-screen items-center justify-center px-5">
          <div className="max-w-md rounded-2xl border border-bark bg-card p-8 text-center shadow-soft">
            <p className="text-4xl">🔐</p>
            <h1 className="mt-3 font-display text-2xl font-black text-espresso">
              Mon espace
            </h1>
            <p className="mt-2 text-sm text-cacao/80">
              Connectez-vous pour voir vos carnets et gérer votre abonnement.
            </p>
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className="mt-5 rounded-full bg-espresso px-5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5"
            >
              Se connecter
            </button>
            <a href="#top" className="mt-3 block text-sm font-bold text-hazel">
              Retour au site
            </a>
          </div>

          {authMode && (
            <AuthModal
              initialMode={authMode}
              onClose={() => setAuthMode(null)}
            />
          )}
        </div>
      )
    }

    return <HubPage session={session} />
  }

  // Console d'administration (#admin).
  if (hash === '#admin') {
    if (!session) {
      return (
        <div className="paper-grain flex min-h-screen items-center justify-center px-5">
          <div className="max-w-md rounded-2xl border border-bark bg-card p-8 text-center shadow-soft">
            <p className="text-4xl">🔐</p>
            <h1 className="mt-3 font-display text-2xl font-black text-espresso">
              Console d’administration
            </h1>
            <p className="mt-2 text-sm text-cacao/80">
              Connectez-vous avec un compte administrateur pour accéder à la
              console.
            </p>
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className="mt-5 rounded-full bg-espresso px-5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5"
            >
              Se connecter
            </button>
            <a href="#top" className="mt-3 block text-sm font-bold text-hazel">
              Retour au site
            </a>
          </div>

          {authMode && (
            <AuthModal
              initialMode={authMode}
              onClose={() => setAuthMode(null)}
            />
          )}
        </div>
      )
    }

    return <AdminPage email={session.user.email ?? undefined} />
  }

  return (
    <div className="paper-grain min-h-screen">
      <Navbar
        session={session}
        isAdmin={isAdmin}
        onOpenAuth={(mode) => setAuthMode(mode)}
        onLogout={handleLogout}
      />

      <main>
        <Hero />
        <Reveal>
          <ProblemSolution />
        </Reveal>
        <Reveal>
          <Carnets />
        </Reveal>
        <Reveal>
          <Showcase />
        </Reveal>
        <Reveal>
          <Features />
        </Reveal>
        <Reveal>
          <Benefits />
        </Reveal>
        <Reveal>
          <HowItWorks />
        </Reveal>
        <Reveal>
          <FounderNote />
        </Reveal>
        <Reveal>
          <Pricing session={session} onOpenAuth={() => setAuthMode('signup')} />
        </Reveal>
        <Reveal>
          <Faq />
        </Reveal>
        <Reveal>
          <FinalCta />
        </Reveal>
      </main>

      <Footer />

      {authMode && (
        <AuthModal initialMode={authMode} onClose={() => setAuthMode(null)} />
      )}

      <InstallPrompt />
    </div>
  )
}
