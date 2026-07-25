// Supabase Edge Function — Intégration Strava pour Carnet de sport.
//
// Le secret client Strava reste ici, côté serveur : le front ne le voit jamais.
// Actions (POST JSON { action, ... }) :
//   - exchange   : échange le code OAuth contre des jetons + stocke la connexion
//   - sync       : récupère les activités Strava et les importe dans workouts
//   - status     : renvoie l'état de la connexion
//   - disconnect : supprime la connexion (les séances importées sont conservées)
//
// Secrets attendus (supabase secrets set) : STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET.
// SUPABASE_URL et SUPABASE_ANON_KEY sont fournis automatiquement.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const STRAVA_CLIENT_ID = Deno.env.get('STRAVA_CLIENT_ID') ?? ''
const STRAVA_CLIENT_SECRET = Deno.env.get('STRAVA_CLIENT_SECRET') ?? ''
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  })
}

/** Correspondance type d'activité Strava → catégorie du carnet. */
function mapStravaSport(sportType: string): string {
  const map: Record<string, string> = {
    Run: 'course',
    VirtualRun: 'course',
    TrailRun: 'trail',
    Walk: 'marche',
    Hike: 'randonnee',
    Ride: 'velo',
    VirtualRide: 'velo',
    GravelRide: 'velo',
    EBikeRide: 'velo',
    MountainBikeRide: 'vtt',
    EMountainBikeRide: 'vtt',
    Swim: 'natation',
    WeightTraining: 'musculation',
    Workout: 'autre',
    Crossfit: 'hiit',
    HighIntensityIntervalTraining: 'hiit',
    Yoga: 'yoga',
    RockClimbing: 'escalade',
  }

  return map[sportType] ?? 'autre'
}

const KM_CATEGORIES = new Set([
  'course',
  'trail',
  'marche',
  'randonnee',
  'velo',
  'vtt',
])
const ELEVATION_CATEGORIES = new Set(['trail', 'randonnee', 'velo', 'vtt'])

type StravaActivity = {
  id: number
  name: string
  type?: string
  sport_type?: string
  distance?: number
  moving_time?: number
  total_elevation_gain?: number
  start_date_local?: string
}

/** Transforme une activité Strava en ligne workouts prête pour l'upsert. */
function activityToWorkoutRow(activity: StravaActivity, userId: string) {
  const sportType = activity.sport_type ?? activity.type ?? 'Workout'
  const category = mapStravaSport(sportType)
  const date = (activity.start_date_local ?? '').slice(0, 10)
  const durationMinutes = Math.max(
    1,
    Math.round((activity.moving_time ?? 0) / 60),
  )

  const details: Record<string, number> = {}
  const distanceMeters = activity.distance ?? 0

  if (category === 'natation' && distanceMeters > 0) {
    details.distance = Math.round(distanceMeters)
  } else if (KM_CATEGORIES.has(category) && distanceMeters > 0) {
    details.distance = Math.round((distanceMeters / 1000) * 100) / 100
  }

  if (
    ELEVATION_CATEGORIES.has(category) &&
    (activity.total_elevation_gain ?? 0) > 0
  ) {
    details.elevation = Math.round(activity.total_elevation_gain ?? 0)
  }

  return {
    user_id: userId,
    title: activity.name?.trim() || 'Séance Strava',
    sport: category,
    date,
    duration_minutes: durationMinutes,
    intensity: 'Moyenne',
    feeling: 'Correct',
    progress: 'stable',
    notes: '',
    improvement: '',
    is_record: false,
    details,
    source: 'strava',
    external_id: String(activity.id),
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS })
  }

  if (req.method !== 'POST') {
    return json({ error: 'Méthode non autorisée.' }, 405)
  }

  if (!STRAVA_CLIENT_ID || !STRAVA_CLIENT_SECRET) {
    return json(
      { error: 'Configuration Strava manquante côté serveur.' },
      500,
    )
  }

  const authHeader = req.headers.get('Authorization')

  if (!authHeader) {
    return json({ error: 'Authentification requise.' }, 401)
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return json({ error: 'Session invalide.' }, 401)
  }

  let payload: { action?: string; code?: string }

  try {
    payload = await req.json()
  } catch {
    return json({ error: 'Corps de requête invalide.' }, 400)
  }

  const action = payload.action

  try {
    if (action === 'exchange') {
      return await handleExchange(supabase, user.id, payload.code ?? '')
    }

    if (action === 'sync') {
      return await handleSync(supabase, user.id)
    }

    if (action === 'status') {
      return await handleStatus(supabase, user.id)
    }

    if (action === 'disconnect') {
      await supabase.from('strava_connections').delete().eq('user_id', user.id)
      return json({ ok: true })
    }

    return json({ error: 'Action inconnue.' }, 400)
  } catch (error) {
    console.error('Erreur Strava :', error)
    const message =
      error instanceof Error ? error.message : 'Erreur inattendue.'
    return json({ error: message }, 500)
  }
})

// deno-lint-ignore no-explicit-any
async function handleExchange(supabase: any, userId: string, code: string) {
  if (!code) {
    return json({ error: 'Code d’autorisation manquant.' }, 400)
  }

  const response = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
    }),
  })

  if (!response.ok) {
    return json({ error: 'Échec de la connexion à Strava.' }, 400)
  }

  const data = await response.json()
  const athlete = data.athlete ?? {}
  const athleteName = [athlete.firstname, athlete.lastname]
    .filter(Boolean)
    .join(' ')

  const { error } = await supabase.from('strava_connections').upsert(
    {
      user_id: userId,
      athlete_id: athlete.id ?? null,
      athlete_name: athleteName || null,
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: new Date(data.expires_at * 1000).toISOString(),
      scope: data.scope ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' },
  )

  if (error) {
    return json({ error: 'Impossible d’enregistrer la connexion.' }, 500)
  }

  return json({ ok: true, athlete_name: athleteName })
}

// deno-lint-ignore no-explicit-any
async function getFreshAccessToken(supabase: any, connection: any) {
  const expiresAt = new Date(connection.expires_at).getTime()

  // Marge de 2 minutes avant expiration.
  if (expiresAt > Date.now() + 120_000) {
    return connection.access_token as string
  }

  const response = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: connection.refresh_token,
    }),
  })

  if (!response.ok) {
    throw new Error('Échec du rafraîchissement du jeton Strava.')
  }

  const data = await response.json()

  await supabase
    .from('strava_connections')
    .update({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: new Date(data.expires_at * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', connection.user_id)

  return data.access_token as string
}

// deno-lint-ignore no-explicit-any
async function handleSync(supabase: any, userId: string) {
  const { data: connection } = await supabase
    .from('strava_connections')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (!connection) {
    return json({ error: 'Aucune connexion Strava.' }, 400)
  }

  const accessToken = await getFreshAccessToken(supabase, connection)

  // Import incrémental : on ne récupère que ce qui suit la dernière synchro.
  const params = new URLSearchParams({ per_page: '100' })

  if (connection.last_sync_at) {
    const after = Math.floor(
      new Date(connection.last_sync_at).getTime() / 1000 - 86_400,
    )
    params.set('after', String(after))
  }

  const response = await fetch(
    `https://www.strava.com/api/v3/athlete/activities?${params.toString()}`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  )

  if (!response.ok) {
    return json({ error: 'Impossible de récupérer les activités Strava.' }, 502)
  }

  const activities = (await response.json()) as StravaActivity[]

  const rows = activities
    .filter((activity) => activity.start_date_local)
    .map((activity) => activityToWorkoutRow(activity, userId))

  let imported = 0

  if (rows.length > 0) {
    const { error } = await supabase
      .from('workouts')
      .upsert(rows, { onConflict: 'user_id,external_id' })

    if (error) {
      return json({ error: 'Impossible d’importer les séances.' }, 500)
    }

    imported = rows.length
  }

  await supabase
    .from('strava_connections')
    .update({ last_sync_at: new Date().toISOString() })
    .eq('user_id', userId)

  return json({ ok: true, imported })
}

// deno-lint-ignore no-explicit-any
async function handleStatus(supabase: any, userId: string) {
  const { data: connection } = await supabase
    .from('strava_connections')
    .select('athlete_name, last_sync_at')
    .eq('user_id', userId)
    .maybeSingle()

  return json({
    connected: Boolean(connection),
    athlete_name: connection?.athlete_name ?? null,
    last_sync_at: connection?.last_sync_at ?? null,
  })
}
