import { useEffect, useState } from 'react'
import { Download, Share, X } from 'lucide-react'

import { BRAND } from '../config'

/**
 * Bannière discrète « Installer l'application » (PWA) pour la suite Les Carnets.
 *
 * - Android/Chrome : capte `beforeinstallprompt` et déclenche l'invite native.
 * - iOS/Safari : `beforeinstallprompt` n'existe pas → on affiche la marche à
 *   suivre manuelle (Partager → Sur l'écran d'accueil).
 * - Masquée si déjà installée (mode standalone) ou déjà refusée une fois.
 */

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISS_KEY = 'installPromptDismissed'

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  )
}

function isIos(): boolean {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent)
}

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)
  const [showIosHelp, setShowIosHelp] = useState(false)

  useEffect(() => {
    if (isStandalone()) return
    try {
      if (localStorage.getItem(DISMISS_KEY)) return
    } catch {
      /* localStorage indisponible : on continue sans mémoire */
    }

    const onPrompt = (event: Event) => {
      event.preventDefault()
      setDeferred(event as BeforeInstallPromptEvent)
      setVisible(true)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)

    if (isIos()) setVisible(true)

    const onInstalled = () => {
      setVisible(false)
      try {
        localStorage.setItem(DISMISS_KEY, '1')
      } catch {
        /* ignore */
      }
    }
    window.addEventListener('appinstalled', onInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const dismiss = () => {
    setVisible(false)
    try {
      localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      /* ignore */
    }
  }

  const install = async () => {
    if (isIos()) {
      setShowIosHelp((value) => !value)
      return
    }
    if (!deferred) return
    await deferred.prompt()
    await deferred.userChoice
    setDeferred(null)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-50 mx-auto max-w-md sm:inset-x-auto sm:left-1/2 sm:w-[26rem] sm:-translate-x-1/2">
      <div className="rounded-2xl border border-bark bg-card/95 p-4 shadow-lift backdrop-blur">
        <div className="flex items-start gap-3">
          <img
            src={BRAND.logo}
            alt=""
            className="h-11 w-11 shrink-0 rounded-xl shadow-soft"
          />
          <div className="min-w-0 flex-1">
            <p className="font-display text-sm font-black text-espresso">
              Installer Les Carnets
            </p>
            <p className="mt-0.5 text-xs font-semibold text-cacao/70">
              Ajoutez la suite à votre écran d'accueil pour retrouver vos
              carnets en un geste.
            </p>
          </div>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Masquer"
            className="shrink-0 rounded-full p-1 text-hazel transition hover:bg-linen hover:text-cacao"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {showIosHelp ? (
          <p className="mt-3 flex items-center gap-1.5 rounded-xl bg-terracotta-soft px-3 py-2.5 text-xs font-semibold text-terracotta-deep">
            Appuyez sur
            <Share className="mx-0.5 inline h-3.5 w-3.5" />
            puis « Sur l'écran d'accueil ».
          </p>
        ) : (
          <button
            type="button"
            onClick={install}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-espresso px-4 py-2.5 text-sm font-black text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-espresso/90"
          >
            <Download className="h-4 w-4" />
            {isIos() ? 'Comment installer' : "Installer l'application"}
          </button>
        )}
      </div>
    </div>
  )
}
