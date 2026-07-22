import { createClient } from '@supabase/supabase-js'

/**
 * Client Supabase partagé de la suite « Les Carnets ».
 *
 * L'URL et la clé publique viennent des variables d'environnement Vite.
 * En production, la session sera partagée entre les sous-domaines
 * (recettes./budget./sport.lescarnets.app) via un cookie sur `.lescarnets.app`.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const IS_SUPABASE_CONFIGURED = Boolean(url && anonKey)

export const supabase =
  url && anonKey ? createClient(url, anonKey) : null
