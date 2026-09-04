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

### Migration 0020 — suivi des erreurs rencontrées par les utilisateurs

- **Ce qui change** : nouvelle table `client_errors`, destinée à recevoir les
  erreurs non rattrapées des quatre applications, plus une fonction de purge
  réservée aux administrateurs. Rien côté application pour l'instant.
- **Pourquoi** : une erreur survenue chez quelqu'un n'allait nulle part — elle
  s'affichait dans une console que personne ne regarde. Un incident n'était
  connu que si la personne prenait la peine d'écrire, ou jamais.
- **À savoir** : l'écriture est **ouverte aux visiteurs non connectés** (une
  erreur peut survenir avant la connexion), mais la **lecture est réservée aux
  administrateurs** : un message d'erreur peut contenir des bribes de données
  personnelles. Des contraintes de taille bornent les messages pour qu'une
  boucle d'erreurs ne puisse pas gonfler la base. Vérifiée sur PostgreSQL 16 :
  un utilisateur ordinaire ne lit rien (pas même ses propres erreurs), ne
  supprime rien, et ne peut pas attribuer une erreur à quelqu'un d'autre.

### Migration 0019 — mensurations corporelles

- **Ce qui change** : nouvelle table privée `body_measurements` (RLS
  propriétaire seul), une ligne par date avec cinq mesures facultatives en
  centimètres. Rien côté application pour l'instant : la migration prépare le
  terrain.
- **Pourquoi** : sur la page « Corps » du carnet de sport, le poids était déjà
  rattaché au compte mais les mensurations vivaient uniquement dans le
  navigateur. Dans une même interface, la moitié des données suivait
  l'utilisateur et l'autre non — changer de téléphone effaçait l'historique de
  mensurations, silencieusement.
- **À savoir** : deux garde-fous que la table du poids n'a pas — une ligne
  entièrement vide est refusée (pas d'entrées fantômes dans l'historique), et
  une mesure nulle ou négative aussi (erreur de saisie, pas une donnée).
  Migration vérifiée sur une base PostgreSQL 16 jetable : rejouable,
  contraintes et cascade conformes.

### ARCHITECTURE.md : état connu remis à jour

- **Ce qui change** : la section « État connu » distingue désormais ce qui a
  été **corrigé** (entitlement, synchronisation du planning, CI, bundle sport)
  de ce qui reste **ouvert** (mensurations sport, tests, lint, absence de suivi
  d'erreurs).
- **Pourquoi** : elle décrivait encore comme problèmes actuels quatre points
  réglés dans la journée. Un document périmé est pire que pas de document : il
  fait repartir une session future sur de fausses pistes.
- **À savoir** : cette section se relit à chaque correction d'un point d'audit.

### Migration 0018 — planning de repas & historique de cuisine

- **Ce qui change** : deux nouvelles tables privées (RLS propriétaire seul),
  `meal_plan_entries` (une ligne par créneau **rempli** de la semaine type) et
  `cooking_history` (compteur « déjà cuisiné » + date). Rien côté application
  pour l'instant : la migration prépare le terrain.
- **Pourquoi** : ces données ne vivaient que dans le navigateur, alors que le
  planning est une fonctionnalité **payante** — rempli sur le téléphone, il
  n'apparaissait pas sur l'ordinateur, et vider le cache l'effaçait sans
  recours.
- **À savoir** : une ligne par créneau (et non un document unique) pour que
  deux appareils modifiant des repas différents ne s'écrasent pas, et pour ne
  jamais avoir à réécrire tout le planning. Vider un créneau = supprimer sa
  ligne. Les deux tables partent en cascade avec le compte ou la recette
  concernée. Migration vérifiée sur une base PostgreSQL 16 jetable :
  rejouable, contraintes et cascades conformes.

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
