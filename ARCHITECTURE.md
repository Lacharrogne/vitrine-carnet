# Les Carnets — Architecture de l'écosystème

Document de référence pour tout l'écosystème « Carnet ». À lire avant de
travailler sur n'importe lequel des dépôts, pour comprendre le socle partagé et
respecter les conventions communes.

> Établi le 3 septembre 2026 à partir du code des quatre dépôts. À réviser au
> fil des évolutions.

## Vue d'ensemble

Quatre applications React qui partagent **un seul compte**, **un seul
abonnement** et une même identité « papier premium ». Chaque app est un dépôt
autonome, déployé sur son propre sous-domaine.

| Dépôt | Rôle | Domaine | Couleur / thème |
|---|---|---|---|
| `Carnet-de-recettes` | Recettes, planning, courses | recettes.lescarnets.app | terracotta / clair |
| `Carnet-de-budget` | Finances personnelles | budget.lescarnets.app | émeraude / clair |
| `Carnet-de-sport` | Entraînement & progrès | sport.lescarnets.app | azur / **sombre** |
| `vitrine-carnet` | Vitrine + Hub + admin + **SQL centrales** | lescarnets.app | espresso |

**Stack commune** : React 19 · TypeScript · Vite · Tailwind CSS v4 (tokens
`@theme` par app) · Supabase (Postgres + Auth + Storage) · hébergement Vercel.

## Backend partagé (projet Supabase « Les Carnets »)

Un **unique** projet Supabase sert les quatre apps. Ses migrations « socle »
vivent dans **`vitrine-carnet/supabase/migrations/`** (identité + facturation,
puis schémas `recettes` / `budget` / `sport` et leurs imports, console admin,
etc.). Chaque carnet garde en plus quelques migrations locales.

Tables centrales (`public`) :

- **`profiles`** — `user_id`, `username`, `avatar_url`, `bio`, `role`
  (`user` / `admin`). Créé automatiquement à l'inscription (trigger
  `handle_new_user`). RLS : lecture publique, écriture de sa propre ligne ;
  `role` non modifiable par `authenticated` (anti-escalade).
- **`subscriptions`** — `user_id`, `status`, `plan`, `source`, dates
  (`renews_at`, `ends_at`), URLs portail client. Écrite par le **webhook Lemon
  Squeezy** en `service_role` (contourne la RLS) ; chacun ne lit que sa ligne.

Fonctions RPC (SECURITY DEFINER, réservées aux admins via `is_admin()`) :
`grant_comp_access` / `revoke_comp_access` (premium gratuit, `source='comp'`),
`list_comp_access`, `admin_set_role`, `admin_delete_user`.

## SSO entre sous-domaines

`sharedAuthStorage` (présent dans chaque app) stocke la session Supabase dans
des **cookies posés sur `.lescarnets.app`** (fragmentés sous la limite ~4 Ko),
lisibles par tous les sous-domaines → **un login = connecté partout**.

⚠️ Garde-fou : ce mécanisme **ne s'active que sur `lescarnets.app`**. En local
ou sur `*.vercel.app`, repli automatique sur `localStorage` (comportement
Supabase par défaut). Aucun risque de casse hors production.

## Modèle d'accès & facturation

- **Essai gratuit 14 jours**, calculé depuis `user.created_at`.
- Verrou par app : constante `ENFORCE_TRIAL` dans `src/config/subscription.ts`
  (actuellement **`true`** partout → paywall actif). Quand `false`, accès ouvert
  à tous même après l'essai.
- L'accès est résolu par `EntitlementProvider` / `useEntitlement`, qui expose
  `{ status, isPremium, hasAccess, daysLeft }` à toute l'app (une seule lecture
  de l'abonnement partagé).

**Résolution de l'accès** (`isSubscriptionActive`) :

1. `status` = `active` ou `on_trial`, et le `plan` couvre ce carnet → accès.
2. `status` = `cancelled` avec `ends_at` futur → accès jusqu'à l'échéance.
3. Sinon, `created_at + 14 j` non dépassé → accès (essai).
4. Sinon → `expired` (écran de fin d'essai).

**Portée d'un `plan`** : un abonnement débloque un carnet si son `plan` vaut ce
carnet, `all`, ou `null` (offre unique « toute la suite »).

**Prix — source de vérité unique : `vitrine-carnet/src/config.ts` (`PRICING`).**
Suite complète 3,99 €/mois (39,99 €/an) ; un seul carnet 2,49 €/mois
(24,99 €/an). Les carnets **ne définissent aucun prix en local** : leur page
d'abonnement redirige vers le Hub (`lescarnets.app/#hub`), qui gère souscription
**et** résiliation (checkout Lemon Squeezy, `user_id` joint en donnée custom et
renvoyé par le webhook).

## Conventions & garde-fous communs

Règles apprises en corrigeant de vrais bugs — à respecter pour ne pas rouvrir
des plaies refermées :

- **Aucun dialogue natif.** Zéro `window.confirm` / `prompt` / `alert`. Utiliser
  le `DialogProvider` (sport, recettes) ou `ConfirmActionModal` (budget) —
  Promise-based, stylés, accessibles.
- **Stockage : upsert, jamais « tout supprimer puis réinsérer ».** Le motif
  nuke-and-repave a causé des pertes de données. Toujours upsert + nettoyage
  ciblé (`.not('id','in',(…))`).
- **Pas de colonne DB sans migration.** Un champ écrit dans Supabase doit
  exister en base (des colonnes fantômes ont déjà fait échouer toutes les
  insertions).
- **Grilles mobiles : colonnes définies (`grid-cols-1`…), jamais un `grid` nu.**
  Une grille sans colonnes déborde et force le dézoom sur mobile.
- **Brouillons de formulaires** en `localStorage` avec expiration 12 h (hook
  `useFormDraft`), mini-formulaires compris.
- **PWA installable** : capter `beforeinstallprompt` **au chargement du module**
  (`src/lib/installPrompt.ts`), pas dans un `useEffect` — sinon la bannière
  d'installation ne s'affiche jamais sur desktop. Gérer la safe-area
  (`viewport-fit=cover` + `env()`).

## Points à surveiller

- **Tests / CI** : seul `Carnet-de-recettes` a des tests (Vitest, logique pure).
  Budget et sport n'ont ni tests ni CI.
- Toute évolution de prix se fait **uniquement** dans `vitrine-carnet` — ne pas
  réintroduire de config de prix dans les carnets.
