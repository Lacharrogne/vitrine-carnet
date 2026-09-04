# Journal des changements — Vitrine & Hub « Les Carnets » 📔

Main courante du dépôt central : **ce qui a été fait, quand, et pourquoi**.
Ordre antéchronologique (le plus récent en haut).

> Chaque modification est consignée ici **dans le même commit** que le
> changement. Voir `CLAUDE.md` pour le format et la règle.
>
> ⚠️ Ce dépôt porte les **migrations SQL centrales** des quatre apps : une
> entrée décrivant une migration doit être particulièrement précise.
>
> Ce journal démarre le 2026-07-26 ; l'historique antérieur est dans `git log`.

---

## 2026-09-04

### Intégration continue (CI)

- **Ce qui change** : ajout d'un workflow GitHub Actions qui, sur chaque PR et
  sur `main`, installe les dépendances, passe le lint, (pas de lint ni de tests dans ce dépôt) et vérifie que le
  build compile. Un second job **refuse toute PR qui touche à `src/` ou
  `supabase/` sans mettre à jour `CHANGELOG.md`**.
- **Pourquoi** : aucun dépôt n'avait de CI — rien n'empêchait de fusionner une
  PR qui casse le build, et la main courante ne tenait que par la discipline.
- **À savoir** : le lint est **non bloquant** pour l'instant (`continue-on-error`),
  car il remonte des erreurs préexistantes. Le rendre bloquant une fois
  celles-ci corrigées, en retirant cette ligne du workflow.

### Mise en place de la main courante

- **Ce qui change** : ajout de ce `CHANGELOG.md` et d'un `CLAUDE.md` qui fixe
  les règles de travail du dépôt (dont l'obligation de tenir ce journal).
- **Pourquoi** : garder une trace précise des décisions, afin qu'une session
  future — sans le contexte de celle qui a fait le changement — sache ce qui a
  déjà été fait et pourquoi.

### Constats de l'audit consignés dans ARCHITECTURE.md (#11)

- **Ce qui change** : la section « Points à surveiller » devient un **état
  connu** renvoyant au tableau de bord d'audit (#10).
- **À savoir** : les deux chemins sensibles à connaître avant de toucher au
  code sont l'**entitlement fragile** (une erreur de lecture d'abonnement peut
  bloquer un abonné payant) et les **données premium non synchronisées**
  (planning, historique, mensurations en `localStorage`).

### Audit technique de l'écosystème (#10)

- **Ce qui change** : ouverture d'un tableau de bord recensant 9 constats
  répartis en tickets sur les quatre dépôts.
- **Pourquoi** : ces constats ne vivaient que dans une conversation ; ils
  auraient été perdus.

## 2026-09-03

### README corrigé et ARCHITECTURE.md ajouté (#9)

- **Ce qui change** : le README n'affirme plus que la vitrine est « 100 %
  statique, sans Supabase » ; ajout d'`ARCHITECTURE.md`, référence de
  l'écosystème (socle partagé, SSO, modèle d'accès, garde-fous).
- **Pourquoi** : c'était devenu **faux** — la vitrine porte désormais
  l'authentification, le Hub d'abonnement et la console d'administration.

### L'invite d'installation ne s'affichait pas sur PC (#8)

- **Ce qui change** : `beforeinstallprompt` est capté dès le chargement du
  module (`src/lib/installPrompt.ts`), et non plus dans un `useEffect`.

## 2026-09-01

### Fenêtre in-app pour la confirmation admin (#7)

- **Ce qui change** : le `window.confirm` de la console d'administration devient
  une fenêtre in-app.

## 2026-08-30 → 08-31

### Mobile : grilles et menu (#5, #6)

- **Ce qui change** : `grid-cols-1` sur les grilles mono-colonne ; fondu en haut
  du menu ouvert.

## 2026-08-29

### Encoche et barre d'accueil iOS (#4)

## 2026-08-28

### La vitrine devient installable (#3)

- **Ce qui change** : manifest, service worker, icônes et bannière
  d'installation pour « Les Carnets ».

## 2026-08-27

### Mobile : le menu ouvert remplit l'écran (#2)

## 2026-08-21 → 08-22

### Webhook Lemon Squeezy : ne traiter que les abonnements (#1)

- **Ce qui change** : `ls-webhook` ignore désormais les événements
  facture/commande.
- **Pourquoi** : ces événements écrasaient le statut par `paid` et
  **verrouillaient des abonnés actifs** hors de leur app.
- **À savoir** : incident de facturation à ne pas reproduire — seul l'objet
  `subscriptions` fait foi.

### Edge Function `import-recipe`

- **Ce qui change** : récupère une page de recette côté serveur et lit le
  schema.org Recipe (JSON-LD) pour préremplir le formulaire.
- **Pourquoi** : contourner le CORS, impossible à faire depuis le navigateur.

## 2026-08-20

### Migrations : brouillons, notes, collections, photos d'avis

- **Ce qui change** : colonne `status` sur `recipes` (brouillons) ; tables
  `recipe_notes`, `recipe_collections` et `recipe_collection_items` ; colonne
  `image_url` sur `recipe_reviews` ; table `user_preferences` (préférences
  synchronisées au compte).

## 2026-07-26

### Pages légales et acceptation des CGU

- **Ce qui change** : pages CGU, confidentialité et mentions légales, liens dans
  le pied de page, et case d'acceptation obligatoire à l'inscription.
