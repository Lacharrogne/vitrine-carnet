/**
 * ──────────────────────────────────────────────────────────────────────────
 *  CONFIGURATION DE LA VITRINE — « Les Carnets »
 * ──────────────────────────────────────────────────────────────────────────
 *
 *  Cette vitrine présente TOUT l'écosystème « Carnet » : un même esprit
 *  (clair, beau, premium, rassurant) décliné en plusieurs carnets, chacun
 *  avec sa propre identité.
 *
 *  C'est le SEUL fichier à modifier pour brancher la vitrine sur tes sites :
 *  tous les boutons et liens de la page lisent leurs URLs ici.
 *
 *  👉 Mets à jour les adresses (`url`, `signupUrl`) et les statuts (`status`)
 *     de chaque carnet ci-dessous au fur et à mesure de tes mises en ligne.
 */

export const BRAND = {
  name: 'Les Carnets',
  tagline: 'Une vie organisée, carnet après carnet',
  logo: '/logo.png',
}

/**
 * L'écosystème, en une phrase. Sert au hero et au référencement.
 */
export const ECOSYSTEM = {
  name: 'Les Carnets',
  promise:
    'Une famille d’applications qui mettent de l’ordre dans votre quotidien : vos recettes, votre argent, votre sport. Le même soin, le même calme, à chaque page.',
}

export type CarnetStatus = 'live' | 'soon'
export type CarnetAccent = 'terracotta' | 'sage' | 'azure' | 'honey'

export interface Carnet {
  id: string
  name: string
  /** Court : la promesse du carnet en quelques mots. */
  tagline: string
  /** Une à deux phrases, ce que le carnet fait pour l'utilisateur. */
  description: string
  emoji: string
  /** Logo illustré du carnet (personnage « Chloé »), servi depuis /public. */
  logo: string
  accent: CarnetAccent
  status: CarnetStatus
  /** 3 points forts affichés sur la carte. */
  highlights: string[]
  /** Adresse de l'application (laisse `null` si le carnet n'est pas en ligne). */
  url: string | null
  /** Page d'inscription / création de compte (souvent `<url>/auth`). */
  signupUrl: string | null
}

/**
 * Les carnets de l'écosystème.
 *
 * Ordre = ordre d'affichage. Passe un carnet en `status: 'live'` et renseigne
 * ses `url` / `signupUrl` dès qu'il est déployé.
 */
export const CARNETS: Carnet[] = [
  {
    id: 'recettes',
    name: 'Carnet de recettes',
    tagline: 'Votre cuisine, enfin organisée',
    description:
      'Réunissez vos recettes, planifiez vos repas et préparez vos courses — tout dans un seul carnet, simple et chaleureux.',
    emoji: '🍳',
    logo: '/logo-recettes.png',
    accent: 'terracotta',
    status: 'live',
    highlights: [
      'Recettes & favoris réunis',
      'Liste de courses par rayon',
      'Planning de la semaine',
    ],
    url: 'https://recettes.lescarnets.app/',
    signupUrl: 'https://recettes.lescarnets.app/auth',
  },
  {
    id: 'budget',
    name: 'Carnet de budget',
    tagline: 'Votre argent, enfin clair',
    description:
      'La puissance d’un tableur, sans la complexité d’Excel. Suivez revenus, dépenses, budgets et épargne, et sachez toujours où vous en êtes.',
    emoji: '🪙',
    logo: '/logo-budget.png',
    accent: 'sage',
    status: 'live',
    highlights: [
      'Score de santé financière',
      'Budgets & alertes en douceur',
      'Épargne, objectifs & patrimoine',
    ],
    url: 'https://budget.lescarnets.app/',
    signupUrl: 'https://budget.lescarnets.app/auth',
  },
  {
    id: 'sport',
    name: 'Carnet de sport',
    tagline: 'Votre forme, enfin suivie',
    description:
      'Planifiez vos séances, suivez vos progrès et gardez le rythme. Un carnet d’entraînement clair qui vous motive sans vous juger.',
    emoji: '🏃',
    logo: '/logo-sport.png',
    accent: 'azure',
    status: 'live',
    highlights: [
      'Séances & programmes',
      'Suivi des progrès',
      'Objectifs motivants',
    ],
    url: 'https://sport.lescarnets.app/',
    signupUrl: 'https://sport.lescarnets.app/auth',
  },
]

/**
 * Liens transverses (pied de page, contact).
 */
export const LINKS = {
  CONTACT_EMAIL: 'maxi.charr@gmail.com',
  PRIVACY_URL: '#confidentialite',
  TERMS_URL: '#cgu',
  LEGAL_URL: '#mentions-legales',
}

/**
 * Tarifs affichés. Le même principe pour chaque carnet : un essai gratuit
 * (toutes les fonctionnalités, sans carte bancaire), puis un abonnement
 * simple qui débloque tout.
 */
export const PRICING = {
  /** Durée de l'essai gratuit, en jours. */
  trialDays: 14,
  premium: {
    priceMonthly: '3,99 €',
    periodMonthly: '/ mois',
    priceYearly: '39,99 €',
    periodYearly: '/ an',
    yearlySavings: '2 mois offerts',
  },
  /** Prix d'entrée pour un seul carnet (détaillé dans le Hub). */
  single: {
    priceMonthly: '2,49 €',
    priceYearly: '24,99 €',
  },
}
