import { createClient } from '@supabase/supabase-js'

import { isSharedDomain, sharedAuthStorage } from './sharedAuthStorage'

/**
 * Client Supabase partagé de la suite « Les Carnets ».
 *
 * L'URL et la clé publique viennent des variables d'environnement Vite.
 * Sur `*.lescarnets.app`, la session est partagée entre les sous-domaines
 * via un cookie sur `.lescarnets.app` (SSO). Ailleurs (local, *.vercel.app),
 * comportement par défaut (localStorage).
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const IS_SUPABASE_CONFIGURED = Boolean(url && anonKey)

const authOptions = isSharedDomain()
  ? {
      auth: {
        storage: sharedAuthStorage,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    }
  : undefined

export const supabase =
  url && anonKey ? createClient(url, anonKey, authOptions) : null
