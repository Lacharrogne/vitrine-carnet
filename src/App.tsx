import { useState } from 'react'

import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ProblemSolution from './components/ProblemSolution'
import Carnets from './components/Carnets'
import Features from './components/Features'
import Benefits from './components/Benefits'
import HowItWorks from './components/HowItWorks'
import Testimonials from './components/Testimonials'
import Pricing from './components/Pricing'
import Faq from './components/Faq'
import FinalCta from './components/FinalCta'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'
import Reveal from './components/Reveal'
import { useSession } from './lib/useSession'
import { supabase } from './lib/supabase'

export default function App() {
  const { session } = useSession()
  const [authMode, setAuthMode] = useState<'login' | 'signup' | null>(null)

  async function handleLogout() {
    await supabase?.auth.signOut()
  }

  return (
    <div className="paper-grain min-h-screen">
      <Navbar
        session={session}
        onOpenAuth={(mode) => setAuthMode(mode)}
        onLogout={handleLogout}
      />

      <main>
        <Hero />
        <Reveal><ProblemSolution /></Reveal>
        <Reveal><Carnets /></Reveal>
        <Reveal><Features /></Reveal>
        <Reveal><Benefits /></Reveal>
        <Reveal><HowItWorks /></Reveal>
        <Reveal><Testimonials /></Reveal>
        <Reveal>
          <Pricing session={session} onOpenAuth={() => setAuthMode('signup')} />
        </Reveal>
        <Reveal><Faq /></Reveal>
        <Reveal><FinalCta /></Reveal>
      </main>

      <Footer />

      {authMode && (
        <AuthModal initialMode={authMode} onClose={() => setAuthMode(null)} />
      )}
    </div>
  )
}
