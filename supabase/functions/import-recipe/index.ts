// Import de recette depuis un lien : récupère la page côté serveur (contourne
// le CORS du navigateur), lit les données structurées schema.org `Recipe`
// (JSON-LD) et renvoie une recette normalisée prête à préremplir le formulaire.
//
// Déploiement (dashboard Supabase → Edge Functions → Deploy → Via Editor, nom
// « import-recipe », coller ce code), ou CLI :
//   supabase functions deploy import-recipe
// (Laisser la vérification JWT activée : seuls les utilisateurs connectés
// peuvent appeler la fonction.)

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
}

/** Bloque les URL non http(s) et les hôtes internes (anti-SSRF basique). */
function isSafeUrl(raw: string): URL | null {
  let url: URL
  try {
    url = new URL(raw)
  } catch {
    return null
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null

  const host = url.hostname.toLowerCase()
  if (
    host === 'localhost' ||
    host === '0.0.0.0' ||
    !host.includes('.') ||
    /^127\./.test(host) ||
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^169\.254\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host)
  ) {
    return null
  }
  return url
}

/** Nettoie une chaîne : retire les balises HTML et normalise les espaces. */
function clean(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Durée ISO 8601 (PT1H30M) → minutes. */
function isoToMinutes(value: unknown): number {
  if (typeof value !== 'string') return 0
  const match = value.match(/^P(?:\d+D)?T?(?:(\d+)H)?(?:(\d+)M)?/i)
  if (!match) return 0
  const days = /(\d+)D/i.exec(value)
  const hours = match[1] ? parseInt(match[1], 10) : 0
  const minutes = match[2] ? parseInt(match[2], 10) : 0
  return (days ? parseInt(days[1], 10) * 24 * 60 : 0) + hours * 60 + minutes
}

function firstImage(image: unknown): string | null {
  if (!image) return null
  if (typeof image === 'string') return image
  if (Array.isArray(image)) return firstImage(image[0])
  if (typeof image === 'object') {
    const url = (image as Record<string, unknown>).url
    return typeof url === 'string' ? url : null
  }
  return null
}

/** Extrait les étapes depuis recipeInstructions (string | array | sections). */
function parseInstructions(instructions: unknown): string[] {
  if (!instructions) return []

  if (typeof instructions === 'string') {
    return instructions
      .split(/\r?\n|(?<=\.)\s{2,}/)
      .map(clean)
      .filter(Boolean)
  }

  if (Array.isArray(instructions)) {
    const steps: string[] = []
    for (const item of instructions) {
      if (typeof item === 'string') {
        const c = clean(item)
        if (c) steps.push(c)
      } else if (item && typeof item === 'object') {
        const obj = item as Record<string, unknown>
        const type = String(obj['@type'] ?? '')
        if (type.includes('HowToSection') && Array.isArray(obj.itemListElement)) {
          for (const sub of obj.itemListElement) {
            const t = clean((sub as Record<string, unknown>)?.text)
            if (t) steps.push(t)
          }
        } else {
          const t = clean(obj.text ?? obj.name)
          if (t) steps.push(t)
        }
      }
    }
    return steps
  }

  return []
}

function parseIngredients(ingredients: unknown): string[] {
  if (!Array.isArray(ingredients)) return []
  return ingredients.map(clean).filter(Boolean)
}

function parseYield(recipeYield: unknown): number {
  if (typeof recipeYield === 'number') return Math.round(recipeYield)
  const source = Array.isArray(recipeYield) ? recipeYield[0] : recipeYield
  if (typeof source === 'string') {
    const m = source.match(/\d+/)
    if (m) return parseInt(m[0], 10)
  }
  return 0
}

/** Aplati les JSON-LD (@graph, tableaux) dans une liste plate de nœuds. */
function collectNodes(node: unknown, out: Record<string, unknown>[]) {
  if (!node) return
  if (Array.isArray(node)) {
    for (const n of node) collectNodes(n, out)
    return
  }
  if (typeof node === 'object') {
    const obj = node as Record<string, unknown>
    out.push(obj)
    if (obj['@graph']) collectNodes(obj['@graph'], out)
  }
}

function isRecipeNode(obj: Record<string, unknown>): boolean {
  const t = obj['@type']
  if (typeof t === 'string') return t.toLowerCase().includes('recipe')
  if (Array.isArray(t)) return t.some((x) => String(x).toLowerCase().includes('recipe'))
  return false
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS })
  }
  if (request.method !== 'POST') {
    return json({ ok: false, error: 'Méthode non autorisée' }, 405)
  }

  let url: string
  try {
    const body = await request.json()
    url = String(body.url ?? '')
  } catch {
    return json({ ok: false, error: 'Requête invalide' })
  }

  const safe = isSafeUrl(url)
  if (!safe) {
    return json({ ok: false, error: 'Lien invalide.' })
  }

  let html: string
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)
    const res = await fetch(safe.toString(), {
      headers: {
        // Certains sites renvoient une page allégée sans JSON-LD aux bots :
        // on se présente comme un navigateur classique.
        'User-Agent':
          'Mozilla/5.0 (compatible; LesCarnets/1.0; +https://lescarnets.app)',
        Accept: 'text/html',
      },
      signal: controller.signal,
    })
    clearTimeout(timeout)
    if (!res.ok) {
      return json({ ok: false, error: `Page inaccessible (${res.status}).` })
    }
    html = await res.text()
  } catch {
    return json({ ok: false, error: 'Impossible de récupérer la page.' })
  }

  // Extrait tous les blocs JSON-LD.
  const nodes: Record<string, unknown>[] = []
  const regex =
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  let match: RegExpExecArray | null
  while ((match = regex.exec(html)) !== null) {
    try {
      collectNodes(JSON.parse(match[1].trim()), nodes)
    } catch {
      // Bloc JSON-LD invalide → ignoré.
    }
  }

  const recipeNode = nodes.find(isRecipeNode)
  if (!recipeNode) {
    return json({
      ok: false,
      error:
        "Cette page ne contient pas de recette lisible. Essaie un autre site (la plupart des grands sites de cuisine fonctionnent).",
    })
  }

  const ingredients = parseIngredients(recipeNode.recipeIngredient)
  const steps = parseInstructions(recipeNode.recipeInstructions)
  const prepTime = isoToMinutes(recipeNode.prepTime)
  const cookTime = isoToMinutes(recipeNode.cookTime)
  const totalTime = isoToMinutes(recipeNode.totalTime)

  const recipe = {
    title: clean(recipeNode.name),
    description: clean(recipeNode.description),
    ingredients,
    steps,
    prepTime,
    // Si seul le temps total est fourni, on le met en cuisson (approximation).
    cookTime: cookTime || (totalTime > prepTime ? totalTime - prepTime : totalTime),
    servings: parseYield(recipeNode.recipeYield),
    imageUrl: firstImage(recipeNode.image),
    sourceUrl: safe.toString(),
  }

  if (!recipe.title || (ingredients.length === 0 && steps.length === 0)) {
    return json({ ok: false, error: 'Recette trouvée mais vide ou illisible.' })
  }

  return json({ ok: true, recipe })
})
