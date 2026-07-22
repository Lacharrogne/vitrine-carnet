import { useState, type FormEvent } from 'react'
import { X } from 'lucide-react'

import { supabase, IS_SUPABASE_CONFIGURED } from '../lib/supabase'

type Mode = 'login' | 'signup'

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<Mode>('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setInfo('')

    if (!supabase) {
      setError("La connexion n'est pas encore configurée.")
      return
    }

    setLoading(true)

    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        })
        if (signUpError) throw signUpError

        if (data.session) {
          onClose()
        } else {
          setInfo(
            'Compte créé ! Vérifiez votre boîte mail pour confirmer votre adresse, puis connectez-vous.',
          )
          setMode('login')
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })
        if (signInError) throw signInError

        onClose()
      }
    } catch (authError) {
      console.error(authError)
      setError(
        authError instanceof Error && authError.message
          ? authError.message
          : "Une erreur est survenue. Réessayez.",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-espresso/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-[2rem] bg-card p-7 shadow-card ring-1 ring-bark"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-black text-espresso">
              {mode === 'signup' ? 'Créer votre compte' : 'Se connecter'}
            </h2>
            <p className="mt-1 text-sm font-semibold text-hazel">
              Un seul compte pour tous les carnets.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-cacao ring-1 ring-bark transition hover:bg-linen"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {!IS_SUPABASE_CONFIGURED && (
          <p className="mt-5 rounded-2xl bg-honey-soft px-4 py-3 text-sm font-bold text-espresso">
            La connexion sera bientôt disponible.
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-black uppercase tracking-wide text-hazel">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="vous@exemple.com"
              className="w-full rounded-2xl border border-bark bg-linen px-4 py-3 text-sm font-semibold text-espresso outline-none transition placeholder:text-hazel/60 focus:border-terracotta focus:ring-4 focus:ring-terracotta/15"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-black uppercase tracking-wide text-hazel">
              Mot de passe
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Au moins 6 caractères"
              className="w-full rounded-2xl border border-bark bg-linen px-4 py-3 text-sm font-semibold text-espresso outline-none transition placeholder:text-hazel/60 focus:border-terracotta focus:ring-4 focus:ring-terracotta/15"
            />
          </div>

          {error && (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
              {error}
            </p>
          )}

          {info && (
            <p className="rounded-2xl bg-sage-soft px-4 py-3 text-sm font-bold text-sage-deep">
              {info}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !IS_SUPABASE_CONFIGURED}
            className="w-full rounded-full bg-terracotta px-6 py-3.5 font-bold text-white shadow-soft transition hover:bg-terracotta-deep disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? 'Un instant…'
              : mode === 'signup'
                ? 'Créer mon compte'
                : 'Se connecter'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm font-semibold text-hazel">
          {mode === 'signup' ? 'Déjà un compte ?' : 'Pas encore de compte ?'}{' '}
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'signup' ? 'login' : 'signup')
              setError('')
              setInfo('')
            }}
            className="font-black text-terracotta underline"
          >
            {mode === 'signup' ? 'Se connecter' : 'Créer un compte'}
          </button>
        </p>
      </div>
    </div>
  )
}
