import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import {
  deleteUser,
  getOverview,
  grantComp,
  listUsers,
  revokeComp,
  setRole,
  type AdminOverview,
  type AdminUser,
} from '../../lib/admin'

type AdminPageProps = {
  /** E-mail de l'admin connecté (affiché dans l'en-tête). */
  email?: string
}

function StatCard({
  label,
  value,
  hint,
  accent = 'text-espresso',
}: {
  label: string
  value: number | string
  hint?: string
  accent?: string
}) {
  return (
    <div className="rounded-2xl border border-bark bg-card p-5 shadow-soft">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-hazel">
        {label}
      </p>
      <p className={`mt-2 text-3xl font-black ${accent}`}>{value}</p>
      {hint && <p className="mt-1 text-xs font-semibold text-hazel">{hint}</p>}
    </div>
  )
}

function SubBadge({ status, source }: { status: string; source: string }) {
  const isComp = source === 'comp'
  const isPremium = status === 'active' || status === 'on_trial'

  const cls = isComp
    ? 'bg-honey/20 text-[#8a6a1e]'
    : isPremium
      ? 'bg-sage-soft text-sage-deep'
      : 'bg-linen text-hazel'

  const label = isComp
    ? 'Offert'
    : status === 'active'
      ? 'Premium'
      : status === 'on_trial'
        ? 'Essai'
        : status === 'none'
          ? '—'
          : status

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-black ${cls}`}>
      {label}
    </span>
  )
}

export default function AdminPage({ email }: AdminPageProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [denied, setDenied] = useState(false)
  const [overview, setOverview] = useState<AdminOverview | null>(null)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [query, setQuery] = useState('')
  const [filterMode, setFilterMode] = useState<
    'all' | 'premium' | 'comp' | 'admin'
  >('all')
  const [busy, setBusy] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [ov, us] = await Promise.all([getOverview(), listUsers()])
      if (ov === null) {
        setDenied(true)
        return
      }
      setOverview(ov)
      setUsers(us)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur de chargement.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return users.filter((u) => {
      const matchesQuery =
        !q ||
        u.email.toLowerCase().includes(q) ||
        (u.username ?? '').toLowerCase().includes(q)

      const matchesMode =
        filterMode === 'all' ||
        (filterMode === 'premium' &&
          (u.sub_status === 'active' || u.sub_status === 'on_trial')) ||
        (filterMode === 'comp' && u.sub_source === 'comp') ||
        (filterMode === 'admin' && u.role === 'admin')

      return matchesQuery && matchesMode
    })
  }, [users, query, filterMode])

  // Revenu mensuel estimé : abonnements payants (hors accès offerts) × 5,99 €.
  const estimatedRevenue = useMemo(() => {
    const paying = users.filter(
      (u) =>
        (u.sub_status === 'active' || u.sub_status === 'on_trial') &&
        u.sub_source !== 'comp',
    ).length
    return paying * 5.99
  }, [users])

  // Nouveaux comptes sur les 7 derniers jours.
  const newThisWeek = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    return users.filter((u) => new Date(u.created_at).getTime() >= weekAgo)
      .length
  }, [users])

  function exportCsv() {
    const header = [
      'email',
      'pseudo',
      'role',
      'statut',
      'source',
      'inscrit_le',
      'recettes',
      'transactions',
      'seances',
    ]
    const rows = filtered.map((u) => [
      u.email,
      u.username ?? '',
      u.role,
      u.sub_status,
      u.sub_source,
      u.created_at,
      u.recipes_count,
      u.transactions_count,
      u.workouts_count,
    ])
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `les-carnets-utilisateurs-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  function formatDate(value: string) {
    try {
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(new Date(value))
    } catch {
      return '—'
    }
  }

  async function run(userId: string, action: () => Promise<void>) {
    setBusy(userId)
    setError('')
    try {
      await action()
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Action impossible.')
    } finally {
      setBusy(null)
    }
  }

  if (loading) {
    return (
      <Shell email={email}>
        <p className="text-sm font-semibold text-hazel">Chargement…</p>
      </Shell>
    )
  }

  if (denied) {
    return (
      <Shell email={email}>
        <div className="rounded-2xl border border-bark bg-card p-8 text-center shadow-soft">
          <p className="text-4xl">🔒</p>
          <h2 className="mt-3 font-display text-2xl font-black text-espresso">
            Accès réservé aux administrateurs
          </h2>
          <p className="mt-2 text-sm text-cacao/80">
            Votre compte n’a pas le rôle « admin » sur la suite Les Carnets.
          </p>
          <a
            href="#top"
            className="mt-5 inline-flex rounded-full bg-espresso px-5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5"
          >
            Retour au site
          </a>
        </div>
      </Shell>
    )
  }

  return (
    <Shell email={email}>
      {error && (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-800">
          {error}
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Utilisateurs" value={overview?.users_total ?? 0} />
        <StatCard
          label="Premium"
          value={overview?.premium ?? 0}
          accent="text-sage-deep"
        />
        <StatCard
          label="Revenu / mois"
          value={`${estimatedRevenue.toFixed(2).replace('.', ',')} €`}
          accent="text-terracotta"
          hint="Estimation (payants × 5,99 €)"
        />
        <StatCard
          label="Accès offerts"
          value={overview?.comp ?? 0}
          accent="text-[#8a6a1e]"
        />
        <StatCard
          label="Nouveaux (7 j)"
          value={newThisWeek}
          accent="text-azure-deep"
        />
        <StatCard label="Admins" value={overview?.admins ?? 0} />
      </div>

      <h2 className="mt-8 font-display text-lg font-black text-espresso">
        Activité par carnet
      </h2>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Recettes"
          value={overview?.recipes ?? 0}
          accent="text-terracotta"
        />
        <StatCard
          label="Comptes budget"
          value={overview?.accounts ?? 0}
          accent="text-sage-deep"
        />
        <StatCard
          label="Transactions"
          value={overview?.transactions ?? 0}
          accent="text-sage-deep"
        />
        <StatCard
          label="Séances sport"
          value={overview?.workouts ?? 0}
          accent="text-azure-deep"
        />
      </div>

      {/* Utilisateurs */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-lg font-black text-espresso">
          Utilisateurs ({filtered.length})
        </h2>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher…"
            className="w-full max-w-xs rounded-full border border-bark bg-card px-4 py-2 text-sm font-semibold text-espresso outline-none transition focus:ring-2 focus:ring-terracotta/40 sm:w-56"
          />
          <button
            type="button"
            onClick={exportCsv}
            className="rounded-full border border-bark bg-card px-4 py-2 text-sm font-bold text-espresso transition hover:bg-linen"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {(
          [
            ['all', 'Tous'],
            ['premium', 'Premium'],
            ['comp', 'Offerts'],
            ['admin', 'Admins'],
          ] as const
        ).map(([mode, label]) => (
          <button
            key={mode}
            type="button"
            onClick={() => setFilterMode(mode)}
            className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${
              filterMode === mode
                ? 'bg-espresso text-white'
                : 'bg-linen text-cacao hover:bg-cream-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-3 overflow-x-auto rounded-2xl border border-bark bg-card shadow-soft">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead>
            <tr className="border-b border-bark text-xs font-black uppercase tracking-wide text-hazel">
              <th className="px-4 py-3">Utilisateur</th>
              <th className="px-4 py-3">Abonnement</th>
              <th className="px-4 py-3 text-center">🍳</th>
              <th className="px-4 py-3 text-center">🪙</th>
              <th className="px-4 py-3 text-center">🏃</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => {
              const isAdmin = u.role === 'admin'
              const isComp = u.sub_source === 'comp'
              const rowBusy = busy === u.user_id

              return (
                <tr
                  key={u.user_id}
                  className="border-b border-bark/60 last:border-0"
                >
                  <td className="px-4 py-3">
                    <p className="font-black text-espresso">
                      {u.username || '—'}
                      {isAdmin && (
                        <span className="ml-2 rounded-full bg-espresso px-2 py-0.5 text-[0.6rem] font-black uppercase text-white">
                          Admin
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-cacao/70">{u.email}</p>
                    <p className="mt-0.5 text-[0.65rem] font-semibold text-hazel">
                      Inscrit le {formatDate(u.created_at)}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <SubBadge status={u.sub_status} source={u.sub_source} />
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-cacao">
                    {u.recipes_count}
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-cacao">
                    {u.transactions_count}
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-cacao">
                    {u.workouts_count}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <button
                        type="button"
                        disabled={rowBusy}
                        onClick={() =>
                          run(u.user_id, () =>
                            setRole(u.user_id, isAdmin ? 'user' : 'admin'),
                          )
                        }
                        className="rounded-full bg-linen px-3 py-1.5 text-xs font-bold text-espresso transition hover:bg-cream-300 disabled:opacity-50"
                      >
                        {isAdmin ? 'Retirer admin' : 'Passer admin'}
                      </button>

                      <button
                        type="button"
                        disabled={rowBusy}
                        onClick={() =>
                          run(u.user_id, () =>
                            isComp ? revokeComp(u.email) : grantComp(u.email),
                          )
                        }
                        className="rounded-full bg-honey/20 px-3 py-1.5 text-xs font-bold text-[#8a6a1e] transition hover:bg-honey/30 disabled:opacity-50"
                      >
                        {isComp ? 'Retirer l’offre' : 'Offrir premium'}
                      </button>

                      <button
                        type="button"
                        disabled={rowBusy}
                        onClick={() => {
                          if (
                            window.confirm(
                              `Supprimer définitivement ${u.email} et toutes ses données ?`,
                            )
                          ) {
                            void run(u.user_id, () => deleteUser(u.user_id))
                          }
                        }}
                        className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-hazel">
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Shell>
  )
}

function Shell({
  email,
  children,
}: {
  email?: string
  children: ReactNode
}) {
  return (
    <div className="paper-grain min-h-screen">
      <header className="border-b border-bark bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-terracotta">
              Les Carnets · Console
            </p>
            <h1 className="font-display text-xl font-black text-espresso">
              Administration
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {email && (
              <span className="hidden text-xs font-semibold text-hazel sm:inline">
                {email}
              </span>
            )}
            <a
              href="#top"
              className="rounded-full bg-espresso px-4 py-2 text-sm font-bold text-white transition hover:-translate-y-0.5"
            >
              Retour au site
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
    </div>
  )
}
