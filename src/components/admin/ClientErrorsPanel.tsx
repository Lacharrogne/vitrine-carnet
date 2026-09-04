import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  listClientErrors,
  purgeClientErrors,
  type ClientError,
} from '../../lib/admin'

/**
 * Erreurs rencontrées par les utilisateurs.
 *
 * Sans cet écran, les erreurs remontées dormiraient dans une table que
 * personne n'ouvre — on n'aurait fait que déplacer le problème.
 *
 * Les messages identiques sont **regroupés** : ce qui compte n'est pas la
 * cinquantième occurrence d'un même plantage, mais le fait qu'il touche
 * plusieurs personnes.
 */

const APPS = ['recettes', 'budget', 'sport', 'vitrine'] as const

const APP_STYLE: Record<string, string> = {
  recettes: 'bg-terracotta-soft text-terracotta-deep',
  budget: 'bg-sage-soft text-sage-deep',
  sport: 'bg-azure-soft text-azure-deep',
  vitrine: 'bg-linen text-cacao',
}

type Grouped = {
  key: string
  app: string
  message: string
  count: number
  users: number
  lastAt: string
  sample: ClientError
}

function groupErrors(errors: ClientError[]): Grouped[] {
  const map = new Map<string, Grouped & { userIds: Set<string> }>()

  for (const error of errors) {
    const key = `${error.app}::${error.message}`
    const existing = map.get(key)

    if (existing) {
      existing.count += 1
      if (error.user_id) existing.userIds.add(error.user_id)
      if (error.created_at > existing.lastAt) existing.lastAt = error.created_at
      continue
    }

    map.set(key, {
      key,
      app: error.app,
      message: error.message,
      count: 1,
      users: 0,
      lastAt: error.created_at,
      sample: error,
      userIds: new Set(error.user_id ? [error.user_id] : []),
    })
  }

  return [...map.values()]
    .map(({ userIds, ...rest }) => ({ ...rest, users: userIds.size }))
    .sort((a, b) => b.lastAt.localeCompare(a.lastAt))
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export default function ClientErrorsPanel() {
  const [errors, setErrors] = useState<ClientError[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [appFilter, setAppFilter] = useState<string>('all')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [purging, setPurging] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setErrors(await listClientErrors())
      setMessage('')
    } catch {
      setMessage("Impossible de charger les erreurs.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const groups = useMemo(() => {
    const filtered =
      appFilter === 'all'
        ? errors
        : errors.filter((error) => error.app === appFilter)
    return groupErrors(filtered)
  }, [errors, appFilter])

  const purge = async () => {
    setPurging(true)
    try {
      const removed = await purgeClientErrors(30)
      setMessage(
        removed === 0
          ? 'Rien à purger : aucune erreur de plus de 30 jours.'
          : `${removed} erreur${removed > 1 ? 's' : ''} de plus de 30 jours supprimée${removed > 1 ? 's' : ''}.`,
      )
      await load()
    } catch {
      setMessage('La purge a échoué.')
    } finally {
      setPurging(false)
    }
  }

  return (
    <section className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-lg font-black text-espresso">
          Erreurs rencontrées ({groups.length})
        </h2>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={appFilter}
            onChange={(event) => setAppFilter(event.target.value)}
            className="rounded-full border border-bark bg-card px-3 py-2 text-sm font-semibold text-cacao"
            aria-label="Filtrer par carnet"
          >
            <option value="all">Tous les carnets</option>
            {APPS.map((app) => (
              <option key={app} value={app}>
                {app}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => void load()}
            className="rounded-full border border-bark px-4 py-2 text-sm font-bold text-cacao transition hover:bg-linen"
          >
            Rafraîchir
          </button>

          <button
            type="button"
            onClick={() => void purge()}
            disabled={purging}
            className="rounded-full bg-espresso px-4 py-2 text-sm font-bold text-white transition hover:-translate-y-0.5 disabled:opacity-50"
          >
            {purging ? 'Purge…' : 'Purger > 30 j'}
          </button>
        </div>
      </div>

      <p className="mt-1 text-xs font-semibold text-hazel">
        Messages identiques regroupés, les plus récents en premier. Seul le
        chemin de la page est enregistré, jamais les paramètres d'URL.
      </p>

      {message && (
        <p className="mt-3 rounded-xl bg-linen px-4 py-2.5 text-sm font-semibold text-cacao">
          {message}
        </p>
      )}

      {loading ? (
        <p className="mt-4 text-sm font-semibold text-hazel">Chargement…</p>
      ) : groups.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-bark bg-card px-4 py-6 text-center text-sm font-semibold text-hazel">
          Aucune erreur remontée. 🎉
        </p>
      ) : (
        <ul className="mt-4 grid grid-cols-1 gap-3">
          {groups.map((group) => (
            <li
              key={group.key}
              className="rounded-2xl border border-bark bg-card p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-black ${
                        APP_STYLE[group.app] ?? 'bg-linen text-cacao'
                      }`}
                    >
                      {group.app}
                    </span>
                    {group.count > 1 && (
                      <span className="rounded-full bg-linen px-2.5 py-0.5 text-xs font-bold text-cacao">
                        ×{group.count}
                      </span>
                    )}
                    {group.users > 1 && (
                      <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-black text-red-700">
                        {group.users} personnes
                      </span>
                    )}
                  </div>

                  <p className="mt-2 break-words font-semibold text-espresso">
                    {group.message}
                  </p>

                  <p className="mt-1 text-xs font-semibold text-hazel">
                    {formatDate(group.lastAt)}
                    {group.sample.path ? ` · ${group.sample.path}` : ''}
                  </p>
                </div>

                {group.sample.stack && (
                  <button
                    type="button"
                    onClick={() =>
                      setExpanded(expanded === group.key ? null : group.key)
                    }
                    className="shrink-0 rounded-full border border-bark px-3 py-1.5 text-xs font-bold text-cacao transition hover:bg-linen"
                  >
                    {expanded === group.key ? 'Masquer' : 'Détail'}
                  </button>
                )}
              </div>

              {expanded === group.key && group.sample.stack && (
                <pre className="mt-3 overflow-x-auto rounded-xl bg-linen p-3 text-xs leading-relaxed text-cacao">
                  {group.sample.stack}
                </pre>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
