# 📔 Les Carnets — Vitrine + Hub

Porte d'entrée de l'écosystème **« Carnet »** (recettes, budget, sport). La
vitrine présente la suite et dirige le visiteur vers le bon carnet ; elle
héberge aussi le **Hub d'abonnement** et la **console d'administration** communs
à tout l'écosystème.

> Déployé sur **lescarnets.app** (le Hub est à `lescarnets.app/#hub`).

## Rôle

Ce dépôt joue **trois** rôles :

1. **Vitrine marketing** — landing (hero, fonctionnalités, tarifs, FAQ…).
2. **Hub d'abonnement** — souscription **et** gestion/résiliation, centralisées
   ici pour toute la suite. Grâce au SSO, l'utilisateur y arrive déjà connecté.
3. **Console d'administration** — rôles, accès offerts (comp), gestion des
   comptes.

> ⚠️ Contrairement à ce qu'indiquaient d'anciennes versions de ce README, la
> vitrine **n'est plus 100 % statique** : elle dépend de Supabase (auth,
> abonnement, admin).

Ce dépôt est aussi le **dépositaire des migrations SQL centrales** de tout
l'écosystème (identité, facturation, schémas de chaque carnet) — voir
`supabase/migrations/` et `ARCHITECTURE.md`.

## Stack

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS v4** (tokens « papier premium » — espresso)
- **Supabase** (Auth + Postgres), **lucide-react**

## Démarrer en local

```bash
npm install
npm run dev
```

Variables d'environnement (fichier `.env.local`) :

```bash
VITE_SUPABASE_URL=...        # projet Supabase « Les Carnets »
VITE_SUPABASE_ANON_KEY=...
```

```bash
npm run build     # génère dist/
npm run preview
```

## Configuration

Tout l'affichage des carnets, des liens et des **tarifs** est centralisé dans
**`src/config.ts`** (tableau `CARNETS`, objets `BRAND`, `LINKS`, `PRICING`).
C'est la **source de vérité unique des prix** de la suite :

- Suite complète : **3,99 € / mois** · **39,99 € / an**
- Un seul carnet : **2,49 € / mois** · **24,99 € / an**
- Essai gratuit : **14 jours**

Pour activer un nouveau carnet : ajouter/compléter son entrée dans `CARNETS`,
passer `status` à `'live'` et renseigner `url` / `signupUrl`.

## Écosystème & architecture

📔 L'architecture partagée (compte unique, SSO, modèle d'accès, backend,
migrations) et les **garde-fous communs** sont documentés dans
**[`ARCHITECTURE.md`](./ARCHITECTURE.md)**.
