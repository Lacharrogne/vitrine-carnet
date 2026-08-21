# Plan directeur — « Les Carnets » en une suite unifiée

Objectif : **un seul compte + un seul abonnement** qui débloque tous les
carnets (recettes, budget, sport). La vitrine devient le **hub** (inscription
+ paiement), et chaque carnet consomme le même droit d'accès.

Ce document est la source de vérité du chantier. On avance **par phases**,
sans casser l'existant (les carnets actuels continuent de tourner).

---

## Architecture cible

```
                 ┌─────────────────────────────┐
                 │   Supabase « Les Carnets »   │   ← UN SEUL projet
                 │  auth partagée (auth.users)  │
                 │  public.profiles             │
                 │  public.subscriptions  ◄──── webhook Lemon Squeezy (1 produit)
                 │  schéma recettes.*           │
                 │  schéma budget.*             │
                 │  schéma sport.*              │
                 └─────────────┬───────────────┘
                               │  (même URL + clé anon)
        ┌──────────────┬───────┼────────────┬───────────────┐
        │              │       │            │               │
   vitrine        recettes.  budget.     sport.        (cookie de session
  (hub: signup,   lescarnets lescarnets  lescarnets     partagé sur
   pricing,        .fr        .fr         .fr           .lescarnets.fr
   checkout)                                            → SSO, 1 seul login)
```

**Idées-clés :**
- **Un seul projet Supabase** → une seule authentification, un seul
  `profiles`, un seul `subscriptions`. C'est ce qui rend le « compte unique »
  possible (l'auth Supabase ne se partage pas entre projets).
- **Données des carnets** isolées par **schéma** Postgres (`recettes`,
  `budget`, `sport`) ; le commun (identité, abonnement) reste dans `public`.
- **Sous-domaines d'un même domaine racine** (`lescarnets.fr`) + session
  stockée dans un **cookie sur `.lescarnets.fr`** → l'utilisateur se connecte
  une fois, il est connecté partout (SSO).
- **Un seul produit Lemon Squeezy** « Les Carnets Premium ». Le webhook écrit
  dans le `subscriptions` commun. Chaque carnet lit ce même droit.

---

## Ce que VOUS devez faire (prérequis, hors code)

1. **Acheter un domaine racine** (~10 €/an), ex. `lescarnets.fr`.
2. **Créer un nouveau projet Supabase** « Les Carnets » (celui qui hébergera
   tout). Noter son URL et sa clé `anon`.
3. Plus tard : configurer les sous-domaines chez l'hébergeur (Vercel) et
   pointer chaque app dessus.

## Ce que JE fais (code)

Voir les phases ci-dessous. Tout le socle paiement déjà construit sur
Carnet de recettes (table `subscriptions`, webhook, `useEntitlement`, page
premium, admin) est **réutilisé** comme socle central.

---

## Phases

### Phase 1 — Backend central (identité + abonnement) ✅ démarrée
- `supabase/migrations/0001_identity_billing.sql` (dans ce dépôt) : crée
  `profiles`, `subscriptions`, `is_admin()`, accès offerts, `admin_set_role`,
  `admin_delete_user`. **À exécuter dans le nouveau projet Supabase.**

### Phase 2 — Brancher les apps sur le backend commun
- Chaque app (vitrine + 3 carnets) pointe vers le **même** Supabase
  (URL + clé anon dans les variables d'environnement).
- Config du client Supabase avec **stockage cookie** sur `.lescarnets.fr`
  pour partager la session entre sous-domaines (SSO).

### Phase 3 — Paiement central
- **Un** produit Lemon Squeezy « Les Carnets » (mensuel + annuel).
- **Un** webhook → écrit dans le `subscriptions` commun.
- Chaque carnet lit l'accès via `useEntitlement` (déjà écrit).

### Phase 4 — Migration des données
- Recréer les schémas `recettes`, `budget`, `sport` dans le projet commun.
- Déplacer les données existantes (petit volume) et **réconcilier les
  comptes** (un même email = un seul compte dans le projet commun).

### Phase 5 — Vitrine = hub
- Ajouter au dépôt vitrine : client Supabase, écran d'inscription/connexion,
  page tarifs branchée sur le checkout Lemon Squeezy (email + `user_id` en
  custom, comme sur Recettes).
- Après paiement, l'utilisateur repart vers le carnet de son choix, déjà
  connecté et premium partout.

---

## Décisions déjà prises
- **Un seul abonnement** pour toute la suite (pas par carnet).
- **Isolation par schéma** Postgres dans un projet Supabase unique.
- **SSO par cookie** sur le domaine racine.
- Lemon Squeezy (Merchant of Record) conservé.

## Décisions à trancher plus tard
- Nom/prix définitifs de l'offre unique (ex. 5,99 €/mois pour les 3 carnets ?).
- Ordre de migration (recettes d'abord, puis budget, puis sport).
- Éventuelle fusion en une seule app (plus tard, si pertinent).
